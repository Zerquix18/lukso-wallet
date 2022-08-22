import { useRef, useState } from "react";
import { Button, Columns, Heading, Progress } from "react-bulma-components";

import Web3 from "web3";
import LSP10ReceivedVaults from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP9Vault from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";

import NewVaultModal from "./NewVaultModal";
import { useQuery } from "@tanstack/react-query";
import Vault from "./Vault";

declare var window: any;
const web3 = new Web3(window.ethereum);
const LSP9VaultAbi = LSP9Vault.abi as any;

function Vaults() {
  const { address } = useAuthenticatedUser();

  const erc725Ref = useRef(new ERC725(LSP10ReceivedVaults as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchVaults = async () => {
    const data = await erc725.fetchData('LSP10Vaults[]');
    const vaultIds = data.value as string[];

    const promises = vaultIds.map(async id => {
      const myVault = new web3.eth.Contract(LSP9VaultAbi, id);
      const owner = await myVault.methods.owner().call();
      return { id, owner };
    });

    const vaults = await Promise.all(promises);
    return vaults;
  };

  const { isLoading, data: vaults } = useQuery(['vaults'], fetchVaults);

  if (isLoading || ! vaults) {
    return <Progress />;
  }

  return (
    <div>
      <Columns>
        { vaults.map(vault => {
          return (
            <Columns.Column key={vault.id} size="one-third">
              <Vault vault={vault} />
            </Columns.Column>
          );
        })}
      </Columns>
    </div>
  );
}

function VaultsWrapper() {
  const [adding, setAdding] = useState(false);

  const toggleAdding = () => {
    setAdding(state => ! state);
  };

  return (
    <div>
      <Heading>
        Vaults
      </Heading>
      <Heading subtitle>Vaults can hold assets.</Heading>

      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button color="primary" onClick={toggleAdding}>Add Vault</Button>
      </div>

      <Vaults />

      { adding && (
        <NewVaultModal onClose={toggleAdding} />
      )}
    </div>
  );
}

export default VaultsWrapper;