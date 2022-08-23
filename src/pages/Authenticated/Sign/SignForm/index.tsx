import { useState } from "react";
import { Button, Form, Notification, Tag } from "react-bulma-components";

import { useAuthenticatedUser } from "../../../../hooks";
import { sendToast } from "../../../../utils";

type ReturnedSignature = {
  signature: string;
  address: string;
}

function SignForm() {
  const { address, web3 } = useAuthenticatedUser();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnedSignature | null>(null);

  const onSubmit = async () => {
    setLoading(true);

    sendToast({ message: 'Please sign the message using your wallet...', type: 'is-warning' });

    try {
      const result = await web3.eth.sign(message, address);
      setResult(result as unknown as ReturnedSignature);
    } catch (e) {
      sendToast({ message: (e as Error).message, type: 'is-danger' });
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
        <Button
          color="primary"
          disabled={message.length === 0 || loading}
          loading={loading}
          onClick={onSubmit}>
            Sign
          </Button>
      </div>
    </form>
  );
}

export default SignForm;
