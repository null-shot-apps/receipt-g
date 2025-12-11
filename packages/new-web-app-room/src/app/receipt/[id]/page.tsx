'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

interface Receipt {
  id: string;
  txHash: string;
  blockchain: string;
  sender: string;
  receiver: string;
  amount: string;
  token: string;
  usdValue?: string;
  timestamp: string;
  status: string;
  gasFeePaid: string;
  blockNumber: string;
  explorerUrl: string;
}

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await fetch(`/api/receipts/${resolvedParams.id}`);
        const data = await response.json() as any;

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load receipt');
        }

        setReceipt(data.receipt);
        setBusinessName(data.businessName || '');

        // Generate QR code
        const qr = await QRCode.toDataURL(data.receipt.explorerUrl);
        setQrCode(qr);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [resolvedParams.id]);

  const handleDownloadPDF = () => {
    window.open(`/api/receipts/${resolvedParams.id}/pdf`, '_blank');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Receipt link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Receipt not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <div className="space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Share Link
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {businessName || 'Crypto Receipt'}
            </h1>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified on Blockchain
            </div>
          </div>

          {/* Amount */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Amount</p>
            <p className="text-4xl font-bold text-gray-900">
              {receipt.amount} {receipt.token}
            </p>
            {receipt.usdValue && (
              <p className="text-xl text-gray-600 mt-2">≈ ${receipt.usdValue} USD</p>
            )}
            <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {receipt.status}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">From</p>
              <p className="text-sm font-mono bg-gray-50 p-3 rounded break-all">{receipt.sender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">To</p>
              <p className="text-sm font-mono bg-gray-50 p-3 rounded break-all">{receipt.receiver}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date & Time</p>
              <p className="font-semibold">{new Date(receipt.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Block Number</p>
              <p className="font-semibold">{receipt.blockNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Gas Fee</p>
              <p className="font-semibold">{receipt.gasFeePaid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Network</p>
              <p className="font-semibold uppercase">{receipt.blockchain}</p>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Transaction Hash</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-mono break-all text-gray-700">{receipt.txHash}</p>
            </div>
            <a
              href={receipt.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-2"
            >
              View on Explorer
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-4">Scan to view on blockchain explorer</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>This receipt is cryptographically verifiable on the blockchain.</p>
            <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



