import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Crown, Building2, ServerCog, Rocket, Sprout, Gift } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const features = {
  exports: 'Exports (PDF/Excel)',
  priority: 'Priority queue',
  teams: 'Multi-user / Teams',
  sso: 'SSO / SCIM',
  lms: 'LMS Integration',
  residency: 'On-Prem / Data Residency',
  support: 'Support',
  setup: 'One-time Setup Fee',
};

export default function PricingPage(){
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <PublicNavbar />
      {/* Hero */}
      <section className="relative edu-gradient-bg overflow-hidden">
        <div className="absolute inset-0 login-hero-bg opacity-[0.08]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">SmartScript — Pricing (GHS ₵)</h1>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto">Simple, transparent plans for tutors, schools, and exam authorities. Uploads are free; OCR and AI marking consume scripts.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-md bg-smart-indigo px-5 py-3 text-white shadow hover:bg-indigo-700 transition">
              Try free — 5 scripts
            </Link>
            <a href="#compare" className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50 transition">Compare plans</a>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-4 gap-6">
          <PlanCard
            icon={Gift}
            color="from-emerald-500 to-emerald-600"
            name="Free Trial"
            price="Free (5 scripts)"
            desc="5 free scripts for OCR + AI marking. No exports during trial."
            bullets={[
              '5 free scripts (OCR + AI marking)',
              "Preview one student's result per upload",
              'No exports during trial',
              'Uploads are free; scripts consumed by OCR/marking',
            ]}
            cta={{ label: 'Try Free', to: '/signup' }}
          />

          <PlanCard
            icon={Sprout}
            color="from-blue-600 to-indigo-600"
            name="Starter"
            price="₵49 / month"
            desc="Good for individual tutors and small classes"
            bullets={[
              'Up to 100 scripts / month (≤3 pages/script)',
              'OCR + AI marking',
              'Exports: PDF & Excel',
              'Basic reports & per-subject grouping',
              'Email support',
              'Extra scripts: ₵1.00 / script',
            ]}
            cta={{ label: 'Choose Starter', to: '/signup' }}
          />

          <PlanCard
            icon={Rocket}
            color="from-fuchsia-600 to-pink-600"
            name="Pro"
            price="₵149 / month"
            desc="For active tutors & small institutions"
            promoted
            bullets={[
              'Up to 500 scripts / month (≤3 pages/script)',
              'OCR + AI marking',
              'Unlimited exports',
              'Priority queue (faster processing)',
              'Advanced reporting & subject analytics',
              'Team seats (multiple users)',
              'Extra scripts: ₵0.80 / script',
            ]}
            cta={{ label: 'Go Pro', to: '/signup' }}
          />

          <PlanCard
            icon={Building2}
            color="from-amber-600 to-orange-600"
            name="Institutional (SaaS)"
            price="Custom pricing"
            desc="For schools, colleges & exam authorities"
            bullets={[
              'Flexible billing: per-student / per-teacher / bulk pool',
              'Central admin dashboard for many teachers',
              'Unlimited subjects & multiple schemes per subject',
              'Advanced analytics and cohort reports',
              'SSO (Azure AD / Google), LMS integration (optional)',
              'Priority support & onboarding',
              'Monthly or annual invoicing',
            ]}
            cta={{ label: 'Contact Sales', to: '#contact' }}
          />
        </div>
      </section>

      {/* On-Prem card */}
      <section className="pb-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-gray-200 p-6 sm:p-8 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gray-900 text-white grid place-items-center">
                  <ServerCog className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">On-Premise / Private Cloud</h3>
                  <p className="text-gray-600">₵30,000 / year (starting) + optional setup</p>
                </div>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-5 py-3 hover:bg-black transition">Discuss deployment</a>
            </div>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-gray-700">
              <li>Deployed in your environment (cloud or on-prem)</li>
              <li>Unlimited scripts (subject to infra capacity)</li>
              <li>Full admin controls, SSO, SCIM, policy controls</li>
              <li>Dedicated onboarding & premium support</li>
              <li>Data never leaves your boundary</li>
              <li>Optional: route to customer-approved OCR/LLM endpoints</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">On-prem pricing is negotiable depending on customization, infra, and support SLAs. Get in touch for a precise proposal.</p>
          </div>
        </div>
      </section>

      {/* How Billing Works */}
      <section className="py-10 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900">How Billing Works (simple & fair)</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>Upload is free. OCR & AI marking require credits (we check before starting the job).</li>
            <li>Free trial gives 5 free scripts (no exports). After trial, credits or monthly plan required to run OCR.</li>
            <li>Scripts are considered up to 3 pages by default. Extra pages are charged per page (hybrid approach).</li>
            <li>Example: If Starter covers 100 scripts (≤3 pages each), a 5‑page script counts as 1 script + 2 extra pages.</li>
            <li>Institutions can be invoiced monthly or annually (postpaid billing terms available).</li>
            <li>On-Premise billed annually + possible one-time setup fee.</li>
          </ul>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="compare" className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Quick Comparison</h2>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <Th>Feature / Plan</Th>
                  <Th>Free Trial</Th>
                  <Th>Starter (₵49/mo)</Th>
                  <Th>Pro (₵149/mo)</Th>
                  <Th>Institutional (SaaS)</Th>
                  <Th>On-Premise (₵30k/yr)</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <Tr label="Price" cells={[
                  'Free (5 scripts)',
                  '₵49 / mo',
                  '₵149 / mo',
                  'Custom (quote)',
                  '₵30,000 / yr (start)'
                ]} />
                <Tr label="Scripts included" cells={[
                  '5 free (trial)',
                  '100 / mo (≤3 pages/script)',
                  '500 / mo (≤3 pages/script)',
                  'Custom pool / per-student / per-seat',
                  'Unlimited (infra-limited)'
                ]} />
                <Tr label="Extra script cost" cells={['N/A','₵1.00 / script','₵0.80 / script','Custom','N/A']} />
                <Tr label={features.exports} cells={[False(), True(), True(), True(), True()]} />
                <Tr label={features.priority} cells={[False(), False(), True(), True(), True()]} />
                <Tr label={features.teams} cells={['❌','Limited','Yes','Full multi-tenant','Full (local)']} />
                <Tr label={features.sso} cells={['❌','❌','Optional','✅','✅']} />
                <Tr label={features.lms} cells={['❌','❌','Optional','✅','✅']} />
                <Tr label={features.residency} cells={['❌','❌','❌','Optional','✅ (by design)']} />
                <Tr label={features.support} cells={['Community','Email','Priority Email','Dedicated + Onboarding','Dedicated + SLA']} />
                <Tr label={features.setup} cells={['—','—','—','Optional','₵10,000 (est)']} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-10 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-gray-900">Example Pricing Scenarios</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-gray-700">
            <li>Small tutor: Starter ₵49/mo — handles weekly tests for a class of 30.</li>
            <li>Coaching center: Pro ₵149/mo — frequent tests, priority processing.</li>
            <li>School (SaaS): Institutional — pay per-student or bulk pool; contract with invoicing.</li>
            <li>National exam board: On-Premise — annual license + setup, data stays within agency.</li>
          </ul>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl text-center px-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-md bg-smart-blue px-6 py-3 text-white shadow hover:bg-blue-700 transition">Try Free</Link>
            <a href="#compare" className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-gray-800 hover:bg-gray-50 transition">Compare Plans</a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-6 py-3 hover:bg-black transition">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-sm text-gray-600">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-smart-indigo"/>
            <span className="font-semibold text-gray-900">SmartScript</span>
          </div>
          <nav className="flex items-center gap-6">
            <a className="hover:text-gray-900" href="#compare">Compare</a>
            <a className="hover:text-gray-900" href="#contact">Contact</a>
            <Link className="hover:text-gray-900" to="/login">Sign in</Link>
          </nav>
          <div className="text-gray-500">© {new Date().getFullYear()} SmartScript</div>
        </div>
      </footer>
    </div>
  );
}

function PlanCard({ icon: Icon, color, name, price, desc, bullets = [], cta, promoted }){
  return (
    <div className={`relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition h-full flex flex-col ${promoted ? 'ring-2 ring-fuchsia-200' : ''}`}>
      {promoted && (
        <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-3 py-1 text-white text-xs shadow">Most popular</div>
      )}
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-xl text-white grid place-items-center bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="text-gray-700">{price}</div>
        </div>
      </div>
      <p className="mt-2 text-gray-700">{desc}</p>
      <ul className="mt-4 space-y-2 text-gray-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> {b}</li>
        ))}
      </ul>
      {cta && (
        <div className="mt-auto pt-4">
          <Link to={cta.to} className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-5 py-3 hover:bg-black transition w-full justify-center">{cta.label}</Link>
        </div>
      )}
    </div>
  );
}

function Th({ children }){
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>;
}

function Tr({ label, cells = [] }){
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-900 align-top">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="px-4 py-3 text-gray-700 align-top">{renderCell(c)}</td>
      ))}
    </tr>
  );
}

function True(){
  return <span className="inline-flex items-center gap-1 text-emerald-600"><Check className="w-4 h-4"/> <span className="hidden sm:inline">Yes</span></span>;
}
function False(){
  return <span className="inline-flex items-center gap-1 text-rose-600"><X className="w-4 h-4"/> <span className="hidden sm:inline">No</span></span>;
}
function renderCell(value){
  if (value === True()) return True();
  if (value === False()) return False();
  if (value === true) return True();
  if (value === false) return False();
  return value;
}
