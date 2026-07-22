import { useCallback } from 'react';
import { Button } from '../ui/Button';

/**
 * Секция выбора способа получения заказа
 */
export function OrderSection() {
  const handlePickup = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section id="order-section" className="bg-brand-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-brand-50 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-brand-900 mb-6">
            Способ оформления заказа
          </h2>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="primary"
              onClick={handlePickup}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
              Самовывоз
            </Button>
            <Button
              variant="primary"
              href="https://eda.yandex.ru/perm/r/kinkali"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-brand-300 text-brand-900 hover:bg-brand-400 active:bg-brand-500 px-8 py-4 text-lg font-semibold"
            >
              Доставка
            </Button>
          </div>

          <p className="mt-5 font-body text-lg text-brand-600">
            Чтобы оформить заказ самовывозом, воспользуйтесь нашим сайтом
          </p>
        </div>
      </div>
    </section>
  );
}
