import React from 'react';
import { Link } from 'react-router-dom';
// We import from 'react-icons/fa6' (Font Awesome 6)
import { FaChartBar, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa6';
import { HiOutlineBadgeCheck } from 'react-icons/hi'; // From Heroicons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white mb-6">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <FaChartBar size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SmartCRM</span>
            </Link>
            <p className="text-slate-400 max-w-xs leading-relaxed mb-6 text-sm">
              The next-generation CRM designed for high-precision sales teams and automated lead management.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="https://x.com/theenterprisew" className="p-2.5 bg-slate-800 hover:bg-indigo-600 rounded-full transition-all duration-300">
                <FaTwitter size={16} />
              </a>
              <a href="https://in.linkedin.com/company/theenterpriseworld" className="p-2.5 bg-slate-800 hover:bg-indigo-600 rounded-full transition-all duration-300">
                <FaLinkedin size={16} />
              </a>
              <a href="https://www.instagram.com/the_enterprise_world/" className="p-2.5 bg-slate-800 hover:bg-indigo-600 rounded-full transition-all duration-300">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-indigo-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link to="/status" className="hover:text-indigo-400 transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} SmartCRM Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;