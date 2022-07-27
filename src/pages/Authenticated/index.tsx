import { useAuthenticatedUser } from "../../hooks"

function Authenticated() {
  const { address } = useAuthenticatedUser();
  return (
    <div>Authenticated: { address }</div>
  )
}

export default Authenticated;
