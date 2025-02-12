import axios from 'axios';
import { ethers } from 'ethers';
import { Token, APIResponseItem, LogoData } from '@/interfaces/token.interface';

const url = process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL;

export const fetchTokens = async (walletAddress: string, nativeBalance: string): Promise<Token[]> => {
  try {
    const [tokenResponse, logoResponse] = await Promise.all([
      axios.get(`${url}/api/v2/addresses/${walletAddress}/tokens?type=ERC-20`),
      axios.get('https://raw.githubusercontent.com/dome/asset/refs/heads/main/tokens.json?fbclid=IwY2xjawH-wSZleHRuA2FlbQIxMAABHaUwLSgD8RtvfHo-Yf3CROckUp7YgzmvyY-WNNER1YHTHk9VVGWc6es3YQ_aem_UPK6zvY1G1S6vjC2IHqf2A')
    ]);

    const logoData: LogoData[] = logoResponse.data.tokens;
    const tokenAddresses = tokenResponse.data.items.map((item: APIResponseItem) => item.token.address);

    const formattedData: Token[] = tokenResponse.data.items.map((item: APIResponseItem) => {
      const logoItem = logoData.find((logo) => logo.address === item.token.address);
      return {
        address: item.token.address,
        symbol: logoItem ? logoItem.symbol : item.token.symbol,
        value: ethers.utils.formatUnits(item.value, item.token.decimals),
        logoURI: logoItem ? logoItem.logoURI : null,
        chainId: logoItem ? logoItem.chainId : null,
      };
    });

    // Add tokens that are not in the wallet with value 0
    const additionalTokens = logoData
      .filter((logo) => logo.chainId === 7117 && !tokenAddresses.includes(logo.address))
      .map((logo) => ({
        address: logo.address,
        symbol: logo.symbol,
        value: '0',
        logoURI: logo.logoURI,
        chainId: logo.chainId,
      }));

    // Add native coin
    const nativeCoin: Token = {
      symbol: 'XL3',
      address: '0x0000000000000000000000000000000000000000',
      value: nativeBalance,
      logoURI: '',
      chainId: 7117,
    };

    return [nativeCoin, ...formattedData, ...additionalTokens];
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      console.error('Tokens not found, returning default tokens with value 0');
      const logoResponse = await axios.get('https://raw.githubusercontent.com/dome/asset/refs/heads/main/tokens.json?fbclid=IwY2xjawH-wSZleHRuA2FlbQIxMAABHaUwLSgD8RtvfHo-Yf3CROckUp7YgzmvyY-WNNER1YHTHk9VVGWc6es3YQ_aem_UPK6zvY1G1S6vjC2IHqf2A');
      const logoData: LogoData[] = logoResponse.data.tokens;

      const additionalTokens = logoData
        .filter((logo) => logo.chainId === 7117)
        .map((logo) => ({
          address: logo.address,
          symbol: logo.symbol,
          value: '0',
          logoURI: logo.logoURI,
          chainId: logo.chainId,
        }));

      const nativeCoin: Token = {
        symbol: 'XL3',
        address: '0x0000000000000000000000000000000000000000',
        value: '0',
        logoURI: '',
        chainId: 7117,
      };

      return [nativeCoin, ...additionalTokens];
    } else {
      console.error(err instanceof Error ? err.message : 'Unknown error');
      return [];
    }
  }
};