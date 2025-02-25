'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

const Line = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return <p>Signed in as {session.user.email} </p>;
  }

  return <p>Not signed in</p>;
};

export default Line;