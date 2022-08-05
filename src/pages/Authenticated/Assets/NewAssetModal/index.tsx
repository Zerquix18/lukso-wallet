import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";
import Web3 from "web3";
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import { useAuthenticatedUser } from "../../../../hooks";

declare var window: any;

interface NewAssetModalProps {
  onClose: () => void;
}

const web3 = new Web3(window.ethereum);

function NewAssetModal({ onClose }: NewAssetModalProps) {
  const { address } = useAuthenticatedUser();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isNft, setIsNft] = useState(false);

  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);

      const LSP7MintableAbi = LSP7Mintable.abi as any;
      const myToken = new web3.eth.Contract(LSP7MintableAbi);
      await myToken.deploy({
        data: LSP7Mintable.bytecode,
        arguments: [name, symbol, address, isNft]
      }).send({ from: address });
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
            Add new asset
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <Form.Field>
              <Form.Label>Token Name</Form.Label>
              <Form.Control>
                <Form.Input
                  placeholder="My LSP7 Token"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Token Symbol</Form.Label>
              <Form.Control>
                <Form.Input
                  placeholder="LSP7"
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Control>
                <Form.Checkbox
                  checked={isNft}
                  onChange={(e) => {
                    setIsNft(state => ! state);
                  }}
                >
                  Is this an NFT?
                </Form.Checkbox>
              </Form.Control>
              <Form.Help>Determines whether this will not be divisible.</Form.Help>
            </Form.Field>
          </form>
        </Modal.Card.Body>
        <Modal.Card.Footer alignItems="flex-end" onClick={onSave}>
          <Button color="danger" onClick={onClose}>
            Close
          </Button>
          <Button color="success" loading={saving} disabled={saving}>
            Save
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  )
}

export default NewAssetModal;
