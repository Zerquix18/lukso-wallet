import { Button, Card, Content, Heading, Media } from "react-bulma-components";
import { IController } from "../../../../models";

interface ControllerProps {
  controller: IController;
}

function Controller({ controller }: ControllerProps) {
  const { address, isEOA, permissions } = controller;

  const imageUrl = `https://effigy.im/a/${address}.png`;
  const permissionsCount = Object.values(permissions).filter(Boolean).length;

  return (
   <Card>
      <Card.Image src={imageUrl} />
      <Card.Content>
        <Media>
          <Media.Item>
            <Heading size={4}>{ address.slice(0, 6) + '...' + address.slice(-6) }</Heading>
            <Heading subtitle size={6}>
              { isEOA ? 'Externally Owned Account' : 'Smart Contract' }
            </Heading>
          </Media.Item>
        </Media>
        <Content>
          <Button color="primary">
            { permissionsCount }&nbsp;
            { permissionsCount === 1 ? 'permission': 'permissions' }
          </Button>
        </Content>
      </Card.Content>
    </Card>
  )
}

export default Controller;
