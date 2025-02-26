'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import jwt from 'jsonwebtoken';


const Line = () => {
  const { data: session } = useSession();
  const supabaseAccessToken = session?.supabaseAccessToken;
  console.log('session', session);
  console.log('token', supabaseAccessToken);
  if(supabaseAccessToken) {
    const decoded = jwt.decode(supabaseAccessToken);
    console.log('decoded', decoded);
    if (decoded && typeof decoded !== 'string') {
      const { email, sub } = decoded;
      console.log('email', email);
      console.log('sub', sub);
    }
  }

  if (session && session.user) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <p>Name {session.user.name}</p>
        <p>accesstoken {session.supabaseAccessToken}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return <p>Not signed in</p>;
};

export default Line;