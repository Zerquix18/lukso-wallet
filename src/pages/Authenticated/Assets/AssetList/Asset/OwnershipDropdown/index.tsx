import { Fragment, useState } from "react";
import { Dropdown, Icon } from "react-bulma-components";
import { useQueryClient } from "@tanstack/react-query";

import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

import { useAuthenticatedUser } from "../../../../../../hooks";

import TransferModal from "./TransferModal";
import { sendToast } from "../../../../../../utils";

interface OwnershipDropdownProps {
  assetId: string;
}

function OwnershipDropdown({ assetId }: OwnershipDropdownProps) {
  const { address, web3 } = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const toggleTransferModal = () => {
    setTransferModalOpen(state => ! state);
  };

  const onDropdownSelect = async (value: string) => {
    switch (value) {
      case 'transfer':
        toggleTransferModal();
        break;
      case 'renounce':
        if (! window.confirm('Are you sure you want to renounce ownership of this asset? THIS CANNOT BE UNDONE')) {
          return;
        }

        try {
          sendToast({ message: 'Please approve the upcoming transaction using your wallet...', type: 'is-warning' });
          const LSP7MintableAbi = LSP7Mintable.abi as any;
          const myToken = new web3.eth.Contract(LSP7MintableAbi, assetId);
          await myToken.methods.renounceOwnership().send({ from: address });
          sendToast({ message: `Successfully renounced ownership.`, type: 'is-success' });
          queryClient.invalidateQueries(['assets']);
        } catch (e) {
          sendToast({ message: (e as Error).message, type: 'is-danger' });
        }

        break;
    }
  };

  return (
    <Fragment>
      <Dropdown
        up
        color="warning"
        label="Ownership..."
        onChange={onDropdownSelect}
        icon={<Icon><i aria-hidden="true" className="fas fa-angle-down"/></Icon>}
      >
        <Dropdown.Item renderAs="a" value="transfer">
          Transfer ownership
        </Dropdown.Item>
        <Dropdown.Item renderAs="a" value="renounce">
          Renounce ownership
        </Dropdown.Item>
      </Dropdown>
      { transferModalOpen && <TransferModal assetId={assetId} onClose={toggleTransferModal} /> }
    </Fragment>
  );
}

export default OwnershipDropdown;
