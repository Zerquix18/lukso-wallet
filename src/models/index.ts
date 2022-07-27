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
