import { OrderForm } from '../cart/OrderForm';
import { Button } from '../ui/Button';

/**
 * Секция оформления предзаказа: форма самовывоза + кнопка Яндекс Доставки
 */
export function OrderSection() {
  return (
    <section id="order-section" className="bg-brand-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Форма самовывоза (2 колонки) */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-brand-900 mb-8">
              Оформить заказ
            </h2>
            <OrderForm />
          </div>

          {/* Блок Яндекс Доставки (1 колонка) */}
          <div className="bg-brand-50 rounded-xl p-6 md:p-8 h-fit sticky top-20">
            <h3 className="font-heading text-2xl font-semibold text-brand-900 mb-4">
              Хотите доставку на дом?
            </h3>

            <p className="text-brand-700 mb-6 text-sm leading-relaxed">
              Мы не доставляем самостоятельно, но наше меню доступно в Яндекс Доставке. 
              Оформите заказ там и получите его прямо домой!
            </p>

            <Button
              variant="yandex"
              href="https://yandex.ru/maps/org/kinkali/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 text-lg font-semibold"
            >
              Яндекс Доставка
            </Button>

            {/* Преимущества */}
            <div className="mt-8 space-y-3 text-sm text-brand-700">
              <div className="flex gap-2">
                <span className="text-xl">✓</span>
                <span>Быстрая доставка</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">✓</span>
                <span>Надежно упакуем</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">✓</span>
                <span>Горячая еда</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
