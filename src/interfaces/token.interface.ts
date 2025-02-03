export interface Token {
    address: string;
    symbol: string;
    value: string;
    logoURI: string | null;
  }
  
  export interface APIResponseItem {
    token: {
      address: string;
      symbol: string;
      decimals: string;
    };
    value: string;
  }
  
  export interface LogoData {
    address: string;
    symbol: string;
    logoURI: string;
  }