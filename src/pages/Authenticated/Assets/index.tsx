import { Heading, Progress } from "react-bulma-components";
import { useQueries } from "@tanstack/react-query";

import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import LSP10ReceivedVaults from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';
import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';
import LSP4schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import { LSP4DigitalAsset } from "@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset";

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IAsset, IVault } from "../../../models";

import AssetList from "./AssetList";

const LSP7MintableAbi = LSP7Mintable.abi as any;
const LSP9VaultAbi = LSP9Vault.abi as any;

function Assets() {
  const { address, web3 } = useAuthenticatedUser();

  const fetchAssets = async () => {
    const erc725 = new ERC725(
      LSP3UniversalProfileMetadata as ERC725JSONSchema[],
      address,
      DEFAULT_PROVIDER,
      DEFAULT_CONFIG
    );

    const data = await erc725.fetchData(['LSP12IssuedAssets[]', 'LSP5ReceivedAssets[]']);
    const contractIds = Array.from(new Set(data.map(item => item.value as string).flat()));

    const promises = contractIds.map(async contractId => {
      const contractErc725 = new ERC725(LSP4schema as ERC725JSONSchema[], contractId, DEFAULT_PROVIDER, DEFAULT_CONFIG);

      const myToken = new web3.eth.Contract(LSP7MintableAbi, contractId);

      const [
        [LSP4TokenName, LSP4TokenSymbol, LSP4Metadata, LSP4Creators],
        weiBalance,
        owner,
        weiTotalSupply,
        strDecimals,
      ] = await Promise.all(
        [
          contractErc725.fetchData(['LSP4TokenName', 'LSP4TokenSymbol', 'LSP4Metadata', 'LSP4Creators[]']),
          myToken.methods.balanceOf(address).call(),
          myToken.methods.owner().call(),
          myToken.methods.totalSupply().call(),
          myToken.methods.decimals().call(),
        ]
      );

      const id = contractId;
      const name = LSP4TokenName.value as string;
      const symbol = LSP4TokenSymbol.value as string;
      const metadata = (LSP4Metadata.value as any).LSP4Metadata as LSP4DigitalAsset;
      const creators = LSP4Creators.value as string[];

      const balance = parseFloat(web3.utils.fromWei(weiBalance));
      const totalSupply = parseFloat(web3.utils.fromWei(weiTotalSupply));
      const decimals = parseFloat(strDecimals);

      const asset: IAsset = { id, name, symbol, metadata, creators, balance, owner, totalSupply, decimals };

      return asset;
    });

    const assets = await Promise.all(promises);
    return assets;
  };

  const fetchVaults = async () => {
    const erc725 = new ERC725(
      LSP10ReceivedVaults as ERC725JSONSchema[],
      address,
      DEFAULT_PROVIDER,
      DEFAULT_CONFIG
    );

    const data = await erc725.fetchData('LSP10Vaults[]');
    const vaultIds = data.value as string[];

    const promises = vaultIds.map(async vaultId => {
      const myVault = new web3.eth.Contract(LSP9VaultAbi, vaultId);
      const owner = await myVault.methods.owner().call();

      const erc725 = new ERC725(
        LSP3UniversalProfileMetadata as ERC725JSONSchema[],
        vaultId,
        DEFAULT_PROVIDER,
        DEFAULT_CONFIG
      );
  
      const data = await erc725.fetchData(['LSP12IssuedAssets[]', 'LSP5ReceivedAssets[]']);
      const contractIds = Array.from(new Set(data.map(item => item.value as string).flat()));
      
      const promises = contractIds.map(async contractId => {
        const contractErc725 = new ERC725(LSP4schema as ERC725JSONSchema[], contractId, DEFAULT_PROVIDER, DEFAULT_CONFIG);
  
        const myToken = new web3.eth.Contract(LSP7MintableAbi, contractId);
  
        const [
          [LSP4TokenName, LSP4TokenSymbol, LSP4Metadata, LSP4Creators],
          weiBalance,
          owner,
          weiTotalSupply,
          strDecimals,
        ] = await Promise.all(
          [
            contractErc725.fetchData(['LSP4TokenName', 'LSP4TokenSymbol', 'LSP4Metadata', 'LSP4Creators[]']),
            myToken.methods.balanceOf(vaultId).call(),
            myToken.methods.owner().call(),
            myToken.methods.totalSupply().call(),
            myToken.methods.decimals().call(),
          ]
        );
  
        const id = contractId;
        const name = LSP4TokenName.value as string;
        const symbol = LSP4TokenSymbol.value as string;
        const metadata = (LSP4Metadata.value as any).LSP4Metadata as LSP4DigitalAsset;
        const creators = LSP4Creators.value as string[];
  
        const balance = parseFloat(web3.utils.fromWei(weiBalance));
        const totalSupply = parseFloat(web3.utils.fromWei(weiTotalSupply));
        const decimals = parseFloat(strDecimals);
  
        const asset: IAsset = { id, name, symbol, metadata, creators, balance, owner, totalSupply, decimals };
  
        return asset;
      });

      const assets = await Promise.all(promises);

      return { id: vaultId, owner, assets };
    });

    const vaults: IVault[] = await Promise.all(promises);
    return vaults;
  };

  const [
    { isLoading: isLoadingAssets, data: assets },
    { isLoading: isLoadingVaults, data: vaults },
  ] = useQueries({
    queries: [
      { queryKey: ['assets'], queryFn: fetchAssets },
      { queryKey: ['vaults'], queryFn: fetchVaults },
    ]
  });

  const isLoading = isLoadingAssets || isLoadingVaults;

  return (
    <div>
      <Heading>
        Assets
      </Heading>
      <Heading subtitle>Manage your tokens and NFTs.</Heading>

      {(isLoading || ! (assets && vaults)) ? (
        <Progress />
      ) : (
        <AssetList assets={assets} vaults={vaults} />
      )}
    </div>
  );
}

export default Assets;
