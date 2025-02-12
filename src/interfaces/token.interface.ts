export interface Token {
  address: string;
  symbol: string;
  value: string;
  chainId: number;
  logoURI: string | null;
}

export interface APIResponseItem {
  token: {
    address: string;
    symbol: string;
    decimals: string;
    chainId: number;
  };
  value: string;
}

export interface LogoData {
  address: string;
  symbol: string;
  logoURI: string;
  chainId: number;
}
