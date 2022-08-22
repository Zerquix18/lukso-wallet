import { Card, Content, Heading, Media, Tag } from "react-bulma-components";

import { useAuthenticatedUser } from "../../../../hooks";
import { IVault } from "../../../../models";

interface VaultProps {
  vault: IVault;
}

function Vault({ vault }: VaultProps) {
  const { address } = useAuthenticatedUser();
  const imageUrl = `https://effigy.im/a/${vault.id}.png`;

  return (
    <Card>
      <Card.Image src={imageUrl} />
      <Card.Content>
        <Media>
          <Media.Item>
            <Heading size={4}>{ vault.id.slice(0, 6) + '...' + vault.id.slice(-6) }</Heading>
          </Media.Item>
        </Media>
        <Content>
          <Tag.Group hasAddons>
            <Tag color="dark">
              Owner
            </Tag>
            <Tag>
              { vault.owner.slice(0, 4) + '...' + vault.owner.slice(-4) }
              { vault.owner === address ? ' (you)' : null}
            </Tag>
          </Tag.Group>
        </Content>
      </Card.Content>
    </Card>
  );
}

export default Vault;
