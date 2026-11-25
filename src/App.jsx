import './App.css';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PageRouter from './routes/PageRouter';
import CalculatorWidget from './components/CalculatorWidget';
import ErpGuide from './components/chat/ErpGuide';
import { ToastProvider } from './utils/GlobalToast';

const PUBLIC_PATHS = ['/', '/registration', '/public/logs'];

function hasAuthTokens() {
  if (localStorage.getItem('token') && localStorage.getItem('refreshToken')) return true;
  return sessionStorage.getItem('offlineSession') === '1';
}

function App() {
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const isAuthenticated = hasAuthTokens();

  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
        {!isPublicPage && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageRouter />
        </div>

        {/* Floating ERP widgets mounted once in signed-in app shell */}
        {!isPublicPage && (
          <>
            <CalculatorWidget />
            <ErpGuide />
          </>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
