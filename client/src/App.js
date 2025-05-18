import "./App.css";
import About from "./Components/About";
//import Header from "./Components/Header";
import Home from "./Components/Home";
import Login from "./Components/Login";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Container, Row } from "reactstrap";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Profile from "./Components/Profile";
import Register from "./Components/Register";

const App = () => {
  return (
    <Container fluid>
      <Router>
        <Row>
          <Header />
        </Row>

        <Row className="main">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </Row>

        <Row>
          <Footer />
        </Row>
      </Router>
    </Container>
  );
};

export default App;
