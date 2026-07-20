import { Button } from '../ui/Button';
import { Icon } from '../icons/Icon';

/**
 * Hero-блок: полноэкранный баннер с названием ресторана, слоганом и CTA-кнопками
 */
export function Hero() {
  const handleOrderClick = () => {
    // Прокрутить к секции заказа
    const orderSection = document.getElementById('order-section');
    orderSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    // Прокрутить к меню
    const menuSection = document.getElementById('menu-section');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen w-full bg-brand-900 flex items-center justify-center overflow-hidden"
    >
      {/* Фоновое изображение из брендбука */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/brandbook/фото%20стены.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7,
        }}
      />
      {/* Темное наложение для лучшей читаемости текста */}
      <div className="absolute inset-0 bg-brand-900/40" />

      {/* Контент */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Логотип аватар */}
        <div className="mb-8 flex justify-center">
          <Icon
            name="аватар"
            size="xl"
            alt="Логотип Кинкали"
            className="text-brand-50"
          />
        </div>

        {/* Название ресторана */}
        <h1 className="font-heading text-5xl md:text-7xl font-semibold text-brand-50 mb-4">
          КИНКАЛИ
        </h1>

        {/* Слоган */}
        <p className="font-body text-lg md:text-2xl text-brand-100 mb-12 max-w-2xl mx-auto">
          Подлинная грузинская кухня, домашнее тепло и гостеприимство в каждом блюде
        </p>

        {/* CTA-кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            onClick={handleOrderClick}
            className="w-full sm:w-auto"
          >
            Сделать предзаказ
          </Button>
          <Button
            variant="secondary"
            onClick={handleMenuClick}
            className="w-full sm:w-auto border-brand-50 text-brand-50 hover:bg-brand-50 hover:text-brand-900"
          >
            Смотреть меню
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center text-brand-200 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Icon name="инфо" size="sm" alt="Часы" className="text-brand-100" />
            <span>Пн-Вс 11:00 - 23:00</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Icon name="инфо" size="sm" alt="Адрес" className="text-brand-100" />
            <span>г. Пермь, ул. Ленина, д. 42</span>
          </div>
        </div>
      </div>
    </section>
  );
}
