import { Fragment, useState } from "react";
import { Dropdown, Icon } from "react-bulma-components";

import Web3 from "web3";
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

import { useAuthenticatedUser } from "../../../../../hooks";

import TransferModal from "./TransferModal";

interface OwnershipDropdownProps {
  assetId: string;
}

declare var window: any;

function OwnershipDropdown({ assetId }: OwnershipDropdownProps) {
  const { address } = useAuthenticatedUser();
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

        const web3 = new Web3(window.ethereum);
        const LSP7MintableAbi = LSP7Mintable.abi as any;
        const myToken = new web3.eth.Contract(LSP7MintableAbi, assetId);
        await myToken.methods.renounceOwnership().send({ from: address });
        window.location.reload();
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
