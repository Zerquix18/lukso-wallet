import { Container, Dropdown, Heading, Icon, Navbar } from "react-bulma-components";

import { EXPLORER_URL } from "../../../constants";
import { useAuthenticatedUser, useAuthentication } from "../../../hooks";
import { sendToast } from "../../../utils";

function LayoutNavbar() {
  const { logout } = useAuthentication();
  const { address } = useAuthenticatedUser();

  const onDropdownSelect = async (value: string) => {
    switch (value) {
      case 'copy_address':
        await navigator.clipboard.writeText(address);
        sendToast({ message: 'Successfully added to the clipboard.', type: 'is-success' });
        break;
      case 'open_in_explorer':
        window.open(EXPLORER_URL + '/address/' + address);
        break;
      case 'logout':
        if (! window.confirm('Are you sure you want to log out?')) {
          return;
        }
    
        logout();
        break;
    }
  }

  return (
    <Navbar color="success">
      <Container>
        <Navbar.Brand>
          <Navbar.Item href="/">
            <Heading size={3}>Lukso Wallet</Heading>
          </Navbar.Item>
        </Navbar.Brand>
        <Navbar.Container align="right" style={{ marginTop: 12.5 }}>
          <Dropdown
            icon={<Icon><i aria-hidden="true" className="fas fa-angle-down"/></Icon>}
            label={address.slice(0, 6) + '...' + address.slice(-4)}
            onChange={onDropdownSelect}
          >
            <Dropdown.Item renderAs="a" value="copy_address">Copy Address</Dropdown.Item>
            <Dropdown.Item renderAs="a" value="open_in_explorer">Open address in explorer</Dropdown.Item>
            <Dropdown.Item renderAs="a" value="logout">Logout</Dropdown.Item>
          </Dropdown>
        </Navbar.Container>
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;