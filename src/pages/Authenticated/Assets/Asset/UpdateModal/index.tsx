import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";

import { LSPFactory } from "@lukso/lsp-factory.js";
import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

import { IAsset } from "../../../../../models";
import { CHAIN_ID, IPFS_GATEWAY_API_BASE_URL } from "../../../../../constants";
import { useAuthenticatedUser } from "../../../../../hooks";

interface UpdateModalProps {
  asset: IAsset;
  onClose: () => void;
}

function UpdateModal({ asset, onClose }: UpdateModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const [description, setDescription] = useState(asset.metadata.description);
  const [newIcon, setNewIcon] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);

      const LSP4MetaData = {
        description,
        icon: newIcon ? newIcon : asset.metadata.icon,
        links: asset.metadata.links,
        images: asset.metadata.images,
        assets: asset.metadata.assets,
      };

      // @ts-ignore
      const lspFactory = new LSPFactory(web3.currentProvider!, { chainId: CHAIN_ID });
      const result = await lspFactory.LSP4DigitalAssetMetadata.uploadMetadata(LSP4MetaData);

      const options = {
        ipfsGateway: IPFS_GATEWAY_API_BASE_URL,
      };

      const erc725LSP4DigitalAsset = new ERC725(
        LSP4DigitalAsset as ERC725JSONSchema[],
        asset.id,
        web3.currentProvider,
        options
      );

      const encodedData = erc725LSP4DigitalAsset.encodeData([
        {
          keyName: 'LSP4Metadata',
          value: result,
        },
      ]);

      const LSP7DigitalAssetAbi = LSP7DigitalAsset.abi as any;
      const digitalAssetContract = new web3.eth.Contract(LSP7DigitalAssetAbi, asset.id);

      await digitalAssetContract.methods['setData(bytes32[],bytes[])'](
        encodedData.keys,
        encodedData.values
      ).send({ from: address });

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
            Update asset
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <p>Name and symbol cannot be updated.</p>

            <Form.Field>
              <Form.Label>Description</Form.Label>
              <Form.Control>
                <Form.Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>
                New Icon
              </Form.Label>
              <Form.Control>
                <Form.InputFile
                  align="center"
                  filename={newIcon ? newIcon.name : ''}
                  // @ts-ignore 
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setNewIcon(file);
                  }}
                />
              </Form.Control>
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
  );
}

export default UpdateModal;
