import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";
import { useAuthentication } from "../hooks";

const queryClient = new QueryClient();

function MainPage() {
  const { user } = useAuthentication();

  return (
    <QueryClientProvider client={queryClient}>
      { user ? <Authenticated /> : <Unauthenticated /> }
    </QueryClientProvider>
  );
}

export default MainPage;
