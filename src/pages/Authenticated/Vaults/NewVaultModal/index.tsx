import { useState } from "react";
import { Button, Modal } from "react-bulma-components";

import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';
import Web3 from "web3";

import { useAuthenticatedUser } from "../../../../hooks";

interface NewVaultModalProps {
  onClose: () => void;
}

declare var window: any;

function NewVaultModal({ onClose }: NewVaultModalProps) {
  const { address } = useAuthenticatedUser();
  const [creating, setCreating] = useState(false);

  const onCreate = async () => {
    try {
      setCreating(true);

      const web3 = new Web3(window.ethereum);
      const LSP9VaultAbi = LSP9Vault.abi as any;
      const vaultContract = new web3.eth.Contract(LSP9VaultAbi);
      await vaultContract.deploy({
        data: LSP9Vault.bytecode,
        arguments: [address],
      }).send({ from: address });
      window.location.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal show closeOnBlur closeOnEsc onClose={onClose}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>
            Add new vault
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          A new vault will be created.
        </Modal.Card.Body>
        <Modal.Card.Footer>
          <Button color="danger" onClick={onClose}>Close</Button>
          <Button color="primary" onClick={onCreate} disabled={creating}>Create vault</Button>
        </Modal.Card.Footer>
      </Modal.Card>  
    </Modal>
  )
}

export default NewVaultModal;
