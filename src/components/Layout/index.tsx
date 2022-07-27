import { Columns, Container } from "react-bulma-components";
import Navbar from './Navbar';
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <Container style={{ paddingTop: 30 }}>
        <Columns>
          <Columns.Column size="one-fifth">
            <Sidebar />
          </Columns.Column>
          <Columns.Column>
            { children }
          </Columns.Column>
        </Columns>
      </Container>
    </div>
  );
}

export default Layout;
