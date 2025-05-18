import { Link } from "wouter";
import '../index.css';

const Footer = () => {
  return (
    <footer className="bg-ocean-dark text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">
              Ocean<span className="text-secondary">Cruises</span>
            </h3>
            <p className="text-sm">
              Experience the vacation of a lifetime with our premium cruise packages to destinations worldwide.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-white hover:text-accent">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-accent">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-accent">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-accent">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Destinations</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cruises?destination=caribbean" className="text-sm hover:text-accent">
                  Caribbean
                </Link>
              </li>
              <li>
                <Link href="/cruises?destination=mediterranean" className="text-sm hover:text-accent">
                  Mediterranean
                </Link>
              </li>
              <li>
                <Link href="/cruises?destination=alaska" className="text-sm hover:text-accent">
                  Alaska
                </Link>
              </li>
              <li>
                <Link href="/cruises?destination=europe" className="text-sm hover:text-accent">
                  Europe
                </Link>
              </li>
              <li>
                <Link href="/cruises?destination=asia" className="text-sm hover:text-accent">
                  Asia
                </Link>
              </li>
              <li>
                <Link href="/cruises?destination=southamerica" className="text-sm hover:text-accent">
                  South America
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-accent">About Us</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-accent">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-accent">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-accent">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-accent">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-accent">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <p className="text-sm flex items-start">
                <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                123 Cruise Way, Miami, FL 33101
              </p>
              <p className="text-sm flex items-start">
                <i className="fas fa-phone-alt mr-2 mt-1"></i>
                +1 (800) 123-4567
              </p>
              <p className="text-sm flex items-start">
                <i className="fas fa-envelope mr-2 mt-1"></i>
                info@oceancruises.com
              </p>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md text-text-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} OceanCruises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;