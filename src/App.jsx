import './App.css'
import { useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import PageRouter from './routes/PageRouter';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {!isLoginPage && <Sidebar />}
      <PageRouter/>
    </div>
  );
}

export default App
