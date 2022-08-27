import { useState } from "react";
import { Button, Columns, Tabs, Notification } from "react-bulma-components";

import { IAsset, IVault } from "../../../../models";

import Asset from "./Asset";
import NewAssetModal from "./NewAssetModal";
import NewVaultModal from "./NewVaultModal";

interface AssetListProps {
  assets: IAsset[];
  vaults: IVault[];
}

function AssetList({ assets, vaults }: AssetListProps) {
  const [addingAsset, setAddingAsset] = useState(false);
  const [addingVault, setAddingVault] = useState(false);
  const [currentVault, setCurrentVault] = useState<IVault | null>(null);

  const toggleAddingAsset = () => {
    setAddingAsset(state => ! state);
  };
  const toggleAddingVault = () => {
    setAddingVault(state => ! state);
  };

  const assetsToDisplay = currentVault ? currentVault.assets : assets;

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Button color="secondary" onClick={toggleAddingVault}>Add vault</Button>
      </div>

      <Tabs>
        <Tabs.Tab
          active={currentVault === null}
          onClick={() => {
            setCurrentVault(null);
          }}
        >
          No vault
        </Tabs.Tab>

        { vaults.map(vault => {
          const active = !! currentVault && currentVault.id === vault.id;
          const onClick = () => {
            setCurrentVault(vault);
          };

          return (
            <Tabs.Tab key={vault.id} active={active} onClick={onClick}>
              { vault.id.slice(0, 6) + '...' + vault.id.slice(-4) }
            </Tabs.Tab>
          );
        })}
      </Tabs>

      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button color="primary" onClick={toggleAddingAsset}>Add asset</Button>
      </div>

      { assetsToDisplay.length === 0 && (
        <Notification color="warning">
          No assets to display. Try creating one!
        </Notification>
      )}

      <Columns>
        { assetsToDisplay.map(asset => {
          return (
            <Columns.Column key={asset.id} size="one-third">
              <Asset asset={asset} />
            </Columns.Column>
          );
        })}
      </Columns>

      { addingAsset && (
        <NewAssetModal onClose={toggleAddingAsset} />
      )}
      { addingVault && (
        <NewVaultModal onClose={toggleAddingVault} />
      )}
    </div>
  );
}

export default AssetList;
