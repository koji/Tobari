import { DataProvider } from './contexts/DataContext';
import Layout from './components/layout/Layout';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <DataProvider>
      <Layout />
      <Toaster />
    </DataProvider>
  );
}

export default App;