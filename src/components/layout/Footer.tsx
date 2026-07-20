import { Icon } from '../icons/Icon';

/**
 * Подвал сайта с контактами, ссылками на соцсети, копирайтом
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-brand-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                href="tel:+79999999999"
                className="hover:text-brand-300 transition-colors"
              >
                +7 (999) 999-99-99
              </a>
              <p>г. Пермь, ул. Ленина, д. 42</p>
              <p className="text-brand-400">Пн-Вс 11:00 - 23:00</p>
            </div>
          </div>

          {/* Соцсети */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">Мы в соцсетях</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/kinkali_restaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Telegram"
              >
                <Icon name="тг" size="md" alt="Telegram" className="text-brand-50" />
              </a>
              <a
                href="https://instagram.com/kinkali_restaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-brand-300 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://vk.com/kinkali_restaurant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-brand-300 transition-colors"
              >
                VK
              </a>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="h-px bg-brand-800 mb-8" />

        {/* Нижняя часть */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-400">
          <p>
            © {currentYear} ООО «Кинкали». Все права защищены.
          </p>
          <div className="flex gap-6">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
