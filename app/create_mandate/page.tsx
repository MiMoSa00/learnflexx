"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
// import { redirect } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const supabase = createClient();



    
  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Form state for user input
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '070', // Access Bank
    bvn: '',
    amount: '100000',
    billerCode: '000752',
    repeatEndDate: '2026-07-28',
    repeatFrequency: 'MONTHLY'
  });

  const handleCreateMandate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ✅ Check if user is logged in
      if (!user) {
        throw new Error('You must be logged in to create a mandate');
      }

      console.log('Creating mandate for user:', user.id);

      // ✅ Validate required fields
      if (!formData.accountNumber || !formData.bvn) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.bvn.length !== 11) {
        throw new Error('BVN must be 11 digits');
      }

      if (formData.accountNumber.length !== 10) {
        throw new Error('Account number must be 10 digits');
      }

      // ✅ Call your API route (backend handles encryption & Supabase lookup)
      const response = await fetch('/api/onepipe/create-mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // Backend will fetch user details from Supabase
          accountNumber: formData.accountNumber,
          bankCode: formData.bankCode,
          bvn: formData.bvn,
          amount: formData.amount,
          billerCode: formData.billerCode,
          repeatEndDate: formData.repeatEndDate,
          repeatFrequency: formData.repeatFrequency
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create mandate');
      }

      console.log('✅ Mandate created successfully:', data);
      setResult(data);

      // Optional: Clear form on success
      setFormData({
        accountNumber: '',
        bankCode: '070',
        bvn: '',
        amount: '100',
        billerCode: '000752',
        repeatEndDate: '2026-07-28',
        repeatFrequency: 'MONTHLY'
      });

    
    } catch (err: any) {
      console.error('❌ Error creating mandate:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show login message if not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Authentication Required</p>
          <p>Please log in to create a mandate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Payment Mandate</h1>

      {/* User Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm text-blue-800">
          Logged in as: <strong>{user.email}</strong>
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0000000000"
            maxLength={10}
            required
          />
        </div>

        {/* Bank Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bank <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.bankCode}
            onChange={(e) => setFormData({...formData, bankCode: e.target.value})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="070">Access Bank (070)</option>
            <option value="044">Access Bank Diamond (044)</option>
            <option value="063">Access Bank Diamond (063)</option>
            <option value="011">First Bank (011)</option>
            <option value="058">GTBank (058)</option>
            <option value="032">Union Bank (032)</option>
            <option value="033">UBA (033)</option>
            <option value="214">First City Monument Bank (214)</option>
            <option value="057">Zenith Bank (057)</option>
          </select>
        </div>

        {/* BVN */}
        <div>
          <label className="block text-sm font-medium mb-1">
            BVN (Bank Verification Number) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.bvn}
            onChange={(e) => setFormData({...formData, bvn: e.target.value.replace(/\D/g, '')})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="22222222222"
            maxLength={11}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Your 11-digit Bank Verification Number</p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value.replace(/\D/g, '')})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100000"
            required
          />
        </div>

        {/* Repeat Frequency */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Frequency
          </label>
          <select
            value={formData.repeatFrequency}
            onChange={(e) => setFormData({...formData, repeatFrequency: e.target.value})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="DAILY">Daily</option>
          </select>
        </div>

        {/* Repeat End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            value={formData.repeatEndDate}
            onChange={(e) => setFormData({...formData, repeatEndDate: e.target.value})}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreateMandate}
        disabled={loading || !formData.accountNumber || !formData.bvn}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {loading ? 'Creating Mandate...' : 'Create Mandate'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold mb-2">✅ Mandate Created Successfully!</p>
          <div className="text-sm space-y-1">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
            {result.data?.provider_response?.reference && (
              <p><strong>Reference:</strong> {result.data.provider_response.reference}</p>
            )}
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-green-800 hover:text-green-900">
              View Full Response
            </summary>
            <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded border border-green-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}