import { Icon } from '../icons/Icon';

/**
 * Секция "О ресторане" с описанием концепции и галереей интерьера
 */
export function About() {
  const interiorPhotos = [
    { id: 1, title: 'Основной зал' },
    { id: 2, title: 'Приватная зона' },
    { id: 3, title: 'Бар' },
    { id: 4, title: 'Терраса' },
  ];

  return (
    <section id="about" className="bg-brand-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Заголовок с иконкой */}
        <div className="flex items-center gap-3 mb-8">
          <Icon name="инфо" size="lg" alt="Информация" className="text-brand-900" />
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-brand-900">
            О ресторане
          </h2>
        </div>

        {/* Текстовое описание */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <p className="font-body text-lg text-brand-700">
              КИНКАЛИ — это не просто ресторан, а окно в культуру и гастрономию Грузии. 
              Каждое блюдо — результат многолетних семейных традиций и мастерства наших шефов.
            </p>

            <p className="font-body text-lg text-brand-700">
              Мы используем только свежие, натуральные продукты без консервантов и искусственных добавок. 
              От специй из Батуми до сыра сулугуни из горных регионов — всё подлинное и аутентичное.
            </p>

            <p className="font-body text-lg text-brand-700">
              Наша команда прошла подготовку в лучших грузинских ресторанах и спешит поделиться 
              с вами настоящей кухней Кавказа в уютной атмосфере.
            </p>

            {/* Ключевые преимущества */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Icon name="сердце" size="md" alt="Сердце" className="text-brand-700 mt-1 flex-shrink-0" />
                <span className="text-brand-900 font-semibold">Аутентичные рецепты</span>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="сердце" size="md" alt="Сердце" className="text-brand-700 mt-1 flex-shrink-0" />
                <span className="text-brand-900 font-semibold">Свежие ингредиенты</span>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="сердце" size="md" alt="Сердце" className="text-brand-700 mt-1 flex-shrink-0" />
                <span className="text-brand-900 font-semibold">Профессиональная команда</span>
              </div>
            </div>
          </div>

          {/* Галерея интерьера */}
          <div className="grid grid-cols-2 gap-4">
            {interiorPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative h-40 md:h-48 bg-brand-100 rounded-xl overflow-hidden 
                  hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    name="интерьер"
                    size="lg"
                    alt={photo.title}
                    className="text-brand-400 opacity-50"
                  />
                </div>
                <p className="relative text-center text-sm font-semibold text-brand-900 bg-brand-50/80 
                  px-3 py-2 rounded">
                  {photo.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Блок с наградами/сертификатами */}
        <div className="bg-brand-100 rounded-xl p-8 text-center">
          <h3 className="font-heading text-2xl font-semibold text-brand-900 mb-4">
            Награды и признание
          </h3>
          <p className="text-brand-700 max-w-2xl mx-auto">
            Лучший ресторан грузинской кухни в Пермской области (2023). 
            Рекомендован порталом TripAdvisor и входит в топ учреждений общественного питания города.
          </p>
        </div>
      </div>
    </section>
  );
}
