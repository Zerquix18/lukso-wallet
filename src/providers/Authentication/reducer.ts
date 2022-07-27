import { IAuthenticationState, IAuthenticationStateType } from "../../models";

export type ActionType = 'AUTHENTICATE' | 'LOGOUT';
export type Action = {
  type: ActionType;
  [key: string]: string;
}

export default function reducer(_: IAuthenticationState, action: Action): IAuthenticationState {
  switch (action.type) {
    case 'AUTHENTICATE': {
      const address = action.address as string;
      const type: IAuthenticationStateType = 'UP'; // not sure if we'll ever support EOAs?
      const user = { address, type };
      return { user };
    };

    case 'LOGOUT': {
      const user = null;
      return { user };
    }

    // anything else
  } 
}
