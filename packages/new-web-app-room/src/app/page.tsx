'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [txHash, setTxHash] = useState('');
  const [blockchain, setBlockchain] = useState('ethereum');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/receipts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ txHash, blockchain })
      });

      const data = await response.json() as any;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate receipt');
      }

      // Redirect to receipt page
      router.push(`/receipt/${data.receipt.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Crypto Receipt Generator</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/my-receipts')}
                className="text-gray-700 hover:text-blue-600"
              >
                My Receipts
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="text-gray-700 hover:text-blue-600"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Generate Professional Crypto Receipts
          </h2>
          <p className="text-xl text-gray-600">
            Paste any blockchain transaction hash and get a verifiable proof-of-payment receipt
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="blockchain" className="block text-sm font-medium text-gray-700 mb-2">
                Select Blockchain
              </label>
              <select
                id="blockchain"
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="bsc">BNB Chain (BSC)</option>
                <option value="polygon">Polygon (MATIC)</option>
                <option value="solana">Solana (SOL)</option>
                <option value="bitcoin">Bitcoin (BTC)</option>
              </select>
            </div>

            <div>
              <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Hash
              </label>
              <input
                type="text"
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x... or transaction hash"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating Receipt...' : 'Generate Receipt'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Blockchain Verified</p>
                  <p className="text-sm text-gray-600">All data fetched directly from blockchain</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">PDF Export</p>
                  <p className="text-sm text-gray-600">Download professional PDF receipts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Shareable Links</p>
                  <p className="text-sm text-gray-600">Share receipts with unique URLs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Multi-Chain Support</p>
                  <p className="text-sm text-gray-600">ETH, BSC, Polygon, Solana, Bitcoin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


