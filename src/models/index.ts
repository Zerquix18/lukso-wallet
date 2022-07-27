// for now only Universal Profiles will be supported
// I don't think a wallet would support Externally Owned Accounts,
// however, my understanding of the project is limited so far
// so leaving the option open

export type IAuthenticationStateType = 'EOA' | 'UP';
export interface IAuthenticationStateUser {
  address: string;
  type: IAuthenticationStateType;
};
export interface IAuthenticationState {
  user: IAuthenticationStateUser | null;
}

export type IControllerPermission = (
  'SUPER_DELEGATE_PERMISSION' |
  'SUPER_STATIC_CALL' |
  'SUPER_CALL' |
  'SUPER_TRANSFER_VALUE' |
  'SUPER_SET_DATA' |
  'SIGN' |
  'TRANSFER_VALUE' |
  'DEPLOY' |
  'DELEGATE_CALL' |
  'STATIC_CALL' |
  'CALL' |
  'SET_DATA' |
  'ADD_PERMISSIONS' |
  'CHANGE_PERMISSIONS' |
  'CHANGE_OWNER'
)

export type IControllerPermissions = {
  [key in IControllerPermission]: boolean;
}

export interface IController {
  address: string;
  permissions: IControllerPermissions;
  allowedAddresses: string[] | null;
  allowedFunctions: string[] | null;
  allowedStandards: string[] | null;
  allowedERC725YKeys: string[] | null;
}
