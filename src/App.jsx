import './App.css'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import PageRouter from './routes/PageRouter';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AnimatePresence>
        {!isLoginPage && isSidebarOpen && (
          <Sidebar key="sidebar" />
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoginPage && <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />}
        <PageRouter/>
      </div>
    </div>
  );
}

export default App
