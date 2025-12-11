import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { fetchTransactionData } from '@/lib/blockchain';

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = auth.verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json() as { txHash: string; blockchain: string };
    const { txHash, blockchain } = body;

    // Validate input
    if (!txHash || !blockchain) {
      return NextResponse.json(
        { error: 'Transaction hash and blockchain are required' },
        { status: 400 }
      );
    }

    // Check if receipt already exists
    const existingReceipt = db.receipts.findByTxHash(txHash);
    if (existingReceipt) {
      return NextResponse.json({
        success: true,
        receipt: existingReceipt
      });
    }

    // Fetch blockchain data
    let blockchainData;
    try {
      blockchainData = await fetchTransactionData(txHash, blockchain);
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch transaction data. Please check the transaction hash and blockchain.' },
        { status: 400 }
      );
    }

    // Create receipt
    const receipt = db.receipts.create({
      id: crypto.randomUUID(),
      userId: payload.userId,
      txHash,
      blockchain,
      sender: blockchainData.sender,
      receiver: blockchainData.receiver,
      amount: blockchainData.amount,
      token: blockchainData.token,
      usdValue: blockchainData.usdValue,
      timestamp: blockchainData.timestamp,
      status: blockchainData.status,
      gasFeePaid: blockchainData.gasFeePaid,
      blockNumber: blockchainData.blockNumber,
      explorerUrl: blockchainData.explorerUrl,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      receipt
    });
  } catch (error) {
    console.error('Generate receipt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



