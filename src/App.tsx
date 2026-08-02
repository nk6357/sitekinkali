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
import { CookieConsent } from './components/legal/CookieConsent';
import { LEGAL_PATHS } from './data/legal';
import { useContext, useEffect } from 'react';

function CallPage() {
  const phone = new URLSearchParams(window.location.hash.slice(1)).get('phone') || '';
  const isValidPhone = /^\+\d{10,15}$/u.test(phone);
  const phoneHref = isValidPhone ? `tel:${phone}` : '/#contacts';

  useEffect(() => {
    if (isValidPhone) {
      window.location.assign(phoneHref);
    }
  }, [isValidPhone, phoneHref]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4 text-center">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-900">
          {isValidPhone ? 'Позвонить' : 'Номер телефона не найден'}
        </h1>
        <a
          href={phoneHref}
          className="mt-8 inline-block rounded-lg bg-brand-900 px-8 py-3 font-semibold text-white"
        >
          {isValidPhone ? phone : 'Вернуться к контактам'}
        </a>
      </div>
    </main>
  );
}

function AppContent() {
  const cart = useContext(CartContext);
  const legalDocumentId = LEGAL_PATHS[window.location.pathname];
  
  if (!cart) {
    return null;
  }

  if (window.location.pathname === '/call') {
    return <CallPage />;
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
      <CookieConsent />
    </CartProvider>
  );
}
