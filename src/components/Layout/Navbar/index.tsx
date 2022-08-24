import { Container, Dropdown, Heading, Icon, Navbar } from "react-bulma-components";
import { toast } from 'bulma-toast';
import { useAuthenticatedUser, useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";

function LayoutNavbar() {
  const { logout } = useAuthentication();
  const { address } = useAuthenticatedUser();
  const navigate = useNavigate();

  const onDropdownSelect = (value: string) => {
    switch (value) {
      case 'my_profile':
        navigate('/profile');
        break;
      case 'copy_address':
        navigator.clipboard.writeText(address).then(() => {
          toast({
            message: 'Successfully added to the clipboard.',
            type: 'is-success',
            dismissible: true,
            pauseOnHover: true,
            position: 'bottom-right',
          });
        });
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
            <Dropdown.Item renderAs="a" value="my_profile">My Profile</Dropdown.Item>
            <Dropdown.Item renderAs="a" value="logout">Logout</Dropdown.Item>
          </Dropdown>
        </Navbar.Container>
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;