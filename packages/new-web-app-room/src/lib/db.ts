// Simple in-memory database for receipts and users
// In production, replace with PostgreSQL/Prisma

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  businessName?: string;
  logoUrl?: string;
  createdAt: Date;
}

export interface Receipt {
  id: string;
  userId: string;
  txHash: string;
  blockchain: string;
  sender: string;
  receiver: string;
  amount: string;
  token: string;
  usdValue?: string;
  timestamp: Date;
  status: string;
  gasFeePaid: string;
  blockNumber: string;
  explorerUrl: string;
  createdAt: Date;
}

// In-memory storage
const users: Map<string, User> = new Map();
const receipts: Map<string, Receipt> = new Map();
const userReceipts: Map<string, string[]> = new Map(); // userId -> receiptIds[]

export const db = {
  // User operations
  users: {
    create: (user: User) => {
      users.set(user.id, user);
      return user;
    },
    findByEmail: (email: string) => {
      return Array.from(users.values()).find(u => u.email === email);
    },
    findById: (id: string) => {
      return users.get(id);
    },
    update: (id: string, data: Partial<User>) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, ...data };
      users.set(id, updated);
      return updated;
    }
  },

  // Receipt operations
  receipts: {
    create: (receipt: Receipt) => {
      receipts.set(receipt.id, receipt);
      
      // Add to user's receipts
      const userReceiptList = userReceipts.get(receipt.userId) || [];
      userReceiptList.push(receipt.id);
      userReceipts.set(receipt.userId, userReceiptList);
      
      return receipt;
    },
    findById: (id: string) => {
      return receipts.get(id);
    },
    findByUserId: (userId: string) => {
      const receiptIds = userReceipts.get(userId) || [];
      return receiptIds.map(id => receipts.get(id)).filter(Boolean) as Receipt[];
    },
    findByTxHash: (txHash: string) => {
      return Array.from(receipts.values()).find(r => r.txHash === txHash);
    }
  }
};

