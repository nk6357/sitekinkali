import { LEGAL_DETAILS } from '../../data/legal';

/**
 * Секция контактов с адресом, телефоном, часами работы и картой
 */
export function Contacts() {
  return (
    <section id="contacts" className="bg-brand-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Заголовок */}
        <h2 className="font-heading text-4xl md:text-5xl font-semibold text-brand-900 mb-12 text-center">
          Контакты
        </h2>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Информация */}
          <div className="space-y-10 text-center">
            {/* Адрес */}
            <div>
              <h3 className="mb-3 font-heading text-2xl font-semibold text-brand-900 md:text-3xl">
                Адрес
              </h3>
              <p className="text-xl text-brand-700 md:text-2xl">
                г. Пермь, ул. Белинского, 6Б
              </p>
              <p className="mt-2 text-base text-brand-500 md:text-lg">
                Легко найти по картам
              </p>
            </div>

            {/* Телефон */}
            <div>
              <h3 className="mb-3 font-heading text-2xl font-semibold text-brand-900 md:text-3xl">
                Телефон
              </h3>
              <a
                href={LEGAL_DETAILS.phoneHref}
                className="text-2xl font-semibold text-brand-900 transition-colors hover:text-brand-700 md:text-3xl"
              >
                {LEGAL_DETAILS.phone}
              </a>
              <p className="mt-2 text-base text-brand-500 md:text-lg">
                Звоните для уточнения наличия и деталей
              </p>
            </div>

            {/* Часы работы */}
            <div>
              <h3 className="mb-3 font-heading text-2xl font-semibold text-brand-900 md:text-3xl">
                Часы работы
              </h3>
              <div className="space-y-2 text-xl text-brand-700 md:text-2xl">
                <p>Пн–чт и вс: 12:00–00:00</p>
                <p>Пт–сб: 12:00–01:00</p>
              </div>
            </div>

          </div>

          {/* Карта */}
          <div className="overflow-hidden rounded-xl bg-brand-100 shadow-md">
            <iframe
              src="https://yandex.ru/map-widget/v1/?z=16&ol=biz&oid=148918502337"
              title="Ресторан «Кинкали» на Яндекс Картах"
              className="h-80 w-full border-0 md:h-96"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="px-4 py-5 text-center font-body text-lg font-semibold text-brand-900 md:text-xl">
              г. Пермь, ул. Белинского, 6Б
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
