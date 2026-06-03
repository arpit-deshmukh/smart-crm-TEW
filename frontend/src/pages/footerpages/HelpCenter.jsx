import React from 'react';
import { 
  FaMagnifyingGlass, 
  FaCircleQuestion, 
  FaBookOpen, 
  FaUserGroup, 
  FaCreditCard, 
  FaShieldHalved, // Changed from FaShieldCheck
  FaCommentDots,
  FaArrowRight,
  FaPlus,
  FaRocket 
} from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const HelpCenter = () => {
 const categories = [
  { title: "Getting Started", icon: <FaRocket className="text-blue-500" />, count: 12 },
  { title: "Account & Billing", icon: <FaCreditCard className="text-emerald-500" />, count: 8 },
  { title: "Team Management", icon: <FaUserGroup className="text-purple-500" />, count: 15 },
  { title: "Security & Privacy", icon: <FaShieldHalved className="text-indigo-500" />, count: 10 }, // Use FaShieldHalved here
  { title: "Integrations", icon: <FaBookOpen className="text-orange-500" />, count: 22 },
  { title: "Common Errors", icon: <FaCircleQuestion className="text-red-500" />, count: 14 },
];

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="bg-slate-900 py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }}></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            How can we help you today?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and more..." 
              className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-2xl outline-none text-slate-900 text-lg focus:ring-4 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-400 font-medium">
            <span>Popular:</span>
            <button className="hover:text-white transition-colors underline underline-offset-4">Reset Password</button>
            <button className="hover:text-white transition-colors underline underline-offset-4">API Keys</button>
            <button className="hover:text-white transition-colors underline underline-offset-4">Import Leads</button>
          </div>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300 cursor-pointer">
              <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{cat.count} Articles</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                View Collection <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQS SECTION */}
      <div className="bg-slate-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I export my lead data?", a: "Go to Settings > Data Management > Export. You can choose CSV or JSON formats." },
              { q: "Can I add more than 50 team members?", a: "Yes, our Enterprise plan allows for unlimited team members with granular permissions." },
              { q: "Is my data encrypted?", a: "Absolutely. We use AES-256 encryption at rest and TLS 1.3 for data in transit." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <summary className="list-none p-6 font-bold text-slate-900 cursor-pointer flex justify-between items-center group-open:bg-slate-50 transition-colors">
                  {faq.q}
                  <FaPlus className="text-slate-400 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="p-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* SUPPORT CALL TO ACTION */}
      <div className="max-w-6xl mx-auto py-20 px-6 text-center">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <FaCommentDots size={48} className="mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl font-black mb-4">Still need help?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our support team is available 24/7 to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
              Start Live Chat
            </button>
            <button className="bg-indigo-500 text-white border border-indigo-400 px-10 py-4 rounded-2xl font-bold hover:bg-indigo-400 transition-all">
              Submit a Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default HelpCenter;