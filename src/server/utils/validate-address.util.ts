import { ethers } from 'ethers'

export const isValidEthereumAddress = (address: string): boolean =>
  ethers.utils.isAddress(address)
