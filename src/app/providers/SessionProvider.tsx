'use client';
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: ReactNode;
}

const CustomSessionProvider = (props: Props) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};

export default CustomSessionProvider;