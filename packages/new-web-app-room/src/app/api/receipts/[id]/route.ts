import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find receipt
    const receipt = db.receipts.findById(id);
    
    if (!receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      );
    }

    // Get user info for business name/logo
    const user = db.users.findById(receipt.userId);

    return NextResponse.json({
      success: true,
      receipt,
      businessName: user?.businessName,
      logoUrl: user?.logoUrl
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

