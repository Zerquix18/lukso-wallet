import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Container, Message } from 'react-bulma-components';
import Web3 from 'web3';

import { useAuthentication } from '../../hooks';
import { IAuthenticationStateType } from '../../models';

import './index.css';

declare var window: any;

// this will later be re-factored to allow multiple wallets
// and or the creation of a new universal profile

let requested = false; // strict mode issues...

function Unauthenticated() {
  const { authenticate } = useAuthentication();
  const [error, setError] = useState('');

  const onAuthenticate = useCallback(async () => {
    try {
      if (requested) {
        return;
      }

      requested = true;

      if (! window.ethereum) {
        throw new Error('Could not find a wallet (window.ethereum is not defined)');
      }

      const addresses = await window.ethereum.request({ method: 'eth_accounts' });
      const web3 = new Web3(window.ethereum);
      if (addresses.length === 0) {
        throw new Error('Did not receive an address to use.');
      }

      const address = addresses[0];
      const result = await web3.eth.getCode(address);
      const type: IAuthenticationStateType = result === '0x' ? 'EOA' : 'UP';

      if (type === 'EOA') {
        throw new Error('Please use the universal profile extension.');
      }
      
      authenticate(address);
    } catch (e) {
      console.log(e);
      setError((e as Error).message);
    } finally {
      requested = true;
    }
  }, [authenticate]);

  const onDismissError = () => {
    setError('');
  };

  useEffect(() => {
    onAuthenticate();
  }, [onAuthenticate]);

  return (
    <Container>
      <div className="authentication-block-wrapper">
        <Box className="authentication-block">
          { error && (
            <Message color="danger" className="mb-3">
              <Message.Header>
                Error
                <Button remove onClick={onDismissError} />
              </Message.Header>
              <Message.Body>
                { error }
              </Message.Body>
            </Message>
          )}

          Welcome to the Lukso wallet! Please authenticate with one of the methods below:

          <Button.Group className="is-centered mt-3">
            <Button color="primary" onClick={onAuthenticate}>Sign in Browser Wallet</Button>
          </Button.Group>
        </Box>
      </div>
    </Container>
  );
}

export default Unauthenticated;
