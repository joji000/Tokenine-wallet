import axios from "axios";
import { ethers } from "ethers";
import { Token, APIResponseItem, LogoData } from "@/interfaces/token.interface";

const url = process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL;

export const fetchTokens = async (
  walletAddress: string,
  nativeBalance: string
): Promise<Token[]> => {
  try {
    const [tokenResponse, logoResponse] = await Promise.all([
      axios.get(`${url}/api/v2/addresses/${walletAddress}/tokens?type=ERC-20`),
      axios.get(
        "https://raw.githubusercontent.com/dome/asset/refs/heads/main/tokens.json?fbclid=IwY2xjawH-wSZleHRuA2FlbQIxMAABHaUwLSgD8RtvfHo-Yf3CROckUp7YgzmvyY-WNNER1YHTHk9VVGWc6es3YQ_aem_UPK6zvY1G1S6vjC2IHqf2A"
      ),
    ]);

    const logoData: LogoData[] = logoResponse.data.tokens;
    let formattedData: Token[] = tokenResponse.data.items
      .filter((item: APIResponseItem) => item.token.chainId === 7117)
      .map((item: APIResponseItem) => {
        const logoItem = logoData.find(
          (logo) => logo.address === item.token.address
        );
        return {
          address: item.token.address,
          symbol: logoItem ? logoItem.symbol : item.token.symbol,
          value: ethers.utils.formatUnits(item.value, item.token.decimals),
          logoURI: logoItem ? logoItem.logoURI : null,
        };
      });

    // If no ERC-20 tokens are found, return all tokens from tokens.json with zero value
    if (formattedData.length === 0) {
      formattedData = logoData
        .filter((logoItem) => logoItem.chainId === 7117)
        .map((logoItem) => ({
          address: logoItem.address,
          symbol: logoItem.symbol,
          value: "0",
          logoURI: logoItem.logoURI,
          chainId: logoItem.chainId,
        }));
    }

    // Add native coin
    const nativeCoin: Token = {
      symbol: "XL3",
      address: "0x0000000000000000000000000000000000000000",
      value: nativeBalance,
      chainId: 7117,
      logoURI: "",
    };

    return [nativeCoin, ...formattedData];
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Unknown error");
    const logoResponse = await axios.get(
      "https://raw.githubusercontent.com/dome/asset/refs/heads/main/tokens.json?fbclid=IwY2xjawH-wSZleHRuA2FlbQIxMAABHaUwLSgD8RtvfHo-Yf3CROckUp7YgzmvyY-WNNER1YHTHk9VVGWc6es3YQ_aem_UPK6zvY1G1S6vjC2IHqf2A"
    );
    const logoData: LogoData[] = logoResponse.data.tokens;
    const formattedData = logoData
      .filter((logoItem) => logoItem.chainId === 7117)
      .map((logoItem) => ({
        address: logoItem.address,
        symbol: logoItem.symbol,
        value: "0",
        logoURI: logoItem.logoURI,
        chainId: logoItem.chainId,
      }));
    return [
      {
        symbol: "XL3",
        address: "0x0000000000000000000000000000000000000000",
        value: "0",
        logoURI: "",
        chainId: 7117,
      },
      ...formattedData,
    ];
  }
};
