 import './App.scss';
import RegistrationForm from './component/RegistrationForm'
import Header from './component/Header/Header'
import Footer from './component/Footer/Footer';
import DeliveryForm from './component/DeliveryForm/DeliveryForm';
function App() {
  return (
    <div className="App">
      <Header/>
      <RegistrationForm/>
      <DeliveryForm/>
      <Footer/>
    </div>
  );
}

export default App;
