import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import { 
  FaCircleCheck, 
  FaCircleExclamation, 
  FaClock, 
  FaServer, 
  FaDatabase, 
  FaCode, 
  FaGlobe,
  FaCircleInfo
} from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const SystemStatus = () => {
  // 1. State to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // 2. Effect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // 3. Formatter for the specific style in your UI
  const formattedDate = currentTime.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });

  const services = [
    { name: "Core Dashboard", status: "Operational", icon: <FaGlobe />, uptime: "99.99%" },
    { name: "API Gateway", status: "Operational", icon: <FaCode />, uptime: "99.98%" },
    { name: "Database Cluster", status: "Operational", icon: <FaDatabase />, uptime: "100%" },
    { name: "Search Engine", status: "Degraded Performance", icon: <FaServer />, uptime: "98.50%" },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Status Header */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaCircleCheck className="text-emerald-500" size={64} />
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">All Systems Operational</h1>
            {/* Updated to show real time */}
            <p className="text-slate-500 font-medium italic">Refreshed: {formattedDate}</p>
          </div>

          {/* Service Breakdown */}
          <div className="grid gap-4 mb-12">
            {services.map((service, i) => (
              <div key={i} className="bg-white px-8 py-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm group hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{service.uptime} Uptime</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${
                  service.status === "Operational" 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-amber-50 text-amber-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${service.status === "Operational" ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                  {service.status}
                </div>
              </div>
            ))}
          </div>

          {/* Historical Uptime */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <FaClock className="text-indigo-400" /> Past 90 Days Uptime
              </h2>
              <span className="text-slate-400 text-sm">99.98% Average</span>
            </div>

            <div className="flex gap-1 h-12 items-end mb-6">
              {[...Array(60)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all hover:scale-y-125 cursor-pointer ${
                    i === 45 ? 'bg-amber-500 h-6' : 'bg-emerald-500 h-10'
                  }`}
                  title={i === 45 ? "Feb 14: Degraded Performance" : "System Operational"}
                ></div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>90 Days Ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Incident History Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 px-4">Recent Incidents</h2>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
               <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase mb-2">
                 <FaCircleExclamation /> Resolved Incident
               </div>
               <h4 className="font-bold text-slate-900 mb-2 tracking-tight">Search Latency Issues</h4>
               <p className="text-slate-500 text-sm leading-relaxed mb-4">
                 We experienced higher than normal latency for our global search engine. Our engineers scaled the cluster capacity to resolve the bottleneck.
               </p>
               <span className="text-xs text-slate-400 font-medium">March 14, 2026 - 14:20 UTC</span>
            </div>
          </div>

          {/* Newsletter / Notifications CTA */}
          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
              <FaCircleInfo /> Subscribe to Status Updates
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default SystemStatus;