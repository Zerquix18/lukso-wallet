import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";
import { useQueryClient } from "@tanstack/react-query";

import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import { useAuthenticatedUser } from "../../../../../../hooks";
import { sendToast } from "../../../../../../utils";

interface TransferModalProps {
  assetId: string;
  onClose: () => void;
}

function TransferModal({ assetId, onClose }: TransferModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const [newOwner, setNewOwner] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);

      sendToast({ message: 'Please approve the upcoming transactions using your wallet...', type: 'is-warning' });
      const LSP7DigitalAssetAbi = LSP7DigitalAsset.abi as any;
      const myToken = new web3.eth.Contract(LSP7DigitalAssetAbi, assetId);

      await myToken.methods.transferOwnership(newOwner).send({ from: address });
      sendToast({ message: `Successfully updated asset.`, type: 'is-success' });
      queryClient.invalidateQueries(['assets']);
      onClose();
    } catch (e) {
      console.log(e);
      sendToast({ message: (e as Error).message, type: 'is-danger' });
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
