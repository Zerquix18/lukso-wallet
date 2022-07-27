import { Button, Container, Dropdown, Heading, Icon, Navbar } from "react-bulma-components";
import { useNavigate } from "react-router";
import { useAuthenticatedUser, useAuthentication } from "../../../hooks";

function LayoutNavbar() {
  const { authenticate, logout } = useAuthentication();
  const { address } = useAuthenticatedUser();

  const navigate = useNavigate();

  const onDropdownSelect = (value: string) => {
    switch (value) {
      case 'my-account':
        navigate('/my-account');
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
        <Navbar.Container align="right" alignItems="center">
          <Dropdown
            icon={<Icon><i aria-hidden="true" className="fas fa-angle-down"/></Icon>}
            label={address.slice(0, 6) + '...' + address.slice(-4)}
            onChange={onDropdownSelect}
          >
            <Dropdown.Item renderAs="a" value="logout">Logout</Dropdown.Item>
          </Dropdown>
        </Navbar.Container>
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;