import { Menu } from "react-bulma-components";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const goTo = (path: string) => () => navigate(path);

  const items = [
    { path: '/assets', name: 'Assets' },
    { path: '/controllers', name: 'Controllers' },
    { path: '/profile', name: 'My Profile' },
    { path: '/send', name: 'Send LYX' },
    { path: '/sign', name: 'Sign & Recover' },
  ];

  return (
    <Menu>
      <Menu.List title="Pages">
        { items.map(item => {
          const active = pathname === item.path;
          return <Menu.List.Item key={item.path} active={active} onClick={goTo(item.path)}>{ item.name }</Menu.List.Item>;
        })}
      </Menu.List>
    </Menu>
  );
}

export default Sidebar;
