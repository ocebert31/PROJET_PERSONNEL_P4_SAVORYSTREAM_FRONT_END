import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RouterComponent from './routes/RouterComponent';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <RouterComponent />
      </main>
      <Footer />
    </div>
  );
}

export default App;
