import { CartProvider, CartContext } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { About } from './components/sections/About';
import { Menu } from './components/sections/Menu';
import { OrderSection } from './components/sections/OrderSection';
import { ReservationSection } from './components/sections/ReservationSection';
import { Contacts } from './components/sections/Contacts';
import { Cart } from './components/cart/Cart';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { LegalPage } from './components/legal/LegalPage';
import { LEGAL_PATHS } from './data/legal';
import { useContext } from 'react';

function AppContent() {
  const cart = useContext(CartContext);
  const legalDocumentId = LEGAL_PATHS[window.location.pathname];
  
  if (!cart) {
    return null;
  }

  if (legalDocumentId) {
    return <LegalPage documentId={legalDocumentId} />;
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
      <ReservationSection />
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
