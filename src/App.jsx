import './App.css'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import PageRouter from './routes/PageRouter';
import CalculatorWidget from './components/CalculatorWidget';
import { ToastProvider } from './utils/GlobalToast';

const PUBLIC_PATHS = ['/', '/registration', '/public/logs'];

function hasAuthTokens() {
  return Boolean(
    localStorage.getItem('token') && localStorage.getItem('refreshToken')
  );
}

function App() {
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const isAuthenticated = hasAuthTokens();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
        {!isPublicPage && (
          <>
            {isSidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div
              className={
                isSidebarOpen
                  ? 'fixed inset-y-0 left-0 z-50 lg:static lg:z-auto'
                  : 'hidden lg:block'
              }
            >
              <Sidebar />
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label="Toggle sidebar"
              className={`fixed top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400 bg-blue-100 text-blue-700 shadow-lg transition-all hover:bg-blue-200 lg:hidden ${isSidebarOpen ? 'left-[12.5rem]' : 'left-4'}`}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
        <div className="flex-1 flex flex-col overflow-hidden ">
          {/* {!isPublicPage && <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />} */}
          <PageRouter/>
        </div>
        {!isPublicPage && <CalculatorWidget />}
      </div>
    </ToastProvider>
  );
}

export default App
