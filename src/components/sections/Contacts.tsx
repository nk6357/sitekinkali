import { Icon } from '../icons/Icon';

/**
 * Секция контактов с адресом, телефоном, часами работы, картой и соцсетями
 */
export function Contacts() {
  return (
    <section id="contacts" className="bg-brand-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Заголовок */}
        <h2 className="font-heading text-4xl md:text-5xl font-semibold text-brand-900 mb-12 text-center">
          Контакты
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Информация */}
          <div className="space-y-8">
            {/* Адрес */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-brand-900 mb-2">
                Адрес
              </h3>
              <p className="text-brand-700 text-lg">
                г. Пермь, ул. Белинского, 6Б
              </p>
              <p className="text-brand-500 text-sm mt-2">
                Центр города, легко найти по картам
              </p>
            </div>

            {/* Телефон */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-brand-900 mb-2">
                Телефон
              </h3>
              <a
                href="tel:+79999999999"
                className="text-brand-900 hover:text-brand-700 text-lg font-semibold transition-colors"
              >
                +7 (999) 999-99-99
              </a>
              <p className="text-brand-500 text-sm mt-2">
                Звоните для уточнения наличия и деталей
              </p>
            </div>

            {/* Часы работы */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-brand-900 mb-2">
                Часы работы
              </h3>
              <div className="text-brand-700 space-y-1">
                <p>Пн-Вс: 11:00 - 23:00</p>
                <p className="text-brand-500 text-sm">Перерыв на подготовку: 15:00 - 17:00</p>
              </div>
            </div>

            {/* Соцсети */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-brand-900 mb-4">
                Мы в соцсетях
              </h3>
              <div className="flex items-center gap-6">
                <a
                  href="https://t.me/kinkali_restaurant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Telegram"
                >
                  <Icon name="тг" size="lg" alt="Telegram" className="text-brand-900" />
                </a>
                <a
                  href="https://instagram.com/kinkali_restaurant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-900 hover:text-brand-700 font-semibold transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://vk.com/kinkali_restaurant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-900 hover:text-brand-700 font-semibold transition-colors"
                >
                  VK
                </a>
              </div>
            </div>
          </div>

          {/* Карта */}
          <div className="h-96 bg-brand-100 rounded-xl overflow-hidden shadow-md">
            <iframe
              title="Карта ресторана Кинкали"
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://yandex.ru/maps/?text=Пермь%2C+ул.+Белинского%2C+6Б&sll=56.234,58.014&z=15&l=map"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
