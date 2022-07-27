import { useAuthentication } from "../hooks";
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";

function MainPage() {
  const { user } = useAuthentication();

  return user ? <Authenticated /> : <Unauthenticated />;
}

export default MainPage;
