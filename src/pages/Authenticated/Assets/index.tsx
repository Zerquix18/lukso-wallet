import { useRef, useState } from "react";
import { Button, Heading, Progress, Notification, Columns } from "react-bulma-components";
import { useQuery } from "@tanstack/react-query";

import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import LSP4schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import { LSP4DigitalAsset } from "@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset";

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IAsset } from "../../../models";

import NewAssetModal from "./NewAssetModal";
import Asset from "./Asset";

function Assets() {
  const { address, web3 } = useAuthenticatedUser();

  const erc725Ref = useRef(new ERC725(LSP3UniversalProfileMetadata as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchAssets = async () => {
    const data = await erc725.fetchData(['LSP12IssuedAssets[]', 'LSP5ReceivedAssets[]']);
    const contractIds = Array.from(new Set(data.map(item => item.value as string).flat()));

    const promises = contractIds.map(async contractId => {
      const contractErc725 = new ERC725(LSP4schema as ERC725JSONSchema[], contractId, DEFAULT_PROVIDER, DEFAULT_CONFIG);

      const LSP7MintableAbi = LSP7Mintable.abi as any;
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

  const { isLoading, data: assets } = useQuery(['assets'], fetchAssets);

  if (isLoading || ! assets) {
    return <Progress />;
  }

  if (assets.length === 0) {
    return (
      <Notification color="warning">
        You own no assets. You can create one.
      </Notification>
    );
  }

  return (
    <Columns>
      { assets.map(asset => {
        return (
          <Columns.Column key={asset.id} size="one-third">
            <Asset asset={asset} />
          </Columns.Column>
        );
      })}
    </Columns>
  );
}

function AssetsWrapper() {
  const [adding, setAdding] = useState(false);

  const toggleAdding = () => {
    setAdding(state => ! state);
  };

  return (
    <div>
      <Heading>
        Assets
      </Heading>
      <Heading subtitle>Manage your tokens and NFTs.</Heading>

      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button color="primary" onClick={toggleAdding}>Add asset</Button>
      </div>

      { adding && (
        <NewAssetModal onClose={toggleAdding} />
      )}

      <Assets />
    </div>
  );
}

export default AssetsWrapper;
