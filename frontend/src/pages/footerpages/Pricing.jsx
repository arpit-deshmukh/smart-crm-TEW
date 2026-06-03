import React, { useState } from 'react';
import { FaCheck, FaCircleCheck } from 'react-icons/fa6';
import Footer from '../../components/common/Footer';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    { 
      name: "Starter", 
      price: isAnnual ? "24" : "29", 
      desc: "Perfect for solopreneurs starting their journey.",
      features: ["500 Contacts", "Basic Analytics", "Email Support", "1 Workspace"],
      buttonVariant: "secondary"
    },
    { 
      name: "Professional", 
      price: isAnnual ? "69" : "79", 
      desc: "Advanced tools for growing sales teams.",
      features: ["5000 Contacts", "AI Automation", "Priority Support", "Custom Reports", "Team Permissions"], 
      popular: true,
      buttonVariant: "primary"
    },
    { 
      name: "Enterprise", 
      price: isAnnual ? "159" : "199", 
      desc: "Scale without limits and stay secure.",
      features: ["Unlimited Contacts", "Custom API", "Dedicated Manager", "SSO Encryption", "SLA Guarantee"],
      buttonVariant: "secondary"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-24 px-6">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Pricing Plans</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Ready to scale your business?</h1>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-indigo-600 rounded-full relative p-1 transition-all duration-300"
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
                Yearly <span className="ml-1 text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col h-full
                ${tier.popular 
                  ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white text-slate-900 border border-slate-200 hover:border-indigo-300 hover:shadow-xl'}`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${tier.popular ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                <p className={`text-sm leading-relaxed ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tier.desc}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">${tier.price}</span>
                  <span className={`${tier.popular ? 'text-slate-400' : 'text-slate-500'} font-medium`}>/mo</span>
                </div>
                {isAnnual && <p className="text-xs mt-2 text-indigo-400 font-medium italic">Billed annually</p>}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-medium">
                    {tier.popular 
                        ? <FaCircleCheck className="text-indigo-400 mt-1 flex-shrink-0" /> 
                        : <FaCheck className="text-indigo-600 mt-1 flex-shrink-0" />
                    }
                    <span className={tier.popular ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95
                ${tier.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                Start Free Trial
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-slate-500 text-sm">
            No credit card required. Cancel anytime. 14-day free trial on all plans.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;