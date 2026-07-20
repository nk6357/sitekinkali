import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Menu } from './components/sections/Menu';
import { OrderSection } from './components/sections/OrderSection';
import { Contacts } from './components/sections/Contacts';
import { Cart } from './components/cart/Cart';

function AppContent() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Menu />
      <OrderSection />
      <Contacts />
      <Footer />
      <Cart />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
