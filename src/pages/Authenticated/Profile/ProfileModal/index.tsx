import { useRef, useState } from "react";
import { Modal, Form, Button } from "react-bulma-components";
import { useQueryClient } from "@tanstack/react-query";

import { LSPFactory, LSP3Profile } from "@lukso/lsp-factory.js";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";

import { CHAIN_ID, DEFAULT_CONFIG, DEFAULT_PROVIDER, NETWORK_URL } from "../../../../constants";
import { useAuthenticatedUser } from "../../../../hooks";
import { sendToast } from "../../../../utils";

import ProfileModalLinks from "./ProfileModalLinks";
import ProfileModalTags from "./ProfileModalTags";

interface ProfileModalProps {
  profile: LSP3Profile;
  onClose: () => void;
}

function ProfileModal({ profile, onClose }: ProfileModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description);
  const [tags, setTags] = useState(profile.tags || []);
  const [links, setLinks] = useState(profile.links || []);

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [newBackgroundImage, setNewBackgroundImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const erc725Ref = useRef(
    new ERC725(LSP3UniversalProfileMetadata as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG)
  );
  const erc725 = erc725Ref.current;

  const onSubmit = async () => {
    try {
      setSaving(true);

      sendToast({ message: 'Uploading assets to IPFS...', type: 'is-warning' });

      const lspFactory = new LSPFactory(NETWORK_URL, { chainId: CHAIN_ID });
      const uploadResult = await lspFactory.UniversalProfile.uploadProfileData({
        name,
        description,
        tags,
        links,
        profileImage: newProfileImage || profile.profileImage,
        backgroundImage: newBackgroundImage || profile.backgroundImage,
      });

      const lsp3ProfileIPFSUrl = uploadResult.url;

      const encodedData = erc725.encodeData(
        [
          {
            keyName: "LSP3Profile",
            value: {
              hashFunction: "keccak256(utf8)",
              hash: web3.utils.keccak256(JSON.stringify(uploadResult.json)),
              url: lsp3ProfileIPFSUrl,
            },
          }
        ]
      );

      const UniversalProfileContractAbi = UniversalProfile.abi as any;
      const universalProfileContract = new web3.eth.Contract(UniversalProfileContractAbi, address);
  
      sendToast({ message: 'Please approve the upcoming transaction using your wallet...', type: 'is-warning' });

      await universalProfileContract.methods['setData(bytes32[],bytes[])'](
        encodedData.keys,
        encodedData.values,
      ).send({ from: address });

      onClose();
      sendToast({ message: 'Profile successfuly updated!', type: 'is-success' });
      queryClient.invalidateQueries(['profile']);
    } catch (e) {
      sendToast({ message: (e as Error).message, type: 'is-danger' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show closeOnEsc closeOnBlur onClose={onClose}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>
            Change profile
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <Form.Field>
              <Form.Label>
                Name
              </Form.Label>
              <Form.Control>
                <Form.Input
                  placeholder="e.g. John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>
                Description
              </Form.Label>
              <Form.Control>
                <Form.Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>

            <ProfileModalTags tags={tags} onChange={setTags} />
            <ProfileModalLinks links={links} onChange={setLinks} />

            <Form.Field>
              <Form.Label>
                New Profile Image
              </Form.Label>
              <Form.Control>
                <Form.InputFile
                  align="center"
                  filename={newProfileImage ? newProfileImage.name : ''}
                  // @ts-ignore 
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setNewProfileImage(file);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>
                New Background Image
              </Form.Label>
              <Form.Control>
                <Form.InputFile
                  align="center"
                  filename={newBackgroundImage ? newBackgroundImage.name : ''}
                  // @ts-ignore 
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setNewBackgroundImage(file);
                  }}
                />
              </Form.Control>
            </Form.Field>
          </form>
        </Modal.Card.Body>
        <Modal.Card.Footer alignItems="flex-end">
          <Button color="success" loading={saving} disabled={saving} onClick={onSubmit}>
            Save
          </Button>
          <Button color="red" onClick={onClose}>
            Close
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
}

export default ProfileModal;
