import liff from '@line/liff';

export const initLiff = async () => {
  const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID;
  if (!liffId) {
    console.error('LIFF ID is not defined');
    return;
  }

  try {
    await liff.init({ liffId });
    console.log('LIFF initialized');
  } catch (error) {
    console.error('Error initializing LIFF:', error);
  }
};

export { liff };