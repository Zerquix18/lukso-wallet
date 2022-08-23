import { useState } from "react";
import { Button, Form, Notification } from "react-bulma-components";

import Web3 from "web3";

import { sendToast } from "../../../../utils";

declare var window: any;

function RecoverForm() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');

  const [result, setResult] = useState('');

  const canSubmit = message.length > 0 && signature.length > 0;

  const onSubmit = () => {
    try {
      const web3 = new Web3(window.ethereum);
      const result = web3.eth.accounts.recover(message, signature);
      setResult(result);
    } catch (e) {
      sendToast({ message: (e as Error).message, type: 'is-danger' });
    }
  };

  return (
    <form>
      { result && (
        <Notification color="success">
          Message was signed from: { result }
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
      <Form.Field>
        <Form.Label>Signature</Form.Label>
        <Form.Control>
          <Form.Input
            value={signature}
            onChange={(e) => {
              setSignature(e.target.value);
            }}
          />
        </Form.Control>
      </Form.Field>

      <div style={{ textAlign: 'center' }}>
        <Button type="button" color="primary" onClick={onSubmit} disabled={! canSubmit}>Recover</Button>
      </div>
    </form>
  );
}

export default RecoverForm;
