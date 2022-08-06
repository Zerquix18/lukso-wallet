import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Heading, Progress, Notification, Columns } from "react-bulma-components";

import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import LSP4schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { LSP4DigitalAsset } from "@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset";

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IAsset } from "../../../models";

import NewAssetModal from "./NewAssetModal";
import Asset from "./Asset";

function Assets() {
  const { address } = useAuthenticatedUser();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<IAsset[]>([]);

  const erc725Ref = useRef(new ERC725(LSP3UniversalProfileMetadata as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchAssets = useCallback(async () => {
    try {
      const data = await erc725.fetchData('LSP12IssuedAssets[]');
      const contractIds = data.value as string[];

      const promises = contractIds.map(async contractId => {
        const erc725 = new ERC725(LSP4schema as ERC725JSONSchema[], contractId, DEFAULT_PROVIDER, DEFAULT_CONFIG);

        const [
          LSP4TokenName,
          LSP4TokenSymbol,
          LSP4Metadata,
          LSP4Creators,
        ] = await Promise.all(
          [
            erc725.fetchData('LSP4TokenName'),
            erc725.fetchData('LSP4TokenSymbol'),
            erc725.fetchData('LSP4Metadata'),
            erc725.fetchData('LSP4Creators[]'),
          ]
        );

        const id = contractId;
        const name = LSP4TokenName.value as string;
        const symbol = LSP4TokenSymbol.value as string;
        const metadata = (LSP4Metadata.value as any).LSP4Metadata as LSP4DigitalAsset;
        const creators = LSP4Creators.value as string[];

        const asset: IAsset = { id, name, symbol, metadata, creators };

        return asset;
      });

      const assets = await Promise.all(promises);
      setAssets(assets);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [erc725]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (loading) {
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
        <Heading subtitle>Manage your tokens and NFTs.</Heading>
      </Heading>

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
