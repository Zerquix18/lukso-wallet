import { useState } from "react";
import { Button, Modal } from "react-bulma-components";

import Web3 from "web3";
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';
import LSP10ReceivedVaults from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';
import LSP0ERC725Account from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

import { useAuthenticatedUser } from "../../../../hooks";
import { IPFS_GATEWAY_API_BASE_URL } from "../../../../constants";

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
      const newContract = await vaultContract.deploy({
        data: LSP9Vault.bytecode,
        arguments: [address],
      }).send({ from: address });

      const newContractAddress = newContract.options.address;

      ///////// ---

      const options = {
        ipfsGateway: IPFS_GATEWAY_API_BASE_URL,
      };
      const erc725LSP12IssuedAssets = new ERC725(
        LSP10ReceivedVaults as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        options
      );

      const LSP9Vaults = await erc725LSP12IssuedAssets.getData('LSP10Vaults[]');
      (LSP9Vaults.value as string[]).push(newContractAddress);
      
      const LSP9VaultsLength = (LSP9Vaults.value as string[]).length;
      const LSP9InterfaceId = '0x8c1d44f6'; // https://docs.lukso.tech/standards/smart-contracts/interface-ids/

      const encodedErc725Data = erc725LSP12IssuedAssets.encodeData([
        {
          keyName: 'LSP10Vaults[]',
          value: LSP9Vaults.value,
        },
        {
          keyName: 'LSP10VaultsMap:<address>',
          dynamicKeyParts: newContractAddress,
          value: [LSP9InterfaceId, String(LSP9VaultsLength - 1)],
        },
      ]);

      console.log(encodedErc725Data);

      const LSP0ERC725AccountAbi = LSP0ERC725Account.abi as any;
      const profileContract = new web3.eth.Contract(LSP0ERC725AccountAbi, address);
      const receipt = await profileContract.methods['setData(bytes32[],bytes[])'](
        encodedErc725Data.keys,
        encodedErc725Data.values
      ).send({ from: address });

      console.log(receipt);

      // window.location.reload();
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
