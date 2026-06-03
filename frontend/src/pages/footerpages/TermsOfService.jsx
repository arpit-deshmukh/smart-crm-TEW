import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ScrollText } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "October 24, 2023";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white">
          <Link to="/register" className="inline-flex items-center text-indigo-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to Registration
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <ScrollText size={32} />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-indigo-100">Please read these terms carefully before using Smart CRM.</p>
          <p className="text-xs mt-4 opacity-75 font-medium uppercase tracking-widest">Last Updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12 prose prose-slate max-w-none">
          
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By creating an account or using <strong>Smart CRM</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">2</span>
              Account Approval Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              To maintain system integrity, all new registrations are subject to <strong>Admin Approval</strong>. Smart CRM reserves the right to deny access to any user without prior notice if the registration information is deemed inaccurate, fraudulent, or violates our safety guidelines.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">3</span>
              Data Ownership & Privacy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You retain all rights to the customer data you upload to the CRM. We will not sell your data to third parties. Our use of your information is governed by our <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
            </p>
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
              <p className="text-sm text-amber-800 font-medium">
                <strong>Note:</strong> You are responsible for ensuring that your collection of customer data complies with local laws (GDPR, CCPA, etc.).
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">4</span>
              User Conduct
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>You must not use the CRM for sending unsolicited spam.</li>
              <li>You must not attempt to circumvent any security features.</li>
              <li>You are responsible for maintaining the confidentiality of your password.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">5</span>
              Termination
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
            </p>
          </section>

          <hr className="border-slate-200 my-10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl">
            <div>
              <h4 className="font-bold text-slate-900">Have questions?</h4>
              <p className="text-sm text-slate-500">Our support team is here to help.</p>
            </div>
            <a 
              href="mailto:support@smartcrm.com" 
              className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </a>
          </div>

        </div>
      </div>
      <p className="text-center text-slate-400 text-sm mt-8">
        &copy; {new Date().getFullYear()} Smart CRM Inc. All rights reserved.
      </p>
    </div>
  );
};

export default TermsOfService;