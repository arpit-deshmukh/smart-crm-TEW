import React from 'react';
import { 
  FaShieldHalved,   // Corrected from FaShieldLock
  FaUserCheck, 
  FaCookieBite, 
  FaCloudArrowUp, 
  FaScaleBalanced,
  FaFileArrowDown
} from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const PrivacyPolicy = () => {
  const sections = [
  { id: "collection", title: "Data Collection", icon: <FaCloudArrowUp /> },
  { id: "usage", title: "How We Use Data", icon: <FaUserCheck /> },
  { id: "cookies", title: "Cookie Policy", icon: <FaCookieBite /> },
  { id: "security", title: "Data Security", icon: <FaShieldHalved /> }, // Use FaShieldHalved here
  { id: "rights", title: "Your Legal Rights", icon: <FaScaleBalanced /> },
];

  return (
    <>
    <div className="min-h-screen bg-[#FCFCFD] flex">
      {/* LEFT SIDEBAR: Sticky Navigation */}
      <aside className="hidden lg:flex w-80 border-r border-slate-100 sticky top-0 h-screen flex-col p-10 bg-white">
        <div className="mb-10">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contents</h2>
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
              >
                <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">{section.icon}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <p className="text-xs font-bold text-indigo-900 mb-2">Download PDF</p>
          <p className="text-[10px] text-indigo-700 leading-tight mb-4 text-pretty font-medium uppercase tracking-tighter">
            Need a hard copy for your legal team?
          </p>
          <button className="flex items-center gap-2 text-indigo-600 font-black text-xs hover:text-indigo-800">
            <FaFileArrowDown /> DOWNLOAD .PDF
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 py-20 px-6 lg:px-24 bg-white">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              Updated March 2026
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              At SmartCRM, we take your data privacy seriously. This policy outlines how we handle your personal and corporate information with the highest standards of security.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-20">
            <section id="collection" className="scroll-mt-20">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="p-2 bg-slate-50 rounded-lg text-indigo-600"><FaCloudArrowUp size={20}/></span>
                1. Data We Collect
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                <p className="mb-4 font-medium">When you use SmartCRM, we collect information that helps us provide a high-precision experience:</p>
                <ul className="space-y-3 list-none pl-0">
                  {['Account Information (Name, Email, Job Title)', 'CRM Data (Leads, Contacts, Interaction Logs)', 'Device & Usage Data (IP Address, Browser Type)', 'Third-party Integrations (OAuth tokens for Slack, Google)'].map((item) => (
                    <li key={item} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                       <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2.5"></div>
                       <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="usage" className="scroll-mt-20">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="p-2 bg-slate-50 rounded-lg text-indigo-600"><FaUserCheck size={20}/></span>
                2. How We Use Data
              </h2>
              <p className="text-slate-600 leading-loose mb-4">
                We process your data to fulfill our contract with you and for our legitimate business interests, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 transition-colors">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm">Service Delivery</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Managing your CRM workspace and facilitating team collaboration.</p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 transition-colors">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm">AI Optimization</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Improving lead scoring and automated workflows through machine learning.</p>
                </div>
              </div>
            </section>

            <section id="security" className="scroll-mt-20">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="p-2 bg-slate-50 rounded-lg text-indigo-600"><FaShieldHalved size={20}/></span>
                3. Data Security
              </h2>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
                <p className="text-slate-300 text-sm leading-loose mb-6 font-medium">
                  We employ industry-leading security measures to protect your data, including:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {['AES-256 Encryption', 'TLS 1.3 in Transit', 'SOC2 Compliance', '2FA Support'].map((tech) => (
                     <li key={tech} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-white/10 p-3 rounded-xl">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div> {tech}
                     </li>
                   ))}
                </ul>
              </div>
            </section>
          </div>

          <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm italic font-medium">
              Questions about this policy? Contact us at <span className="text-indigo-600 font-bold underline cursor-pointer">privacy@smartcrm.com</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;