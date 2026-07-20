import { Icon } from './components/icons/Icon';
import { MenuDownloads } from './components/sections/MenuDownloads';
import type { IconName } from './types';

/** Все доступные иконки брендбука — для демонстрации блока 2 */
const DEMO_ICONS: IconName[] = [
  'меню',
  'тг',
  'инфо',
  'интерьер',
  'ивенты',
  'сердце',
  'лупа с человеком внутри',
  'бар',
  'аватар',
];

function App() {
  return (
    <div className="min-h-screen bg-brand-50 font-body text-brand-900">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <Icon name="аватар" size="xl" className="mb-6" alt="Логотип НИКАЛА ПИРОСМАНИ" />

        <p className="font-heading text-sm uppercase tracking-[0.3em] text-brand-700">
          Ресторан грузинской кухни
        </p>
        <h1 className="mt-4 font-heading text-4xl md:text-6xl">
          НИКАЛА ПИРОСМАНИ
        </h1>
        <p className="mt-6 max-w-xl text-lg text-brand-700">
          Типы и компонент Icon подключены. Все иконки брендбука:
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {DEMO_ICONS.map((iconName) => (
            <li
              key={iconName}
              className="flex flex-col items-center gap-2 rounded-xl bg-brand-100 p-4"
            >
              <Icon name={iconName} size="lg" />
              <span className="max-w-[8rem] text-xs text-brand-700">{iconName}</span>
            </li>
          ))}
        </ul>
      </main>

      <MenuDownloads />
    </div>
  );
}

export default App;
