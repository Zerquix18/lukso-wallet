import { useState } from "react";
import { Heading, Tabs } from "react-bulma-components";
import RecoverForm from "./RecoverForm";

import SignForm from "./SignForm";

type Tab = 'sign' | 'recover' | 'validate';

function Sign() {
  const [currentTab, setCurrentTab] = useState<Tab>('sign');

  return (
    <div>
      <Heading>
        Sign & Recover
      </Heading>

      <Tabs>
        <Tabs.Tab
          active={currentTab === 'sign'}
          onClick={() => {
            setCurrentTab('sign');
          }}
        >
          Sign
        </Tabs.Tab>
        <Tabs.Tab
          active={currentTab === 'recover'}
          onClick={() => {
            setCurrentTab('recover');
          }}
        >
          Recover
        </Tabs.Tab>
      </Tabs>

      { currentTab === 'sign' && <SignForm /> }
      { currentTab === 'recover' && <RecoverForm /> }
    </div>
  );
}

export default Sign;
