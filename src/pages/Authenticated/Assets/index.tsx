import { useState } from "react";
import { Button, Heading } from "react-bulma-components";
import NewAssetModal from "./NewAssetModal";

function Assets() {
  return (
    <div>a</div>
  );
}

function AssetsWrapper() {
  const [adding, setAdding] = useState(false);

  const toggleAdding = () => {
    setAdding(state => ! state);
  };

  return (
    <div>
      <Heading>
        Assets
        <Heading subtitle>Manage your tokens and NFTs.</Heading>
      </Heading>

      <div style={{ textAlign: 'right' }}>
        <Button color="primary" onClick={toggleAdding}>Add asset</Button>
      </div>

      { adding && (
        <NewAssetModal onClose={toggleAdding} />
      )}

      <Assets />
    </div>
  );
}

export default AssetsWrapper;
