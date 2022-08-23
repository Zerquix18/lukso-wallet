import { useRef } from "react";
import { Columns, Heading, Progress } from "react-bulma-components";
import { useQuery } from "@tanstack/react-query";

import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import LSP6KeyManager from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

import { DEFAULT_CONFIG, DEFAULT_PROVIDER } from "../../../constants";
import { useAuthenticatedUser } from "../../../hooks";
import { IController } from "../../../models";
import { getControllerType, stringToPermissions } from "../../../utils";

import Controller from "./Controller";

function Controllers() {
  const { address} = useAuthenticatedUser();

  const erc725Ref = useRef(new ERC725(LSP6KeyManager as ERC725JSONSchema[], address, DEFAULT_PROVIDER, DEFAULT_CONFIG));
  const erc725 = erc725Ref.current;

  const fetchControllers = async () => {
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

      const dataToFetch = extraKeys.map(keyName => ({ keyName, dynamicKeyParts: address }));
      const result = await Promise.all([
        getControllerType(address),
        erc725.fetchData(dataToFetch),
      ]);

      const [
        type,
        [
          { value: permissionsValue },
          { value: allowedAddresses },
          { value: allowedFunctions },
          { value: allowedStandards },
          { value: allowedERC725YKeys },
        ]
      ] = result;

      const permissions = stringToPermissions(permissionsValue as string);

      return {
        address,
        type,
        permissions,
        allowedAddresses: allowedAddresses as string[] | null,
        allowedFunctions: allowedFunctions as string[] | null,
        allowedStandards: allowedStandards as string[] | null,
        allowedERC725YKeys: allowedERC725YKeys as string[] | null
      };
    });

    const controllers: IController[] = await Promise.all(controllersPromise);
    return controllers;
  };

  const { isLoading, data: controllers } = useQuery(['controllers'], fetchControllers);

  if (isLoading || ! controllers) {
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
      </Heading>
      <Heading subtitle>Controllers have access to your Universal Profile and can perform actions on it.</Heading>

      <Controllers />
    </div>
  );
}

export default ControllersWrapper;
