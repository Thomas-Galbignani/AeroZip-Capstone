import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import Reservation from './pages/reservation/Reservation';
import Profile from './pages/profile/Profile';
import PaymentSuccess from './pages/PaymentSucces/PaymentSucces';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
