import { useCallback, useEffect, useRef, useState } from "react";
import { Columns, Heading, Progress } from "react-bulma-components";

import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import LSP6KeyManager from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IController } from "../../../models";
import { stringToPermissions } from "../../../utils";
import Controller from "./Controller";
import Web3 from "web3";

declare var window: any;

function Controllers() {
  const { address } = useAuthenticatedUser();
  const [loading, setLoading] = useState(true);
  const [controllers, setControllers] = useState<IController[]>([]);

  const erc725Ref = useRef(new ERC725(LSP6KeyManager as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchControllers = useCallback(async () => {
    try {
      const addressesData = await erc725.getData('AddressPermissions[]');
      const addresses = addressesData.value as string[];

      const controllersPromise = addresses.map(async address => {
        const extraKeys = [
          'AddressPermissions:Permissions:<address>',
          'AddressPermissions:AllowedAddresses:<address>',
          'AddressPermissions:AllowedFunctions:<address>',
          'AddressPermissions:AllowedStandards:<address>',
          'AddressPermissions:AllowedERC725YKeys:<address>',
        ];

        const promises = extraKeys.map(keyName => erc725.fetchData({ keyName, dynamicKeyParts: address }));

        // @todo maybe have a single instance shared in the state?
        const web3 = new Web3(window.ethereum);
        const isEOA = (await web3.eth.getCode(address)) === '0x';

        const result = await Promise.all(promises);

        const [
          { value: permissionsValue },
          { value: allowedAddresses },
          { value: allowedFunctions },
          { value: allowedStandards },
          { value: allowedERC725YKeys },
        ] = result;

        const permissions = stringToPermissions(permissionsValue as string);
        return {
          address,
          isEOA,
          permissions,
          allowedAddresses: allowedAddresses as string[] | null,
          allowedFunctions: allowedFunctions as string[] | null,
          allowedStandards: allowedStandards as string[] | null,
          allowedERC725YKeys: allowedERC725YKeys as string[] | null
        };
      });

      const controllers: IController[] = await Promise.all(controllersPromise);
      setControllers(controllers);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [erc725]);

  useEffect(() => {
    fetchControllers();
  }, [fetchControllers]);

  if (loading) {
    return <Progress />;
  }

  return (
    <div>
      <Columns>
        { controllers.map(controller => {
          return (
            <Columns.Column key={controller.address} size="one-third">
              <Controller controller={controller} />
            </Columns.Column>
          );
        })}
      </Columns>
    </div>
  );
}

function ControllersWrapper() {
  return (
    <div>
      <Heading>
        Controllers
        <Heading subtitle>Controllers have access to your Universal Profile and can perform actions on it.</Heading>
      </Heading>

      <Controllers />
    </div>
  );
}

export default ControllersWrapper;
