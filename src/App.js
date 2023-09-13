 import './App.scss';
import RegistrationForm from './component/RegistrationForm'
import Header from './component/Header/Header'
import Footer from './component/Footer/Footer';
function App() {
  return (
    <div className="App">
      <Header/>
      <RegistrationForm/>
      <Footer/>
    </div>
  );
}

export default App;
