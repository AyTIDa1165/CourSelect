import { Link } from 'react-router-dom';
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000001] text-gray-300 py-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Column 1 - Main Info */}
          <div className="space-y-2 md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-300">Courselect</h2>
            <p className="text-md">
              In association with{" "}
              <a
                href="https://www.iiitd.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A3CBD6] hover:text-cyan-200 inline-flex items-center"
              >
                IIITD <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </p>
            <p className="text-md">
              Contact us at:{" "}
              <a
                href="mailto:course-team@iiitd.ac.in"
                className="text-[#A3CBD6] hover:text-cyan-200"
              >
                team@courselect.org
              </a>
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-1 md:w-1/2 md:text-right">
            <h3 className="text-lg font-semibold text-gray-300">Quick Links</h3>
            <ul>
                <li>
                    <a
                    href="http://techtree.iiitd.edu.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    >
                    Official Courses List
                    </a>
                </li>
                <li>
                    <a
                    href="https://iiitd.ac.in/people/faculty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    >
                    Official Faculty List
                    </a>
                </li>

                <li>
                    <Link to="/guidelines" className="text-gray-400 hover:text-white transition-colors">
                    Community Guidelines
                    </Link>
                </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-1 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {currentYear} courselect.org</p>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
