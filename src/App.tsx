import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RouterComponent from './routes/RouterComponent';
import { ToastProvider } from './common/Toast/ToastProvider';
import { useEffect } from "react";
import { bootstrapSession } from "./services/sessionService";

function App() {
  useEffect(() => {
    // Si un cookie HttpOnly existe, on récupère un access token en mémoire.
    void bootstrapSession();
  }, []);

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <RouterComponent />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
