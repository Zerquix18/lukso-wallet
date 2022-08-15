import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";
import Web3 from "web3";

import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import { useAuthenticatedUser } from "../../../../../../hooks";

declare var window: any;

interface TransferModalProps {
  assetId: string;
  onClose: () => void;
}

const web3 = new Web3(window.ethereum);

function TransferModal({ assetId, onClose }: TransferModalProps) {
  const { address } = useAuthenticatedUser();
  const [newOwner, setNewOwner] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);

      const LSP7MintableAbi = LSP7Mintable.abi as any;
      const myToken = new web3.eth.Contract(LSP7MintableAbi, assetId);
      await myToken.methods.transferOwnership(newOwner).send({ from: address });
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
            Transfer Ownership
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <Form.Field>
              <Form.Label>New owner</Form.Label>
              <Form.Control>
                <Form.Input
                  placeholder="0x..."
                  value={newOwner}
                  onChange={(e) => {
                    setNewOwner(e.target.value);
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
            Transfer
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default TransferModal;
