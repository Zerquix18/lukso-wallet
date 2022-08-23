import { useState } from "react";
import { Box, Button, Form, Heading, Notification } from "react-bulma-components";
import { useQuery } from "@tanstack/react-query";

import { useAuthenticatedUser } from "../../../hooks";
import { sendToast } from "../../../utils";

function Send() {
  const { address, web3 } = useAuthenticatedUser();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const [sending, setSending] = useState(false);

  const fetchCurrentBalance = async () => {
    const result = await web3.eth.getBalance(address);
    const lyx = parseFloat(web3.utils.fromWei(result));
    return lyx;
  };

  const { data: currentBalance } = useQuery(['currentBalance'], fetchCurrentBalance);

  const onSetAmountToBalance = () => {
    if (currentBalance !== undefined) {
      setAmount(currentBalance);
    }
  };

  const onSubmit = async () => {
    try {
      setSending(true);
      sendToast({ message: 'Please approve the transaction using your wallet...', type: 'is-warning' });

      const weiAmount = web3.utils.toWei(String(amount));

      // https://docs.lukso.tech/guides/universal-profile/transfer-lyx#step-3---encode-the-payload-to-transfer-lyx
      await web3.eth.sendTransaction({
        from: address,
        to: recipient,
        value: weiAmount,
      });

      setAmount(0);
      sendToast({ message: `Successfully sent ${amount} LYX!`, type: 'is-success', duration: 5000 });
    } catch (e) {
      sendToast({ message: (e as Error).message, type: 'is-danger' });
    } finally {
      setSending(false);
    }
  };

  const canSubmit = amount > 0;

  return (
    <div>
      <Heading>
        Send LYX
      </Heading>
      <Heading subtitle>Send LYX to any address or Universal Profile</Heading>

      <Box>
        { currentBalance === 0 && (
          <Notification color="warning">
            Your Universal Profile does not have any funds. Please fund your UP using the&nbsp;
            <a href="https://faucet.l16.lukso.network/" target="_blank" rel="noreferrer">Faucet</a>.
          </Notification>
        )}

        <form>
          <Form.Field>
            <Form.Label>Address</Form.Label>
            <Form.Control>
              <Form.Input
                placeholder="0x..."
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                }}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
          <Form.Label>Amount</Form.Label>
          <Form.Control>
            <Form.Input
              placeholder="10"
              type="number"
              min={0}
              value={amount}
              max={currentBalance ? currentBalance : undefined}
              onChange={(e) => {
                setAmount(parseFloat(e.target.value));
              }}
            />
          </Form.Control>
          { currentBalance !== null && (
            <Form.Help style={{ textAlign: 'right' }}>
              <Button type="button" size="small" color="grey-light" onClick={onSetAmountToBalance}>
                MAX { currentBalance }
              </Button>
            </Form.Help>
          )}
        </Form.Field>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Button
              type="button"
              color="primary"
              disabled={! canSubmit || sending || ! currentBalance}
              loading={sending}
              onClick={onSubmit}
              >
                Send LYX
              </Button>
          </div>
        </form>
      </Box>
    </div>
  )
}

export default Send;
