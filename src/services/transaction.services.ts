import axios from 'axios';

const url = process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL;

export const fetchTransactionData = async (walletAddress: string) => {
  try {
    const response = await axios.get(`${url}/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress
      }
    });

    const data = response.data;

    if (data.result) {
      const sendTransactions = data.result.filter((tx: { from: string }) => tx.from.toLowerCase() === walletAddress.toLowerCase());
      const receiveTransactions = data.result.filter((tx: { to: string }) => tx.to.toLowerCase() === walletAddress.toLowerCase());

      return {
        sendCount: sendTransactions.length,
        receiveCount: receiveTransactions.length,
        totalCount: data.result.length
      };
    }

    return {
      sendCount: 0,
      receiveCount: 0,
      totalCount: 0
    };
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return {
      sendCount: 0,
      receiveCount: 0,
      totalCount: 0
    };
  }
};