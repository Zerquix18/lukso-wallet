import { useState } from "react";
import { Button, Heading } from "react-bulma-components";
import NewVaultModal from "./NewVaultModal";

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

      { adding && (
        <NewVaultModal onClose={toggleAdding} />
      )}
    </div>
  );
}

export default VaultsWrapper;