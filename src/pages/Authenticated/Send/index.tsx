import { useCallback, useEffect, useState } from "react";
import { Box, Button, Form, Heading, Notification } from "react-bulma-components";
import Web3 from "web3";
import { useAuthenticatedUser } from "../../../hooks";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

declare var window: any;
const web3 = new Web3(window.ethereum);

type Response = { success: boolean; response: string };

function Send() {
  const { address } = useAuthenticatedUser();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const fetchCurrentBalance = useCallback(async () => {
    try {
      const result = await web3.eth.getBalance(address);
      const lyx = parseFloat(web3.utils.fromWei(result));
      setCurrentBalance(lyx);
    } catch (e) {
      console.log(e);
    }
  }, [address]);

  useEffect(() => {
    fetchCurrentBalance();
  }, [fetchCurrentBalance]);

  const onSetAmountToBalance = () => {
    if (currentBalance !== null) {
      setAmount(currentBalance);
    }
  };

  const onSubmit = async () => {
    try {
      setSending(true);
      setResponse(null);

      const UniversalProfileContractAbi = UniversalProfile.abi as any;
      const universalProfileContract = new web3.eth.Contract(UniversalProfileContractAbi, address);
      
      const weiAmount = web3.utils.toWei(String(amount));

      // https://docs.lukso.tech/guides/universal-profile/transfer-lyx#step-3---encode-the-payload-to-transfer-lyx
      await universalProfileContract.methods.execute(0, recipient, weiAmount, '0x').send({ from: address });
      setAmount(0);
      setResponse({ success: true, response: `Successfully sent ${amount} LYX!` });
    } catch (e) {
      console.log(e);
      setResponse({ success: false, response: (e as Error).message });
    } finally {
      setSending(false);
    }
  };

  const canSubmit = true; // amount > 0;

  return (
    <div>
      <Heading>
        Send LYX
        <Heading subtitle>Send LYX to any address or Universal Profile</Heading>
      </Heading>

      <Box>
        { response ? (
          <Notification color={response.success ? 'success' : 'danger'}>
            { response.response }
          </Notification>
        ) : null}

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
            <Button type="button" color="primary" disabled={! canSubmit || sending} onClick={onSubmit}>Send LYX</Button>
          </div>
        </form>
      </Box>
    </div>
  )
}

export default Send;
