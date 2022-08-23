import { toast, Options } from "bulma-toast";
import { IControllerPermissions } from "../models";

export function stringToPermissions(string: string) {
  const binaryString = parseInt(string).toString(2);
  const completeBinary = binaryString.padStart(15, '0');
  
  const permissions: IControllerPermissions = {
    SUPER_DELEGATE_PERMISSION: completeBinary[0] === '1',
    SUPER_STATIC_CALL: completeBinary[1] === '1',
    SUPER_CALL: completeBinary[2] === '1',
    SUPER_TRANSFER_VALUE: completeBinary[3] === '1',
    SUPER_SET_DATA: completeBinary[4] === '1',
    SIGN: completeBinary[5] === '1',
    TRANSFER_VALUE: completeBinary[6] === '1',
    DEPLOY: completeBinary[7] === '1',
    DELEGATE_CALL: completeBinary[8] === '1',
    STATIC_CALL: completeBinary[9] === '1',
    CALL: completeBinary[10] === '1',
    SET_DATA: completeBinary[11] === '1',
    ADD_PERMISSIONS: completeBinary[12] === '1',
    CHANGE_PERMISSIONS: completeBinary[13] === '1',
    CHANGE_OWNER: completeBinary[14] === '1',
  };

  return permissions;
}

export function permissionsToString(permissions: IControllerPermissions) {
  let completeBinary = '';

  completeBinary += permissions.SUPER_DELEGATE_PERMISSION ? '1' : '0';
  completeBinary += permissions.SUPER_STATIC_CALL ? '1' : '0';
  completeBinary += permissions.SUPER_CALL ? '1' : '0';
  completeBinary += permissions.SUPER_TRANSFER_VALUE ? '1' : '0';
  completeBinary += permissions.SUPER_SET_DATA ? '1' : '0';
  completeBinary += permissions.SIGN ? '1' : '0';
  completeBinary += permissions.TRANSFER_VALUE ? '1' : '0';
  completeBinary += permissions.DEPLOY ? '1' : '0';
  completeBinary += permissions.DELEGATE_CALL ? '1' : '0';
  completeBinary += permissions.STATIC_CALL ? '1' : '0';
  completeBinary += permissions.CALL ? '1' : '0';
  completeBinary += permissions.SET_DATA ? '1' : '0';
  completeBinary += permissions.ADD_PERMISSIONS ? '1' : '0';
  completeBinary += permissions.CHANGE_PERMISSIONS ? '1' : '0';
  completeBinary += permissions.CHANGE_OWNER ? '1' : '0';

  const hex = parseInt(completeBinary, 2).toString(16);
  return '0x' + hex.padStart(64, '0');
}

export function sendToast(options: Options) {
  toast({
    dismissible: true,
    pauseOnHover: true,
    position: 'bottom-left',
    duration: 5000,
    ...options,
  });
}
