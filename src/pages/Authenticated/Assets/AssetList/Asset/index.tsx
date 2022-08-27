import { useState } from "react";
import { Button, Card, Content, Heading, Media, Tag } from "react-bulma-components";

import { useAuthenticatedUser } from "../../../../../hooks";
import { IAsset } from "../../../../../models";

import MintModal from "./MintModal";
import OwnershipDropdown from "./OwnershipDropdown";
import TransferModal from "./TransferModal";
import UpdateModal from "./UpdateModal";

interface AssetProps {
  asset: IAsset;
}

function Asset({ asset }: AssetProps) {
  const { address } = useAuthenticatedUser();
  const [updatingModal, setUpdatingModal] = useState(false);
  const [mintingModal, setMintingModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);

  const image = asset.metadata.icon ? 'https://ipfs.io/ipfs/' + asset.metadata.icon[0].url.replace('ipfs://', '') : null;

  const toggleMintingModal = () => {
    setMintingModal(state => ! state);
  };
  const toggleUpdatingModal = () => {
    setUpdatingModal(state => ! state);
  };
  const toggleTransferModal = () => {
    setTransferModal(state => ! state);
  };

  return (
   <Card>
      { image && <Card.Image src={image} /> }
      <Card.Content>
        <Media>
          <Media.Item>
            <Heading size={4}>{ asset.name }</Heading>
            <Heading subtitle size={6}>
              { asset.balance } { asset.symbol }
            </Heading>
          </Media.Item>
        </Media>
        <Content>
          { asset.metadata.description }

          <hr />

          <Tag.Group hasAddons>
            <Tag color="light">
              Owner
            </Tag>
            <Tag>
              { asset.owner.slice(0, 4) + '...' + asset.owner.slice(-4) }
              { asset.owner === address ? ' (you)' : null}
            </Tag>
            <Tag color="primary">
              Decimals
            </Tag>
            <Tag>
              { asset.decimals }
            </Tag>
            <Tag color="info">
              Total Supply
            </Tag>
            <Tag>
              { asset.totalSupply }
            </Tag>
          </Tag.Group>

          <hr />

          <Button.Group size="small">
            { asset.owner === address && (
              <>
                <Button color="primary" onClick={toggleMintingModal}>Mint</Button>
                <Button color="info" onClick={toggleUpdatingModal}>Update</Button>
                <OwnershipDropdown assetId={asset.id} />
              </>
            )}
            <Button color="link" disabled={asset.balance === 0} onClick={toggleTransferModal}>Transfer</Button>
          </Button.Group>
        </Content>

        { mintingModal && <MintModal asset={asset} onClose={toggleMintingModal} /> }
        { updatingModal && <UpdateModal asset={asset} onClose={toggleUpdatingModal} /> }
        { transferModal && <TransferModal asset={asset} onClose={toggleTransferModal} /> }
      </Card.Content>
    </Card>
  );
}

export default Asset;
