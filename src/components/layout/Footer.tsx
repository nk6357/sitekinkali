import { Icon } from '../icons/Icon';
import { LEGAL_DETAILS } from '../../data/legal';

/**
 * Подвал сайта с контактами, ссылками на соцсети, копирайтом
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-brand-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          {/* Логотип и описание */}
          <div className="flex flex-col gap-4">
            <Icon name="аватар" size="lg" alt="Логотип" />
            <p className="text-sm text-brand-400">
              Ресторан грузинской кухни в Перми. Аутентичные рецепты, свежие продукты, тёплая атмосфера.
            </p>
          </div>

          {/* Контакты */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">Контакты</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={LEGAL_DETAILS.phoneHref}
                className="hover:text-brand-300 transition-colors"
              >
                {LEGAL_DETAILS.phone}
              </a>
              <p>г. Пермь, ул. Белинского, 6Б</p>
              <p className="text-brand-400">{LEGAL_DETAILS.workingHours}</p>
            </div>
          </div>

        </div>

        {/* Разделитель */}
        <div className="h-px bg-brand-800 mb-8" />

        {/* Нижняя часть */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-400">
          <p>
            © {currentYear} {LEGAL_DETAILS.shortName}. Все права защищены.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-end">
            <a
              href="/legal-details"
              className="hover:text-brand-50 transition-colors"
            >
              Реквизиты
            </a>
            <a
              href="/offer"
              className="hover:text-brand-50 transition-colors"
            >
              Оферта
            </a>
            <a
              href="/privacy"
              className="hover:text-brand-50 transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="/terms"
              className="hover:text-brand-50 transition-colors"
            >
              Пользовательское соглашение
            </a>
            <a
              href="/personal-data-consent"
              className="hover:text-brand-50 transition-colors"
            >
              Согласие на обработку данных
            </a>
            <a
              href="/cookies"
              className="hover:text-brand-50 transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
