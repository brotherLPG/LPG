import './App.css'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import PageRouter from './routes/PageRouter';
import { ToastProvider } from './utils/GlobalToast';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {!isLoginPage && isSidebarOpen && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoginPage && <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />}
          <PageRouter/>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App
