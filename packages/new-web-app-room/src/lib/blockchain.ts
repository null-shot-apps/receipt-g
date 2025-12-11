// Blockchain API integration using free public endpoints

export interface BlockchainData {
  sender: string;
  receiver: string;
  amount: string;
  token: string;
  timestamp: Date;
  status: string;
  gasFeePaid: string;
  blockNumber: string;
  explorerUrl: string;
  usdValue?: string;
}

// Ethereum (using Etherscan API - free tier)
async function fetchEthereumTx(txHash: string): Promise<BlockchainData> {
  // Using public Ethereum RPC endpoint
  const response = await fetch('https://eth.llamarpc.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 1
    })
  });

  const data = await response.json() as any;
  const tx = data.result;

  if (!tx) {
    throw new Error('Transaction not found');
  }

  // Get transaction receipt for status
  const receiptResponse = await fetch('https://eth.llamarpc.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 2
    })
  });

  const receiptData = await receiptResponse.json() as any;
  const receipt = receiptData.result;

  // Convert hex values
  const value = parseInt(tx.value, 16) / 1e18; // Convert Wei to ETH
  const gasUsed = receipt ? parseInt(receipt.gasUsed, 16) : 0;
  const gasPrice = parseInt(tx.gasPrice, 16);
  const gasFee = (gasUsed * gasPrice) / 1e18;

  // Get block for timestamp
  const blockResponse = await fetch('https://eth.llamarpc.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [tx.blockNumber, false],
      id: 3
    })
  });

  const blockData = await blockResponse.json() as any;
  const block = blockData.result;
  const timestamp = new Date(parseInt(block.timestamp, 16) * 1000);

  return {
    sender: tx.from,
    receiver: tx.to,
    amount: value.toFixed(6),
    token: 'ETH',
    timestamp,
    status: receipt && receipt.status === '0x1' ? 'Success' : 'Failed',
    gasFeePaid: gasFee.toFixed(6) + ' ETH',
    blockNumber: parseInt(tx.blockNumber, 16).toString(),
    explorerUrl: `https://etherscan.io/tx/${txHash}`
  };
}

// BNB Chain (BSC)
async function fetchBscTx(txHash: string): Promise<BlockchainData> {
  const response = await fetch('https://bsc-dataseed.binance.org/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 1
    })
  });

  const data = await response.json() as any;
  const tx = data.result;

  if (!tx) {
    throw new Error('Transaction not found');
  }

  const receiptResponse = await fetch('https://bsc-dataseed.binance.org/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 2
    })
  });

  const receiptData = await receiptResponse.json() as any;
  const receipt = receiptData.result;

  const value = parseInt(tx.value, 16) / 1e18;
  const gasUsed = receipt ? parseInt(receipt.gasUsed, 16) : 0;
  const gasPrice = parseInt(tx.gasPrice, 16);
  const gasFee = (gasUsed * gasPrice) / 1e18;

  const blockResponse = await fetch('https://bsc-dataseed.binance.org/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [tx.blockNumber, false],
      id: 3
    })
  });

  const blockData = await blockResponse.json() as any;
  const block = blockData.result;
  const timestamp = new Date(parseInt(block.timestamp, 16) * 1000);

  return {
    sender: tx.from,
    receiver: tx.to,
    amount: value.toFixed(6),
    token: 'BNB',
    timestamp,
    status: receipt && receipt.status === '0x1' ? 'Success' : 'Failed',
    gasFeePaid: gasFee.toFixed(6) + ' BNB',
    blockNumber: parseInt(tx.blockNumber, 16).toString(),
    explorerUrl: `https://bscscan.com/tx/${txHash}`
  };
}

// Polygon
async function fetchPolygonTx(txHash: string): Promise<BlockchainData> {
  const response = await fetch('https://polygon-rpc.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 1
    })
  });

  const data = await response.json() as any;
  const tx = data.result;

  if (!tx) {
    throw new Error('Transaction not found');
  }

  const receiptResponse = await fetch('https://polygon-rpc.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 2
    })
  });

  const receiptData = await receiptResponse.json() as any;
  const receipt = receiptData.result;

  const value = parseInt(tx.value, 16) / 1e18;
  const gasUsed = receipt ? parseInt(receipt.gasUsed, 16) : 0;
  const gasPrice = parseInt(tx.gasPrice, 16);
  const gasFee = (gasUsed * gasPrice) / 1e18;

  const blockResponse = await fetch('https://polygon-rpc.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [tx.blockNumber, false],
      id: 3
    })
  });

  const blockData = await blockResponse.json() as any;
  const block = blockData.result;
  const timestamp = new Date(parseInt(block.timestamp, 16) * 1000);

  return {
    sender: tx.from,
    receiver: tx.to,
    amount: value.toFixed(6),
    token: 'MATIC',
    timestamp,
    status: receipt && receipt.status === '0x1' ? 'Success' : 'Failed',
    gasFeePaid: gasFee.toFixed(6) + ' MATIC',
    blockNumber: parseInt(tx.blockNumber, 16).toString(),
    explorerUrl: `https://polygonscan.com/tx/${txHash}`
  };
}

// Solana (using public RPC)
async function fetchSolanaTx(txHash: string): Promise<BlockchainData> {
  const response = await fetch('https://api.mainnet-beta.solana.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [
        txHash,
        { encoding: 'json', maxSupportedTransactionVersion: 0 }
      ]
    })
  });

  const data = await response.json() as any;
  const tx = data.result;

  if (!tx) {
    throw new Error('Transaction not found');
  }

  const meta = tx.meta;
  const preBalances = meta.preBalances;
  const postBalances = meta.postBalances;
  
  // Calculate amount transferred (simplified)
  const amount = Math.abs(postBalances[0] - preBalances[0]) / 1e9; // Convert lamports to SOL
  const fee = meta.fee / 1e9;

  return {
    sender: tx.transaction.message.accountKeys[0],
    receiver: tx.transaction.message.accountKeys[1] || 'Multiple',
    amount: amount.toFixed(6),
    token: 'SOL',
    timestamp: new Date(tx.blockTime * 1000),
    status: meta.err ? 'Failed' : 'Success',
    gasFeePaid: fee.toFixed(6) + ' SOL',
    blockNumber: tx.slot.toString(),
    explorerUrl: `https://solscan.io/tx/${txHash}`
  };
}

// Bitcoin (using blockchain.info API)
async function fetchBitcoinTx(txHash: string): Promise<BlockchainData> {
  const response = await fetch(`https://blockchain.info/rawtx/${txHash}`);
  
  if (!response.ok) {
    throw new Error('Transaction not found');
  }

  const tx = await response.json() as any;

  // Calculate total input and output
  const totalInput = tx.inputs.reduce((sum: number, input: { prev_out: { value: number } }) => 
    sum + input.prev_out.value, 0);
  const totalOutput = tx.out.reduce((sum: number, output: { value: number }) => 
    sum + output.value, 0);
  
  const amount = totalOutput / 1e8; // Convert satoshis to BTC
  const fee = (totalInput - totalOutput) / 1e8;

  return {
    sender: tx.inputs[0]?.prev_out?.addr || 'Multiple',
    receiver: tx.out[0]?.addr || 'Multiple',
    amount: amount.toFixed(8),
    token: 'BTC',
    timestamp: new Date(tx.time * 1000),
    status: 'Confirmed',
    gasFeePaid: fee.toFixed(8) + ' BTC',
    blockNumber: tx.block_height?.toString() || 'Pending',
    explorerUrl: `https://blockchain.info/tx/${txHash}`
  };
}

export async function fetchTransactionData(
  txHash: string,
  blockchain: string
): Promise<BlockchainData> {
  switch (blockchain.toLowerCase()) {
    case 'ethereum':
    case 'eth':
      return fetchEthereumTx(txHash);
    case 'bsc':
    case 'bnb':
      return fetchBscTx(txHash);
    case 'polygon':
    case 'matic':
      return fetchPolygonTx(txHash);
    case 'solana':
    case 'sol':
      return fetchSolanaTx(txHash);
    case 'bitcoin':
    case 'btc':
      return fetchBitcoinTx(txHash);
    default:
      throw new Error('Unsupported blockchain');
  }
}









