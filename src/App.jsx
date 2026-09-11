import './App.css'
import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import PageRouter from './routes/PageRouter';
import { ToastProvider } from './utils/GlobalToast';

const PUBLIC_PATHS = ['/', '/registration'];

function hasAuthTokens() {
  return Boolean(
    localStorage.getItem('token') && localStorage.getItem('refreshToken')
  );
}

function App() {
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const isAuthenticated = hasAuthTokens();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {!isPublicPage && isSidebarOpen && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isPublicPage && <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />}
          <PageRouter/>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App
