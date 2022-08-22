import { useEffect, useRef, useState } from "react";
import { Button, Heading } from "react-bulma-components";

import LSP10ReceivedVaults from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";

import NewVaultModal from "./NewVaultModal";

function Vaults() {
  const { address } = useAuthenticatedUser();

  const erc725Ref = useRef(new ERC725(LSP10ReceivedVaults as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchVaults = async () => {
    const data = await erc725.fetchData(['LSP10Vaults[]']);
    console.log(data);
    return [];
  };

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  return <></>;
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