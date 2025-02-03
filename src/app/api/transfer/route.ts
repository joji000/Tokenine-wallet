import { NextResponse, type NextRequest } from 'next/server';

import { withAuth } from '@/server/middlewares/auth.middleware';
import { handleError } from '@/server/utils/handle-error.util';
import { transferToken } from '@/server/services/engine.service';

export const POST = withAuth(async (req: NextRequest) => {
  const { user } = req; 
  const data = await req.json(); 

  const { toAddress, tokenAddress, amount } = data;
  
  if (!user || !user.walletAddress) {
    throw new Error('User wallet address not found');
  }

  if (!toAddress || !tokenAddress || !amount) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    
    await transferToken(
      user.walletAddress, 
      toAddress,
      tokenAddress, 
      amount, 
      (queueId) => {
        console.log('Queue ID:', queueId); 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transfer token error:', error);
    return handleError(error); 
  }
});
