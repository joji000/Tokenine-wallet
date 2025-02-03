import engine from '../libs/engine.lib'

const engineChainId = process.env.ENGINE_CHAIN_ID ?? ''

export const getBalance = async (walletAddress: string) => {
  try {
    const response = await engine.backendWallet.getBalance(
      engineChainId,
      walletAddress,
      
    )
    return response
  } catch (error) {
    console.error('Balance error:', error)
    throw error // Rethrow to handle it in the calling function
  }
}

export const transferToken = async (
  fromAddress: string,
  toAddress: string,
  tokenAddress: string,
  amount: string,
  callback?: (queueId?: string | null) => void // use callback because we don't want to wait for the transfer to complete
) => {
  try {
    const response = await engine.backendWallet.transfer(
      engineChainId,
      fromAddress,
      {
        to: toAddress,
        currencyAddress: tokenAddress,
        amount,
      }
    );

    if (callback) {
      callback(response.result.queueId);
    }

    return response;
  } catch (error) {
    console.error('transferToken error:', error);
    throw error; // Rethrow to handle it in the calling function
  }
};
