import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";

import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';

import { IAsset } from "../../../../../models";
import { useAuthenticatedUser } from "../../../../../hooks";

interface TransferModalProps {
  asset: IAsset;
  onClose: () => void;
}

function TransferModal({ asset, onClose }: TransferModalProps) {
  const { address, web3 } = useAuthenticatedUser();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const [sending, setSending] = useState(false);

  const onSetAmountToBalance = () => {
    setAmount(asset.balance);
  };

  const onSubmit = async () => {
    try {
      setSending(true);
      const weiAmount = web3.utils.toWei(String(amount));
      const LSP7DigitalAssetAbi = LSP7DigitalAsset.abi as any;
      const myToken = new web3.eth.Contract(LSP7DigitalAssetAbi, asset.id);
      await myToken.methods.transfer(address, recipient, weiAmount, false, '0x').send({ from: address });
    } catch (e) {
      console.log(e);
    } finally {
      setSending(false);
    }
  };

  const canSubmit = recipient.length > 0 && amount > 0;

  return (
    <Modal show closeOnBlur closeOnEsc onClose={onClose}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>
            Transfer
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
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
                max={asset.balance}
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value));
                }}
              />
            </Form.Control>
            <Form.Help style={{ textAlign: 'right' }}>
              <Button type="button" size="small" color="grey-light" onClick={onSetAmountToBalance}>
                MAX { asset.balance }
              </Button>
            </Form.Help>
          </Form.Field>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <Button
                type="button"
                color="primary"
                disabled={! canSubmit || sending}
                onClick={onSubmit}
              >
                Send { asset.symbol }
              </Button>
            </div>
          </form>
        </Modal.Card.Body>
      </Modal.Card>
    </Modal>
  );
}

export default TransferModal;
