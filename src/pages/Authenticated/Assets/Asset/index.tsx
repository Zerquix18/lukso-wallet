import { useState } from "react";
import { Button, Card, Content, Heading, Media } from "react-bulma-components";
import { IAsset } from "../../../../models";
import MintModal from "./MintModal";

interface AssetProps {
  asset: IAsset;
}

function Asset({ asset }: AssetProps) {
  const [mintingModal, setMintingModal] = useState(false);
  const image = asset.metadata.icon ? 'https://ipfs.io/ipfs/' + asset.metadata.icon[0].url.replace('ipfs://', '') : null;

  const toggleMintingModal = () => {
    setMintingModal(state => ! state);
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

          <Button.Group size="small">
            <Button color="primary" onClick={toggleMintingModal}>Mint</Button>
            <Button color="secondary">Transfer</Button>
          </Button.Group>
        </Content>

        { mintingModal && <MintModal asset={asset} onClose={toggleMintingModal} /> }
      </Card.Content>
    </Card>
  );
}

export default Asset;
