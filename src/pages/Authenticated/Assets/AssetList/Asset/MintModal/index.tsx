import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";
import { useQueryClient } from "@tanstack/react-query";

import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

import { IAsset } from "../../../../../../models";
import { useAuthenticatedUser } from "../../../../../../hooks";
import { sendToast } from "../../../../../../utils";

interface MintModalProps {
  asset: IAsset;
  onClose: () => void;
}

function MintModal({ asset, onClose }: MintModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);

      sendToast({ message: 'Please approve the upcoming transaction using your wallet...', type: 'is-warning' });

      const weiAmount = web3.utils.toWei(String(amount));
      const LSP7MintableAbi = LSP7Mintable.abi as any;
      const myToken = new web3.eth.Contract(LSP7MintableAbi, asset.id);
      await myToken.methods.mint(address, weiAmount, false, '0x').send({ from: address });
      sendToast({ message: `Successfully minted ${amount} ${asset.symbol}`, type: 'is-success' });
      queryClient.invalidateQueries(['assets']);
      onClose();
    } catch (e) {
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
        <Modal.Card.Footer>
          <Button size="small" color="danger" onClick={onClose}>
            Close
          </Button>
          <Button size="small" color="success" loading={saving} disabled={saving} onClick={onSubmit}>
            Mint
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default MintModal;
