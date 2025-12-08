import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Sale from './pages/Sale';
import Settings from './pages/Settings';
import Report from './pages/Report';
import Sales from './pages/Sales';
import { Page } from './types/types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'inventory':
        return <Inventory onNavigate={setCurrentPage} />;
      case 'sale':
        return <Sale onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'report':
        return <Report onNavigate={setCurrentPage} />;
      case 'sales':
        return <Sales onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <StoreProvider>
      {renderPage()}
    </StoreProvider>
  );
}

export default App;
