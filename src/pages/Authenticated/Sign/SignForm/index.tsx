import { useState } from "react";
import { Button, Form, Notification, Tag } from "react-bulma-components";
import Web3 from "web3";

import { useAuthenticatedUser } from "../../../../hooks";

declare var window: any;

type ReturnedSignature = {
  signature: string;
  address: string;
}

function SignForm() {
  const { address } = useAuthenticatedUser();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnedSignature | null>(null);

  const onSubmit = async () => {
    setLoading(true);

    const web3 = new Web3(window.ethereum);

    try {
      const result = await web3.eth.sign(message, address);
      setResult(result as unknown as ReturnedSignature);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      { result && (
        <Notification>
          Signature: <Tag>{ result.signature }</Tag>
          <br />
          Signed from: <Tag>{ result.address }</Tag>
        </Notification>
      )}

      <Form.Field>
        <Form.Label>Message</Form.Label>
        <Form.Control>
          <Form.Textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </Form.Control>
      </Form.Field>

      <div style={{ textAlign: 'center' }}>
        <Button color="primary" onClick={onSubmit} disabled={message.length === 0 || loading}>Sign</Button>
      </div>
    </form>
  );
}

export default SignForm;
