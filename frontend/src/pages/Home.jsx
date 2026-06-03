import { Link } from "react-router-dom";
import {
  FaUsers,
  FaEnvelopeOpenText,
  FaChartLine,
  FaDatabase,
  FaHandshake,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";

import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#1b1f2a] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 z-[999] flex w-full items-center justify-between bg-[#14213d]/95 px-[7%] py-[18px] backdrop-blur-md">
        <div className="landing-logo">
          <h2 className="mb-0.5 text-2xl font-bold text-white">Smart CRM</h2>
          <span className="text-xs font-medium text-[#fca311]">The Enterprise World</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="hidden font-medium text-white transition-colors hover:text-[#fca311] md:block">Features</a>
          <a href="#process" className="hidden font-medium text-white transition-colors hover:text-[#fca311] md:block">Process</a>
          <a href="#about" className="hidden font-medium text-white transition-colors hover:text-[#fca311] md:block">About</a>
          <Link to="/login" className="rounded-xl bg-[#fca311] px-[18px] py-2.5 font-bold text-[#14213d] transition-transform hover:scale-105">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid min-h-[92vh] grid-cols-1 items-center gap-10 bg-gradient-to-br from-[#14213d] via-[#1f4068] to-[#274690] px-[7%] py-24 lg:grid-cols-[1.2fr_1fr]">
        <div className="hero-left text-white">
          <span className="mb-5 inline-block rounded-full border border-[#fca311]/35 bg-[#fca311]/15 px-4 py-2 text-sm font-semibold text-[#fca311]">
            Marketing Automation CRM
          </span>
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-[54px]">
            Smart CRM System for <span className="text-[#fca311]">The Enterprise World</span>
          </h1>
          <p className="mb-7 max-w-[650px] text-lg leading-relaxed text-[#e6eaf3]">
            Manage leads, organize client data, automate outreach emails, track follow-ups, and close deals faster with one modern CRM platform.
          </p>

          <div className="mb-9 flex flex-wrap gap-4">
            <Link to="/register" className="inline-flex items-center gap-2.5 rounded-xl bg-[#fca311] px-6 py-3.5 font-bold text-[#14213d] transition-transform hover:-translate-y-0.5">
              Get Started <FaArrowRight />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2.5 rounded-xl border border-white/35 bg-transparent px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10">
              Login
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { label: "Leads Managed", val: "100+" },
              { label: "Email Campaigns", val: "50+" },
              { label: "Workflow Automation", val: "24/7" },
            ].map((stat, i) => (
              <div key={i} className="min-w-[150px] rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <h3 className="mb-1 text-2xl font-bold text-[#fca311]">{stat.val}</h3>
                <p className="m-0 text-sm text-[#eef2fb]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[500px] rounded-[22px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]"></div>
              <div className="h-3 w-3 rounded-full bg-[#febc2e]"></div>
              <div className="h-3 w-3 rounded-full bg-[#28c840]"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Total Leads", val: "128" },
                { title: "Emails Sent", val: "92" },
                { title: "Interested Clients", val: "31" },
                { title: "Deals Closed", val: "14" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-[#e9edf5] bg-[#f5f7fb] p-5">
                  <h4 className="mb-2 text-sm font-semibold text-[#5f6b7a]">{item.title}</h4>
                  <p className="text-3xl font-bold text-[#14213d]">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-[7%] py-24">
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <span className="mb-3 inline-block font-bold text-[#fca311]">Core Features</span>
          <h2 className="mb-4 text-3xl font-bold text-[#14213d] md:text-4xl">Everything needed to automate workflow</h2>
          <p className="text-base leading-relaxed text-[#5f6b7a]">This CRM helps your team research clients, store data, and convert opportunities.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <FaUsers />, title: "Lead Management", desc: "Add, manage, and filter leads with company details and notes." },
            { icon: <FaDatabase />, title: "Centralized Data", desc: "Store all company details in one secure place for team access." },
            { icon: <FaGoogle />, title: "Google Sheets Sync", desc: "Automatically push lead data into Sheets for real-time reporting." },
            { icon: <FaEnvelopeOpenText />, title: "Email Outreach", desc: "Send personalized emails and maintain professional records." },
            { icon: <FaHandshake />, title: "Deal Tracking", desc: "Monitor each lead from first contact to final closing stage." },
            { icon: <FaChartLine />, title: "Reports & Insights", desc: "View metrics like conversion rates and campaign success." },
          ].map((feature, i) => (
            <div key={i} className="group rounded-2xl border border-[#edf1f7] bg-white p-7 shadow-sm transition-transform hover:-translate-y-1.5 hover:shadow-lg">
              <div className="mb-4 text-4xl text-[#fca311]">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-[#14213d]">{feature.title}</h3>
              <p className="leading-relaxed text-[#5f6b7a]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="bg-white px-[7%] py-24">
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <span className="mb-3 inline-block font-bold text-[#fca311]">How It Works</span>
          <h2 className="text-3xl font-bold text-[#14213d] md:text-4xl">Simple workflow for marketing automation</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: 1, title: "Research", desc: "Find potential companies and decision-makers." },
            { step: 2, title: "Save Data", desc: "Add info to CRM and sync to Google Sheets." },
            { step: 3, title: "Outreach", desc: "Contact clients through personalized campaigns." },
            { step: 4, title: "Close Deals", desc: "Track interest until the sale is finalized." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-[#e9eef5] bg-[#f8fafc] p-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#14213d] text-xl font-bold text-[#fca311]">
                {item.step}
              </div>
              <h3 className="mb-3 font-bold text-[#14213d]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#5f6b7a]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="grid grid-cols-1 items-center gap-10 px-[7%] py-24 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="mb-2 inline-block font-bold text-[#fca311]">About the Platform</span>
          <h2 className="mb-4 text-3xl font-bold text-[#14213d] md:text-4xl">Built for magazine cover story sales</h2>
          <p className="mb-4 leading-loose text-[#5f6b7a]">The Smart CRM System is specially designed for The Enterprise World to manage sales operations efficiently.</p>
          <p className="leading-loose text-[#5f6b7a]">It provides a structured platform to handle research, tracking, and deal conversion.</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[#14213d] to-[#1f4068] p-8 text-white shadow-xl">
          <h3 className="mb-4 text-xl font-bold text-[#fca311]">Why this system?</h3>
          <ul className="space-y-3 list-disc pl-5">
            <li>Reduces manual work</li>
            <li>Improves lead tracking</li>
            <li>Makes outreach faster</li>
            <li>Supports follow-up automation</li>
            <li>Helps close more deals</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[7%] py-24">
        <div className="rounded-[28px] bg-gradient-to-br from-[#14213d] to-[#1f4068] p-10 text-center text-white shadow-2xl md:py-14">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to manage leads and automate outreach?</h2>
          <p className="mx-auto mb-8 max-w-[700px] leading-relaxed text-[#e8edf7]">Start using Smart CRM to simplify your workflow and improve business communication.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-[#fca311] px-6 py-3.5 font-bold text-[#14213d] transition-transform hover:scale-105">
              Create Account
            </Link>
            <Link to="/login" className="rounded-xl border border-white/45 bg-transparent px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <Footer />

      {/* Footer */}
      {/* <footer className="flex flex-col items-center justify-between gap-5 bg-[#0f172a] px-[7%] py-8 text-white md:flex-row">
        <div className="text-center md:text-left">
          <h3 className="mb-2 font-bold text-[#fca311]">Smart CRM</h3>
          <p className="text-sm text-[#cbd5e1]">A marketing automation and deal tracking system.</p>
        </div>
        <p className="text-sm text-[#cbd5e1]">© 2026 Smart CRM. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Home;