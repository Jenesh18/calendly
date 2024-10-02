import { Facebook, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-100 py-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold">About Us</h3>
            <p className="text-sm">
              Your mission statement or a brief description about your company.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="text-sm">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/services">Services</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="text-sm">Email: info@example.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
        </div> */}

        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-6 w-6 text-gray-600 hover:text-blue-500 transition duration-300" />
          </a>
        </div>

        <p className="text-sm">© 2024 Your Company. All rights reserved.</p>
        {/* <p className="text-xs">
          <a href="/privacy-policy">Privacy Policy</a> |{" "}
          <a href="/terms-of-service">Terms of Service</a>
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;
