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
              Ресторан «Кинкали» — место, где современный стиль встречается с душой
              настоящей Грузии.
            </p>

            <p className="font-body text-lg text-brand-700">
              Здесь вы не найдёте ковров и папах — только элегантные бежево-коричневые оттенки,
              тёплый свет, сухоцветы и безымянные картины, которые, как и наша кухня, говорят без слов.
              Одна из них — огромная фреска на всю стену, нарисованная вручную, — будто приглашает вас
              прикоснуться к чему-то личному.
            </p>

            <p className="font-body text-lg text-brand-700">
              На первом этаже вас ждёт ресторан-бар с широким выбором вин и настоящей чачи — как в лучших
              домах Тбилиси. А выше — два зала, один из которых мы с радостью отдадим вам для тёплых встреч,
              дней рождений и других важных событий.
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

      </div>
    </section>
  );
}
