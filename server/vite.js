//import { static } from "express";
import { promises, existsSync } from "fs";
import { resolve } from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";

import viteConfig from "../vite.config.js";

const viteLogger = createLogger();

const app = express();
app.use(express.static("public"));

// Define the missing log function
function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = resolve(__dirname, "..", "client", "index.html");

      let template = await promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.jsx"`,
        `src="/src/main.jsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

function serveStatic(app) {
  const distPath = resolve(__dirname, "public");

  if (!existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  //app.use(static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(resolve(distPath, "index.html"));
  });
}


export default {
  log,
  setupVite,
  serveStatic,
};
