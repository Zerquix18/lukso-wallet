import { useCallback, useEffect, useRef, useState } from "react";
import { Heading } from "react-bulma-components";

import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import LSP6KeyManager from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IController } from "../../../models";
import { stringToPermissions } from "../../../utils";

function Controllers() {
  const [loading, setLoading] = useState(true);
  const { address } = useAuthenticatedUser();

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
          permissions,
          allowedAddresses: allowedAddresses as string[] | null,
          allowedFunctions: allowedFunctions as string[] | null,
          allowedStandards: allowedStandards as string[] | null,
          allowedERC725YKeys: allowedERC725YKeys as string[] | null
        };
      });

      const controllers: IController[] = await Promise.all(controllersPromise);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [erc725]);

  useEffect(() => {
    fetchControllers();
  }, [fetchControllers]);

  return (
    <div>
      <Heading>Controllers</Heading>
      I am the controllers route.
    </div>
  );
}

export default Controllers;
