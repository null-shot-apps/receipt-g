import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { Receipt } from './db';

export async function generateReceiptPDF(
  receipt: Receipt,
  businessName?: string,
  logoUrl?: string
): Promise<Blob> {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
  const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100
  
  let yPos = 20;

  // Header with logo (if provided)
  if (logoUrl) {
    // In production, load and add actual logo
    // For now, just add business name
  }
  
  // Business name or default header
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text(businessName || 'Crypto Receipt', 20, yPos);
  yPos += 15;

  // Verified badge
  doc.setFillColor(...primaryColor);
  doc.roundedRect(20, yPos, 60, 10, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('✓ Verified on Blockchain', 25, yPos + 7);
  yPos += 20;

  // Transaction details box
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, yPos, 170, 80, 3, 3, 'F');
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  
  // Amount (large)
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(`${receipt.amount} ${receipt.token}`, 25, yPos + 10);
  yPos += 20;

  // USD value if available
  if (receipt.usdValue) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`≈ $${receipt.usdValue} USD`, 25, yPos);
    yPos += 15;
  } else {
    yPos += 10;
  }

  // Status
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`Status: ${receipt.status}`, 25, yPos);
  yPos += 20;

  // Details section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);

  const details = [
    ['From:', receipt.sender],
    ['To:', receipt.receiver],
    ['Date:', receipt.timestamp.toLocaleString()],
    ['Block:', receipt.blockNumber],
    ['Gas Fee:', receipt.gasFeePaid],
    ['Network:', receipt.blockchain.toUpperCase()]
  ];

  yPos += 10;
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, yPos);
    doc.setFont('helvetica', 'normal');
    const shortValue = value.length > 45 ? value.substring(0, 42) + '...' : value;
    doc.text(shortValue, 55, yPos);
    yPos += 7;
  });

  // Transaction hash
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Hash:', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  
  // Split hash into multiple lines if needed
  const hash = receipt.txHash;
  const hashParts = hash.match(/.{1,50}/g) || [hash];
  hashParts.forEach(part => {
    doc.text(part, 20, yPos);
    yPos += 5;
  });

  // QR Code
  yPos += 10;
  try {
    const qrDataUrl = await QRCode.toDataURL(receipt.explorerUrl, {
      width: 200,
      margin: 1
    });
    doc.addImage(qrDataUrl, 'PNG', 20, yPos, 40, 40);
    
    doc.setFontSize(8);
    doc.setTextColor(...textColor);
    doc.text('Scan to view on explorer', 20, yPos + 45);
  } catch (error) {
    console.error('QR code generation failed:', error);
  }

  // Footer
  yPos = 270;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // Gray-400
  doc.text('This receipt is cryptographically verifiable on the blockchain.', 20, yPos);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 20, yPos + 5);

  // Return as blob
  return doc.output('blob');
}


