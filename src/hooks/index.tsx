// to split into multiple files once there are enough

import { useCallback, useContext } from "react";
import { AuthenticationContext } from "../providers/Authentication";

/*
  Returns the state of authentication along with functions to log in / log out
*/
export function useAuthentication() {
  const authenticationContext = useContext(AuthenticationContext);

  if (! authenticationContext) {
    throw new Error('Trying to access authentication context from outside provider');
  }

  const { state, dispatch } = authenticationContext;

  const authenticate = useCallback((address: string) => {
    dispatch({ type: 'AUTHENTICATE', address });
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  return { ...state, authenticate, logout };
}

// returns the authenticated user, must be called inside authenticated routes
export function useAuthenticatedUser() {
  const authenticationContext = useContext(AuthenticationContext);

  if (! authenticationContext) {
    throw new Error('Trying to access authentication context from outside provider');
  }

  const { state: { user } } = authenticationContext;

  if (! user) {
    throw new Error('User is not authenticated.');
  }

  return user;
}
