import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import PaystackPayment from '../components/PaystackPayment';
import { CreditCard, Coins } from 'lucide-react';

export default function AccountPage(){
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [billing, setBilling] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [credits, setCredits] = useState(0);
  const [showCreditPackages, setShowCreditPackages] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, b] = await Promise.all([
          api.get('/account/profile'),
          api.get('/account/billing')
        ]);
        setProfile(p.data.data);
        setBilling(b.data.data);
        setFirstName(p.data.data.first_name || '');
        setLastName(p.data.data.last_name || '');
        
        // TODO: Get credits from backend - for now using mock data
        setCredits(25); // Mock credit balance
      } catch (e){
        setError(e?.response?.data?.error?.message || 'Failed to load account');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.patch('/account/profile', { first_name: firstName, last_name: lastName });
      setProfile(res.data.data);
      setMessage('Profile updated');
    } catch (e){
      setError(e?.response?.data?.error?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const planBadge = () => {
    if (!billing) return null;
    const base = 'inline-flex items-center px-2 py-1 rounded text-xs font-medium';
    const color = billing.on_prem ? 'bg-gray-900 text-white' : billing.plan === 'pro' ? 'bg-fuchsia-600 text-white' : 'bg-blue-600 text-white';
    const label = billing.on_prem ? 'On-Premise' : billing.plan ? billing.plan.charAt(0).toUpperCase()+billing.plan.slice(1) : 'Starter';
    return <span className={`${base} ${color}`}>{label}</span>;
  };

  const creditPackages = [
    { credits: 50, price: 25, popular: false },
    { credits: 100, price: 45, popular: true },
    { credits: 250, price: 100, popular: false },
    { credits: 500, price: 180, popular: false }
  ];

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment on backend
      await api.post('/account/verify-payment', {
        reference: response.reference,
        transaction: response.transaction
      });
      
      setMessage('Payment successful! Credits have been added to your account.');
      setShowCreditPackages(false);
      
      // Refresh credits (in real implementation, get from backend)
      setCredits(prev => prev + 100); // Mock update
    } catch (error) {
      setError('Payment verification failed. Please contact support.');
    }
  };

  const handlePaymentClose = () => {
    // Payment popup was closed
  };

  if (loading){
    return <div className="p-8">Loading account…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account</h1>
        <div>{planBadge()}</div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Credits & Usage</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Available Credits</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{credits}</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Credits are used for OCR processing and AI marking.</p>
              <p className="mt-1">• 1 credit = 1 script (up to 3 pages)</p>
            </div>

            <button 
              onClick={() => setShowCreditPackages(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition"
            >
              <CreditCard className="w-4 h-4" />
              Buy Credits
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <form onSubmit={saveProfile} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">First name</label>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} className="mt-1 w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Last name</label>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} className="mt-1 w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input value={profile?.email || ''} disabled className="mt-1 w-full border rounded-md p-2 bg-gray-50" />
            </div>
            <button disabled={saving} className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-smart-indigo hover:opacity-90 disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Billing</h2>
          {billing ? (
            <div className="space-y-2 text-sm text-gray-700">
              <div>Current plan: <strong className="text-gray-900">{billing.on_prem ? 'On-Premise' : (billing.plan?.toUpperCase() || 'STARTER')}</strong></div>
              {billing.plan_seats ? <div>Seats: <strong className="text-gray-900">{billing.plan_seats}</strong></div> : null}
              {billing.is_seat && billing.parent_tenant_id ? (
                <div className="text-gray-600">You’re a seat under organization <code className="px-1 py-0.5 bg-gray-100 rounded">{billing.parent_tenant_id}</code></div>
              ) : null}
              {!billing.on_prem && (
                <div className="pt-2">
                  <Link to="/pricing" className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">View plans</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-600">Unable to load billing info.</div>
          )}
        </div>
      </div>

      {/* Credit Packages Modal */}
      {showCreditPackages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Buy Credits</h3>
                <button 
                  onClick={() => setShowCreditPackages(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2">Choose a credit package to continue using SmartScript for OCR and AI marking.</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creditPackages.map((pkg, index) => (
                  <div key={index} className={`relative border rounded-lg p-4 hover:shadow-md transition ${pkg.popular ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{pkg.credits}</div>
                      <div className="text-sm text-gray-600">Credits</div>
                      <div className="mt-2 text-lg font-semibold text-green-600">₵{pkg.price}</div>
                      <div className="text-xs text-gray-500">₵{(pkg.price / pkg.credits).toFixed(2)} per credit</div>
                    </div>
                    
                    <PaystackPayment
                      email={profile?.email || ''}
                      amount={pkg.price}
                      reference={`credit_${Date.now()}_${pkg.credits}`}
                      metadata={{
                        credits: pkg.credits,
                        package_type: 'credits',
                        user_id: profile?.user_id
                      }}
                      onSuccess={handlePaymentSuccess}
                      onClose={handlePaymentClose}
                    >
                      <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        Buy {pkg.credits} Credits
                      </button>
                    </PaystackPayment>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 mt-0.5">ℹ️</div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">About Credits:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Credits are used for OCR processing and AI marking</li>
                      <li>• 1 credit = 1 script (up to 3 pages)</li>
                      <li>• Additional pages cost extra credits</li>
                      <li>• Credits never expire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
