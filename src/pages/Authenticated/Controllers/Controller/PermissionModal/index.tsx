import { useState } from 'react';
import { Button, Form, Modal } from 'react-bulma-components';

import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

import { IController, IControllerPermission } from '../../../../../models';
import { useAuthenticatedUser } from '../../../../../hooks';
import { permissionsToString, sendToast } from '../../../../../utils';
import { useQueryClient } from '@tanstack/react-query';

interface PermissionModalProps {
  controller: IController;
  onClose: () => void;
}

function PermissionModal({ controller, onClose }: PermissionModalProps) {
  const { address, web3 } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState(controller.permissions);

  const allPermissions = Object.keys(permissions) as IControllerPermission[];

  const onSave = async () => {
    try {
      setSaving(true);

      sendToast({ message: 'Please approve the transaction using your wallet...', type: 'is-warning' });

      const UniversalProfileContractAbi = UniversalProfile.abi as any;
      const universalProfileContract = new web3.eth.Contract(UniversalProfileContractAbi, address);
  
      // https://docs.lukso.tech/standards/universal-profile/lsp6-key-manager/#types-of-permissions
      const key = '0x4b80742de2bf82acb3630000' + controller.address.slice(2);
      const value = permissionsToString(permissions);
  
      await universalProfileContract.methods["setData(bytes32,bytes)"](key, value).send({ from: address });
      sendToast({ message: 'Permissions successfully set!', type: 'is-success' });
      queryClient.invalidateQueries(['controllers']);
      onClose();
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
            Permissions
          </Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            { allPermissions.map((permission) => {
              const checked = permissions[permission];
              const description = descriptions[permission];
              const toggle = () => {
                const newPermissions = { ...permissions };
                newPermissions[permission] = ! newPermissions[permission];
                setPermissions(newPermissions);
              };

              return (
                <Form.Field key={permission}>
                  <Form.Control>
                    <Form.Checkbox checked={checked} onChange={toggle}>
                      { permission }
                    </Form.Checkbox>
                  </Form.Control>
                  { description && <Form.Help>{ description }</Form.Help> }
                </Form.Field>
              );
            })}
          </form>
        </Modal.Card.Body>
        <Modal.Card.Footer alignItems="flex-end" onClick={onSave}>
          <Button color="success" loading={saving} disabled={saving}>
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

const descriptions: { [key in IControllerPermission]: string } = {
  SUPER_DELEGATE_PERMISSION: '',
  SUPER_STATIC_CALL: '',
  SUPER_CALL: '',
  SUPER_TRANSFER_VALUE: '',
  SUPER_SET_DATA: '',
  SIGN: 'Allows signing on behalf of the universal profile (e.g for login)',
  TRANSFER_VALUE: 'Allows transfering value to other contracts with the universal profile',
  DEPLOY: 'Allows deploying other contracts through the universal profile',
  DELEGATE_CALL: 'Allows delegating other contracts through the universal profile.',
  STATIC_CALL: 'Allows calling other contracts through the universal profile',
  CALL: 'Allows calling other contracts through the universal profile',
  SET_DATA: 'Allows setting data on the universal profile',
  ADD_PERMISSIONS: 'Allows adding permissions to new addresses',
  CHANGE_PERMISSIONS: 'Allows changing existing permissions of addresses.',
  CHANGE_OWNER: 'Allows changing the owner of the controller contract.',
};

export default PermissionModal;
