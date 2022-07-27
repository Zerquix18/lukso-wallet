import { Layout } from "../../components";
import { useAuthenticatedUser } from "../../hooks"

function Authenticated() {
  const { address } = useAuthenticatedUser();

  return (
    <Layout>Authenticated: { address }</Layout>
  );
}

export default Authenticated;
