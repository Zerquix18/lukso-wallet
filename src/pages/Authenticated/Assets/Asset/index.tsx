import { Card, Content, Heading, Media } from "react-bulma-components";
import { IAsset } from "../../../../models";

interface AssetProps {
  asset: IAsset;
}

function Asset({ asset }: AssetProps) {
  const image = asset.metadata.icon ? 'https://ipfs.io/ipfs/' + asset.metadata.icon[0].url.replace('ipfs://', '') : null;

  return (
   <Card>
      { image && <Card.Image src={image} /> }
      <Card.Content>
        <Media>
          <Media.Item>
            <Heading size={4}>{ asset.name }</Heading>
            <Heading subtitle size={6}>
              ({ asset.symbol })
            </Heading>
          </Media.Item>
        </Media>
        <Content>
          { asset.metadata.description }
        </Content>
      </Card.Content>
    </Card>
  );
}

export default Asset;
