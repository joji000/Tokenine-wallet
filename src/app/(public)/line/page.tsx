'use client';
import React, { useEffect } from "react";
import { initLiff, liff } from '@/libs/line.lib';

const LinePage = () => {

    useEffect(() => {
        initLiff().then(() => {
            handlelogin();
        });
    
    }, []);

    const handlelogin = async () => {
        try{

            const isLoggedIn = await liff.isLoggedIn();
            console.log(isLoggedIn);
            if(!isLoggedIn){
                liff.login();
            }

            const profile = await liff.getProfile();
            console.log(profile);
            const idToken = liff.getIDToken();
            console.log(idToken);
            const decodedIdToken = liff.getDecodedIDToken();
            console.log(decodedIdToken?.email);
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div>
      <h1>Line Page</h1>
    </div>
  );
};

export default LinePage;