import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RouterComponent from './routes/RouterComponent';
import { ToastProvider } from './common/Toast/ToastProvider';

function App() {
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
