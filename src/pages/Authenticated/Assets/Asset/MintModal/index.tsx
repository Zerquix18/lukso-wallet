import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";

import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

import { IAsset } from "../../../../../models";
import { useAuthenticatedUser } from "../../../../../hooks";

interface MintModalProps {
  asset: IAsset;
  onClose: () => void;
}

function MintModal({ asset, onClose }: MintModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const [amount, setAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);

      const weiAmount = web3.utils.toWei(String(amount));
      const LSP7MintableAbi = LSP7Mintable.abi as any;
      const myToken = new web3.eth.Contract(LSP7MintableAbi, asset.id);
      await myToken.methods.mint(address, weiAmount, false, '0x').send({ from: address });
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show closeOnBlur closeOnEsc onClose={onClose}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>
            Mint
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <Form.Field>
              <Form.Label>Amount</Form.Label>
              <Form.Control>
                <Form.Input
                  min={0}
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                />
              </Form.Control>
            </Form.Field>
          </form>
        </Modal.Card.Body>
        <Modal.Card.Footer onClick={onSubmit}>
          <Button size="small" color="danger" onClick={onClose}>
            Close
          </Button>
          <Button size="small" color="success" loading={saving} disabled={saving}>
            Mint
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default MintModal;
