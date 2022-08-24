import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";

import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import { useAuthenticatedUser } from "../../../../../../hooks";

interface TransferModalProps {
  assetId: string;
  onClose: () => void;
}

function TransferModal({ assetId, onClose }: TransferModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const [newOwner, setNewOwner] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);

      const LSP7DigitalAssetAbi = LSP7DigitalAsset.abi as any;
      const myToken = new web3.eth.Contract(LSP7DigitalAssetAbi, assetId);

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
        <Modal.Card.Footer>
          <Button size="small" color="danger" onClick={onClose}>
            Close
          </Button>
          <Button size="small" color="success" loading={saving} disabled={saving} onClick={onSubmit}>
            Transfer
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default TransferModal;
