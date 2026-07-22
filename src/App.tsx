import { CartProvider, CartContext } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { About } from './components/sections/About';
import { Menu } from './components/sections/Menu';
import { OrderSection } from './components/sections/OrderSection';
import { Contacts } from './components/sections/Contacts';
import { Cart } from './components/cart/Cart';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { useContext } from 'react';

function AppContent() {
  const cart = useContext(CartContext);
  
  if (!cart) {
    return null;
  }

  if (cart.isCheckout) {
    return <CheckoutPage onClose={cart.closeCheckout} />;
  }

  return (
    <>
      <Header />
      <Menu />
      <About />
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
