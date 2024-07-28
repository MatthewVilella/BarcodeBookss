import HomeStack from './Routes/Stack';
import { GlobalProvider } from './GlobalProvider';

export default function App() {
  return (
    <GlobalProvider>
      <HomeStack />
    </GlobalProvider>
  );
};
