import { Icon } from '../icons/Icon';
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
                Центр города, легко найти по картам
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
          <div className="flex min-h-96 flex-col items-center justify-center overflow-hidden rounded-xl bg-brand-100 p-8 text-center shadow-md">
            <div className="text-center">
              <Icon name="инфо" size="lg" alt="Адрес" className="text-brand-900 mx-auto mb-4" />
              <p className="mb-3 text-xl font-semibold text-brand-900 md:text-2xl">
                г. Пермь, ул. Белинского, 6Б
              </p>
              <p className="mb-6 text-lg text-brand-700 md:text-xl">
                Нажмите, чтобы открыть на карте
              </p>
              <a
                href="https://yandex.ru/maps/?text=Пермь%2C+ул.+Белинского%2C+6Б&z=15"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-brand-900 text-white rounded-lg hover:bg-brand-800 transition-colors font-semibold"
              >
                Открыть на Яндекс Картах →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
