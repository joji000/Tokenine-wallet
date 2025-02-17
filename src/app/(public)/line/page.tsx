'use client';
import React, { useEffect } from "react";
import liff from "@line/liff";
import jwt from 'jsonwebtoken';

const LinePage = () => {

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const isLoggedIn = await liff.isLoggedIn();
        if (!isLoggedIn) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          console.log(profile);
          const idToken = liff.getIDToken();
          console.log(idToken);
          const decodedIDToken = liff.getDecodedIDToken();
          const userid = decodedIDToken ? decodedIDToken.sub : null;
          console.log(userid);

          if (!idToken) {
            throw new Error('ID token is null');
          }
          const decodedToken = jwt.decode(idToken);

          const { sub: providerId, email } = decodedToken as jwt.JwtPayload;
          console.log('Provider ID:', providerId);
          console.log('Email:', email);
          
          // Create a custom JWT token for Supabase
          const jwtSecret = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET;
          console.log('JWT Secret:', jwtSecret); // Add this line to debug
          if (!jwtSecret) {
            throw new Error('SUPABASE_JWT_SECRET is not defined');
          }

          if (typeof jwtSecret !== 'string') {
            throw new Error('SUPABASE_JWT_SECRET is not a valid string');
          }
          
          const customToken = jwt.sign(
            { sub: providerId, email },
            jwtSecret
          );

          console.log(customToken);
        }
      } catch (error) {
        console.error('Error during login process:', error);
      }
    };

    liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID || '' })
      .then(() => {
        handleLogin();
      })
      .catch((error) => {
        console.error('LIFF initialization failed', error);
      });
  }, []);

  return (
    <div>
      <h1>Line Page</h1>
    </div>
  );
};

export default LinePage;