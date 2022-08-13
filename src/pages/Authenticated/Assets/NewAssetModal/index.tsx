import { useState } from "react";
import { Button, Form, Modal } from "react-bulma-components";

import { LSPFactory } from '@lukso/lsp-factory.js';

import Web3 from "web3";
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP12IssuedAssetsSchema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';
import LSP0ERC725Account from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

import { useAuthenticatedUser } from "../../../../hooks";
import { CHAIN_ID, IPFS_GATEWAY_API_BASE_URL } from "../../../../constants";

declare var window: any;

interface NewAssetModalProps {
  onClose: () => void;
}

function NewAssetModal({ onClose }: NewAssetModalProps) {
  const { address } = useAuthenticatedUser();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isNft, setIsNft] = useState(false);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);

      const LSP4MetaData = {
        description,
        icon: icon!,
        links: [],
        images: [],
        assets: [],
      };

      // does not work without this
      const web3 = new Web3(window.ethereum);
      // @ts-ignore
      const lspFactory = new LSPFactory(web3.currentProvider, { chainId: CHAIN_ID });

      console.log('starting up..');

      const result = await lspFactory.LSP7DigitalAsset.deploy(
        {
          name,
          symbol,
          controllerAddress: address,
          creators: [address],
          isNFT: isNft,
          digitalAssetMetadata: LSP4MetaData,
        },
        {
          ipfsGateway: IPFS_GATEWAY_API_BASE_URL,
          onDeployEvents: {
            next: (deploymentEvent) => {
              console.log(deploymentEvent);
            },
            error: (error) => {
              console.log(error);
            },
            complete: async () => {
              console.log('Deployment Complete');
            },
          },
        },
      );

      console.log(result);

      const deployedLSP7DigitalAssetContract = result.LSP7DigitalAsset;
      const options = {
        ipfsGateway: IPFS_GATEWAY_API_BASE_URL,
      };

      const erc725LSP12IssuedAssets = new ERC725(
        LSP12IssuedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        options
      );

      const LSP12IssuedAssets = await erc725LSP12IssuedAssets.getData('LSP12IssuedAssets[]');
      console.log(LSP12IssuedAssets);
      (LSP12IssuedAssets.value as string[]).push(deployedLSP7DigitalAssetContract.address);
      
      const LSP12IssuedAssetsLength = LSP12IssuedAssets.value as string[];
      const LSP7InterfaceId = '0xe33f65c3';
      const encodedErc725Data = erc725LSP12IssuedAssets.encodeData([
        {
          keyName: 'LSP12IssuedAssets[]',
          value: LSP12IssuedAssets.value,
        },
        {
          keyName: 'LSP12IssuedAssetsMap:<address>',
          dynamicKeyParts: deployedLSP7DigitalAssetContract.address,
          value: [LSP7InterfaceId, String(LSP12IssuedAssetsLength.length - 1)],
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
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = (
    name.length > 0 &&
    symbol.length > 0 &&
    icon
  );

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
              <Form.Label>Token Name *</Form.Label>
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
              <Form.Label>Token Symbol *</Form.Label>
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
                Icon
              </Form.Label>
              <Form.Control>
                <Form.InputFile
                  align="center"
                  filename={icon ? icon.name : ''}
                  // @ts-ignore 
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setIcon(file);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Control>
                <Form.Checkbox
                  checked={isNft}
                  onChange={() => {
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
          <Button color="success" loading={saving} disabled={! canSubmit || saving}>
            Save
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default NewAssetModal;
