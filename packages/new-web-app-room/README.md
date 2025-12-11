# Crypto Receipt Generator

A full-featured web application that generates professional, verifiable proof-of-payment receipts for blockchain transactions.

## Features

### Core Functionality
- **Multi-Chain Support**: Ethereum, BNB Chain, Polygon, Solana, and Bitcoin
- **Blockchain Verification**: All data fetched directly from blockchain using free public RPC endpoints
- **Professional Receipts**: Clean, branded receipts with all transaction details
- **PDF Export**: Download receipts as professional PDF documents
- **Shareable Links**: Generate unique URLs for each receipt
- **QR Codes**: Embedded QR codes linking to blockchain explorers

### User Features
- **Authentication**: Sign up/login system to save receipts
- **Receipt History**: View all previously generated receipts
- **Custom Branding**: Add business name and logo to receipts
- **Settings Page**: Manage branding preferences

## Tech Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Styling**: Tailwind CSS 4
- **PDF Generation**: jsPDF
- **QR Codes**: qrcode library
- **Authentication**: JWT with bcryptjs
- **Database**: In-memory storage (easily replaceable with PostgreSQL/Prisma)
- **Blockchain APIs**: Free public RPC endpoints

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The app will be available at `http://localhost:8000`

### Build

```bash
pnpm build
```

### Deploy

```bash
pnpm deploy
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── receipts/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   │   │   └── pdf/route.ts
│   │   │   ├── generate/route.ts
│   │   │   └── my-receipts/route.ts
│   │   └── user/
│   │       └── settings/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── receipt/[id]/page.tsx
│   ├── my-receipts/page.tsx
│   ├── settings/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
└── lib/
    ├── auth.ts          # JWT authentication
    ├── blockchain.ts    # Blockchain API integration
    ├── db.ts           # In-memory database
    └── pdf.ts          # PDF generation
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Receipts
- `POST /api/receipts/generate` - Generate receipt from transaction hash
- `GET /api/receipts/[id]` - Get receipt by ID
- `GET /api/receipts/[id]/pdf` - Download receipt as PDF
- `GET /api/receipts/my-receipts` - Get all user's receipts

### User Settings
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update business name and logo

## Blockchain Integration

The app uses free public RPC endpoints for each blockchain:

- **Ethereum**: eth.llamarpc.com
- **BNB Chain**: bsc-dataseed.binance.org
- **Polygon**: polygon-rpc.com
- **Solana**: api.mainnet-beta.solana.com
- **Bitcoin**: blockchain.info API

## Usage

1. **Sign Up**: Create an account to save receipts
2. **Generate Receipt**: 
   - Select blockchain network
   - Paste transaction hash
   - Click "Generate Receipt"
3. **View Receipt**: See all transaction details with verification badge
4. **Download PDF**: Export receipt as professional PDF
5. **Share**: Copy shareable link to send to others
6. **Customize**: Add business name and logo in settings

## Future Enhancements

- PostgreSQL database integration
- File upload for logos
- USD price conversion API integration
- Email receipt delivery
- API key for automated receipt generation
- Advanced analytics dashboard
- Multi-language support
- Custom receipt templates

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
```

## License

MIT

