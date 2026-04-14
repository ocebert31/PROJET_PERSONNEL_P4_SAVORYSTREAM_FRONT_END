import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RouterComponent from './routes/RouterComponent';
import { ToastProvider } from './common/Toast/ToastProvider';
import { AuthProvider } from "./context/AuthContext";
import SessionInitializer from './init/SessionInitializer';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SessionInitializer />
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <RouterComponent />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
