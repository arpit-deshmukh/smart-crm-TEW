import React from 'react';
import { 
  FaCalendarCheck, 
  FaUsersViewfinder, 
  FaGlobe, 
  FaArrowRight,
  FaCircleCheck, 
  FaBuildingCircleCheck,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const ContactSales = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your lead submission logic here
  };

  return (
    <>
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT SIDE: Value Prop & Trust (Dark) */}
      <div className="lg:w-5/12 bg-[#0F172A] p-12 lg:p-24 flex flex-col justify-between text-white relative">
        {/* Subtle decorative radial gradient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[11px] font-black uppercase tracking-widest mb-10">
            <FaBuildingCircleCheck className="text-indigo-500" /> Enterprise-Grade CRM
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-8">
            Scale your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              revenue
            </span> operations.
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md font-medium">
            Join 5,000+ companies using SmartCRM to automate their sales pipeline and close deals 3x faster.
          </p>

          <div className="space-y-8">
            {[
              { icon: <FaCalendarCheck />, text: "Book a 30-min discovery call", color: "text-blue-400" },
              { icon: <FaUsersViewfinder />, text: "Customized demo for your team", color: "text-purple-400" },
              { icon: <FaCircleCheck />, text: "Global 24/7 technical support", color: "text-emerald-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  {React.cloneElement(item.icon, { size: 20 })}
                </div>
                <span className="text-slate-200 font-bold tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer of Sidebar */}
        <div className="relative z-10 mt-16 pt-10 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Connect with Sales</p>
              <div className="flex gap-4">
                <button className="text-slate-400 hover:text-white transition-colors"><FaLinkedin size={20}/></button>
                <button className="text-slate-400 hover:text-white transition-colors"><FaTwitter size={20}/></button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Response Time</p>
              <p className="text-emerald-400 font-bold text-sm tracking-tight">&lt; 2 Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Form (Light) */}
      <div className="lg:w-7/12 bg-slate-50 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl bg-white p-8 lg:p-16 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative">
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request a Personalized Demo</h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">Tell us about your team and we'll reach out within the hour.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Mitesh" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Kumar" 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                required
                placeholder="mitesh@company.com" 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual Revenue</label>
              <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all font-medium text-slate-600 appearance-none">
                <option>Select Range</option>
                <option>$0 - $1M</option>
                <option>$1M - $10M</option>
                <option>$10M - $50M</option>
                <option>$50M+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
              <textarea 
                rows="3" 
                placeholder="How can our sales team help you?" 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all font-medium resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Confirm Consultation 
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-6">
              Enterprise security guaranteed via <span className="text-indigo-500 underline decoration-indigo-200 underline-offset-4 cursor-pointer">SSL-256</span>
            </p>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ContactSales;