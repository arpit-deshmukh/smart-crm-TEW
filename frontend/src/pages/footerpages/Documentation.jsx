import React, { useState } from 'react';
import { 
  FaBook, 
  FaCode, 
  FaRocket, 
  FaUserLock, 
  FaTerminal, 
  FaMagnifyingGlass,
  FaChevronRight,
  FaCircleInfo
} from 'react-icons/fa6';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("Getting Started");

  const menuItems = [
    { name: "Getting Started", icon: <FaRocket /> },
    { name: "API Reference", icon: <FaCode /> },
    { name: "Authentication", icon: <FaUserLock /> },
    { name: "Webhooks", icon: <FaTerminal /> },
    { name: "Data Security", icon: <FaCircleInfo /> },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-80 border-r border-slate-100 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 text-indigo-600 font-black text-xl">
          <FaBook size={24} /> <span>Docs</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.name 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.name}
              </div>
              {activeTab === item.name && <FaChevronRight size={12} />}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-slate-900 rounded-3xl text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Need Help?</p>
          <p className="text-sm mb-4 text-slate-300">Our engineers are available for 1-on-1 technical calls.</p>
          <button className="text-indigo-400 text-sm font-bold hover:text-white transition-colors">Contact Support →</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Internal Search bar */}
          <div className="relative mb-12">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
            />
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <span>SmartCRM</span>
            <FaChevronRight size={8} />
            <span className="text-indigo-600">{activeTab}</span>
          </div>

          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">{activeTab}</h1>
          
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Welcome to the SmartCRM developer portal. Use this guide to integrate our high-precision data tools into your existing tech stack.
          </p>

          {/* Alert Box */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl mb-10 flex gap-4">
            <FaCircleInfo className="text-amber-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">Developer Notice</h4>
              <p className="text-amber-800 text-sm">All API requests must be made over HTTPS. Unauthorized HTTP requests will be rejected by our gateway.</p>
            </div>
          </div>

          {/* Content Section Example */}
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Base URL</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Send all API requests to the following endpoint:
              </p>
              <div className="bg-slate-900 p-5 rounded-2xl font-mono text-indigo-300 text-sm overflow-x-auto shadow-xl">
                <code>https://api.SmartCRM.com/v1/</code>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Example Request</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Retrieve a list of all current leads assigned to your account.
              </p>
              <div className="bg-slate-900 p-6 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <pre className="text-slate-300 text-sm font-mono leading-relaxed">
{`curl -X GET "https://api.SmartCRM.com/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;