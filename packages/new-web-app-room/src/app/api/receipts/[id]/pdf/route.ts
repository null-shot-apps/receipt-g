import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateReceiptPDF } from '@/lib/pdf';

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

    // Generate PDF
    const pdfBlob = await generateReceiptPDF(
      receipt,
      user?.businessName,
      user?.logoUrl
    );

    // Convert blob to buffer
    const buffer = await pdfBlob.arrayBuffer();

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receipt.id}.pdf"`
      }
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

