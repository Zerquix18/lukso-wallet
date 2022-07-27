import Pages from './pages';
import { AuthenticationProvider } from './providers/Authentication';

function App() {
  return (
    <AuthenticationProvider>
      <Pages />
    </AuthenticationProvider>
  );
}

export default App;
