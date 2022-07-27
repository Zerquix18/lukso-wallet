import Web3 from 'web3';

// https://docs.lukso.tech/networks/l16-testnet/parameters
export const NETWORK_URL = 'https://rpc.l16.lukso.network';
export const CHAIN_ID = 2828;

export const IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/';

export const DEFAULT_PROVIDER = new Web3.providers.HttpProvider(NETWORK_URL);
export const DEFAULT_CONFIG = { ipfsGateway: IPFS_GATEWAY };
