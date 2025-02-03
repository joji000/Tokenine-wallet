import axios from 'axios';
import { ethers } from 'ethers';
import { Token, APIResponseItem, LogoData } from '@/interfaces/token.interface';

const url = process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL;

export const fetchTokens = async (walletAddress: string): Promise<Token[]> => {
  try {
    const [tokenResponse, logoResponse] = await Promise.all([
      axios.get(`${url}/api/v2/addresses/${walletAddress}/tokens?type=ERC-20`),
      axios.get('https://raw.githubusercontent.com/dome/asset/refs/heads/main/tokens.json?fbclid=IwY2xjawH-wSZleHRuA2FlbQIxMAABHaUwLSgD8RtvfHo-Yf3CROckUp7YgzmvyY-WNNER1YHTHk9VVGWc6es3YQ_aem_UPK6zvY1G1S6vjC2IHqf2A')
    ]);

    if (tokenResponse.data.items) {
      const logoData: LogoData[] = logoResponse.data.tokens;
      const formattedData: Token[] = tokenResponse.data.items.map((item: APIResponseItem) => {
        const logoItem = logoData.find((logo) => logo.address === item.token.address);
        return {
          address: item.token.address,
          symbol: logoItem ? logoItem.symbol : item.token.symbol,
          value: ethers.utils.formatUnits(item.value, item.token.decimals),
          logoURI: logoItem ? logoItem.logoURI : null,
        };
      });
      return formattedData;
    } else {
      console.error('Failed to fetch tokens');
      return [];
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Unknown error');
    return [];
  }
};