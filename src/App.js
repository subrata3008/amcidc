 import './App.scss';
 import { BrowserRouter as Router,Routes, Route, NavLink } from 'react-router-dom';
import RegistrationForm from './component/RegistratioForm/RegistrationForm'
import Header from './component/Header/Header'
import Footer from './component/Footer/Footer';
import DeliveryForm from './component/DeliveryForm/DeliveryForm';
function App() {
  return (
    <div className="App">
      <Header/>
      <Router>
        <div className="App">
            <ul className="nav-wrapper effect1">
            <li>
                <NavLink to="/"
                className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }>Registration form</NavLink>
            </li>
            <li>
                <NavLink to="/delivery-form"
                className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }>Delivery Form</NavLink>
            </li> 
            </ul>
        <Routes>
                <Route exact path='/' element={< RegistrationForm />}></Route>
                <Route exact path='/delivery-form' element={< DeliveryForm />}></Route> 
        </Routes>
        </div>
    </Router>
       
      <Footer/>
    </div>
  );
}

export default App;
