import React, { useState } from 'react';
import { 
  FaSlack, 
  FaGoogleDrive, 
  FaMailchimp, 
  FaHubspot, 
  FaDropbox, 
  FaTrello,
  FaMagnifyingGlass,
  FaLink,
  FaPlus
} from 'react-icons/fa6';
import { HiOutlineSquares2X2, HiOutlineCpuChip } from 'react-icons/hi2';
import Footer from '../../components/common/Footer';

const Integrations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const apps = [
    { name: "Slack", category: "Communication", icon: <FaSlack className="text-[#4A154B]" />, status: "Connected" },
    { name: "Google Drive", category: "Storage", icon: <FaGoogleDrive className="text-[#4285F4]" />, status: "Not Connected" },
    { name: "Mailchimp", category: "Marketing", icon: <FaMailchimp className="text-[#FFE01B]" />, status: "Connected" },
    { name: "HubSpot", category: "CRM Sync", icon: <FaHubspot className="text-[#FF7A59]" />, status: "Not Connected" },
    { name: "Dropbox", category: "Storage", icon: <FaDropbox className="text-[#0061FF]" />, status: "Not Connected" },
    { name: "Trello", category: "Project Management", icon: <FaTrello className="text-[#0079BF]" />, status: "Not Connected" },
  ];

  return (
    <>
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest mb-3">
              <HiOutlineCpuChip size={18} /> Ecosystem
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Connected Apps</h1>
            <p className="text-slate-500 mt-2">Sync your data across all the tools your team uses daily.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative group">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search integrations..." 
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all w-full md:w-80 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {['All Apps', 'Communication', 'Marketing', 'Storage', 'Developer'].map((cat, i) => (
            <button key={i} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.filter(app => app.name.toLowerCase().includes(searchTerm)).map((app, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="text-4xl p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {app.icon}
                </div>
                {app.status === "Connected" ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    Active
                  </span>
                ) : (
                  <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                    <FaPlus size={14} />
                  </button>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{app.name}</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">{app.category}</p>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Seamlessly sync your {app.name} data with SmartCRM to automate workflows.
              </p>

              <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${app.status === "Connected" ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}>
                {app.status === "Connected" ? "Manage Integration" : "Connect App"}
              </button>
            </div>
          ))}

          {/* Custom Webhook Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-xl shadow-indigo-200">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <FaLink size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Webhooks</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Need something custom? Build your own connection using our robust REST API.
              </p>
            </div>
            <button className="mt-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
              Read API Docs
            </button>
          </div>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
};

export default Integrations;