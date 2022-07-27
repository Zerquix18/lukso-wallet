import React, { useReducer } from 'react';
import { IAuthenticationState } from '../../models';
import reducer, { Action } from './reducer';

export interface AuthenticationContextType {
  state: IAuthenticationState;
  dispatch: React.Dispatch<Action>;
}

export const AuthenticationContext = React.createContext<AuthenticationContextType | null>(null);

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [state, dispatch] = useReducer(reducer, { user: null });

  return (
    <AuthenticationContext.Provider value={{ state, dispatch }}>
      { children }
    </AuthenticationContext.Provider>
  );
}
