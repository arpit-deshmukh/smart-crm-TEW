import React from 'react';
import { FaChartLine, FaRobot, FaUsersGear, FaShieldHalved, FaArrowRight } from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const Features = () => {
  const features = [
    {
      title: "Advanced Analytics",
      desc: "Real-time insights into your sales pipeline with customizable dashboards.",
      icon: <FaChartLine size={24} />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "AI Automation",
      desc: "Automate repetitive tasks and follow-ups with our built-in AI engine.",
      icon: <FaRobot size={24} />,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Team Collaboration",
      desc: "Shared workspaces and task management to keep your team aligned.",
      icon: <FaUsersGear size={24} />,
      color: "from-emerald-400 to-cyan-500"
    },
    {
      title: "Enterprise Security",
      desc: "Bank-grade encryption and ISO certified data protection for your leads.",
      icon: <FaShieldHalved size={24} />,
      color: "from-orange-400 to-red-500"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#fcfdff] py-24 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Capabilities
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Powerful Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Growth</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Stop juggling spreadsheets. Everything you need to manage relationships and close deals faster is right here.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className={`mb-8 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {f.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed mb-6">
                {f.desc}
              </p>

              <button className="flex items-center text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Learn more <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Subtle accent line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-1/3 rounded-t-full" />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Features;