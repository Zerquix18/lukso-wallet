import { useState } from 'react';
import Web3 from 'web3';
import { useAuthentication } from '../../hooks';
import { IAuthenticationStateType } from '../../models';
declare var window: any;

function Unauthenticated() {
  const { authenticate } = useAuthentication();
  const [error, setError] = useState('');

  const onAuthenticate = async () => {
    if (! window.ethereum) {
      return;
    }

    const web3 = new Web3(window.ethereum);
    const addresses: string[] = await web3.eth.requestAccounts();
    const address = addresses[0];
    const result = await web3.eth.getCode(address);
    const type: IAuthenticationStateType = result === '0x' ? 'EOA' : 'UP';

    console.log({ address, type });
    authenticate(address);
  };

  return (
    <div>
      <button onClick={onAuthenticate}>Authenticate</button>
    </div>
  );
}

export default Unauthenticated;
