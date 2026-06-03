import React from 'react';
import { 
  FaUsers, 
  FaGlobe, 
  FaLightbulb, 
  FaRocket, 
  FaHandshake, 
  FaQuoteLeft 
} from 'react-icons/fa6';
import { HiOutlineSparkles } from 'react-icons/hi2';
import Footer from '../../components/common/Footer';

const About = () => {
  const values = [
    {
      title: "Human-Centric",
      desc: "We believe data should serve people, not the other way around. Our tools are built for the humans behind the leads.",
      icon: <FaUsers className="text-indigo-600" />,
    },
    {
      title: "Radical Transparency",
      desc: "From our system status to our pricing, we believe in being 100% clear with our partners and users.",
      icon: <FaHandshake className="text-indigo-600" />,
    },
    {
      title: "Constant Innovation",
      desc: "The sales landscape changes weekly. Our engineering team ships updates every Tuesday to keep you ahead.",
      icon: <FaLightbulb className="text-indigo-600" />,
    }
  ];

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative py-24 px-6 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 rounded-l-[5rem] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <HiOutlineSparkles /> Our Mission
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
              Reimagining how <span className="text-indigo-600">business</span> connects.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              SmartCRM was born in 2024 with a simple goal: to strip away the complexity of enterprise software and give sales teams a tool they actually love using.
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="h-64 bg-slate-200 rounded-[2rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Team" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="h-40 bg-indigo-600 rounded-[2rem] flex items-center justify-center p-8 text-white">
                <p className="font-bold text-2xl">Built for Scale.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-slate-900 rounded-[2rem] flex items-center justify-center p-8 text-white">
                <FaRocket size={40} className="text-indigo-400" />
              </div>
              <div className="h-64 bg-slate-200 rounded-[2rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Office" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-y border-slate-100 py-16">
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-2">5k+</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Active Users</p>
            </div>
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-2">12</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Countries</p>
            </div>
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-2">99.9%</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Uptime Record</p>
            </div>
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-2">24/7</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Global Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 max-w-xl font-medium">The principles that guide every line of code we write.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-indigo-100">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{val.title}</h3>
                <p className="text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL/QUOTE */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FaQuoteLeft className="text-indigo-100 mx-auto mb-8" size={60} />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-snug italic mb-10">
            "SmartCRM isn't just another SaaS tool. It's a partner in our growth. Their focus on clean data and human interaction changed how we close deals."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=mitesh" alt="CEO" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900">Mitesh Kumar</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">CEO @ The Enterprise World</p>
            </div>
          </div>
        </div>
      </section>
    </div>
      <Footer />
    </>
  );
};

export default About;