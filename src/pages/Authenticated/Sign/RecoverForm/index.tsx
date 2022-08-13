import React, { useState } from "react";
import { Button, Form, Notification } from "react-bulma-components";
import Web3 from "web3";

declare var window: any;

function RecoverForm() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const canSubmit = message.length > 0 && signature.length > 0;

  const onSubmit = () => {
    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      const result = web3.eth.accounts.recover(message, signature);
      setResult(result);
    } catch (e) {
      alert((e as Error).message);
      console.log(e);
    } finally {
      setLoading(false);
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
        <Button type="button" color="primary" onClick={onSubmit} disabled={! canSubmit || loading}>Sign</Button>
      </div>
    </form>
  );
}

export default RecoverForm;
