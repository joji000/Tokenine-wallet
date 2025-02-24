'use client';
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { initLiff, liff } from '@/libs/line.lib';

const LinePage = () => {
  const router = useRouter();

  useEffect(() => {
    initLiff().then(() => {
      handleLogin();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    try {
      const isLoggedIn = await liff.isLoggedIn();
      if (!isLoggedIn) {
        liff.login();
      }

      const idToken = liff.getIDToken();
      console.log("ID Token:", idToken);

      // Send the ID token to the server
      const response = await fetch('/api/auth/callback/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const { redirectTo } = await response.json();
        console.log("Server Response:", redirectTo);
        router.push(redirectTo);
      } else {
        const errorText = await response.text();
        console.error('Failed to authenticate with the server:', errorText);
      }
    } catch (error) {
      console.error('Error during LIFF login:', error);
    }
  };

  return (
    <div>
      <h1>Line Page</h1>
    </div>
  );
};

export default LinePage;