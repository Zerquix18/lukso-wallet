import Web3 from "web3";

import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import LSP1UniversalReceiverDelegateUP from "@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateUP.json";
import LSP6KeyManager from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";

import { IControllerType } from "../../models";
import { NETWORK_URL } from "../../constants";

// interface ids: https://docs.lukso.tech/standards/smart-contracts/interface-ids/

export default async function getControllerType(controllerAddress: string): Promise<IControllerType> {
  const web3 = new Web3(NETWORK_URL);

  const code = await web3.eth.getCode(controllerAddress);

  if (code === '0x') {
    return 'EOA';
  }

  try {    
    const contractAbi = UniversalProfile.abi as any;
    const contract = new web3.eth.Contract(contractAbi, controllerAddress);
    const interfaceId = '0x63cb749b';
    await contract.methods.supportsInterface(interfaceId).call();
    return 'UP';
  } catch (e) {}

  try {
    const contractAbi = LSP1UniversalReceiverDelegateUP.abi as any;
    const contract = new web3.eth.Contract(contractAbi, controllerAddress);
    const interfaceId = '0xa245bbda';
    await contract.methods.supportsInterface(interfaceId).call();
    return 'URD';
  } catch (e) {}

  try {
    const contractAbi = LSP6KeyManager.abi as any;
    const contract = new web3.eth.Contract(contractAbi, controllerAddress);
    const interfaceId = '0xc403d48f';
    await contract.methods.supportsInterface(interfaceId).call();
    return 'KM';
  } catch (e) {}

  return 'SM';
}
