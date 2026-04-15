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
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary">
            Aller au contenu principal
          </a>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            <RouterComponent />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
