import liff from '@line/liff';

export const initLiff = async () => {
  try {
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID! });
    console.log('LIFF initialized');
  } catch (error) {
    console.error('Error initializing LIFF:', error);
  }
};

export { liff };