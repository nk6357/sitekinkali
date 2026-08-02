import { useEffect, useState } from 'react';

export const COOKIE_CHOICE_KEY = 'kinkali-cookie-choice-v1';
export const COOKIE_CHOICE_EVENT = 'kinkali-cookie-choice';
export type CookieChoice = 'all' | 'necessary';

export function getCookieChoice(): CookieChoice | null {
  const choice = window.localStorage.getItem(COOKIE_CHOICE_KEY);
  return choice === 'all' || choice === 'necessary' ? choice : null;
}

export function setCookieChoice(choice: CookieChoice) {
  window.localStorage.setItem(COOKIE_CHOICE_KEY, choice);
  window.dispatchEvent(new CustomEvent(COOKIE_CHOICE_EVENT, { detail: choice }));
}

export function CookieConsent() {
  const [choice, setChoice] = useState<CookieChoice | null>(() => getCookieChoice());
  const [mapConsent, setMapConsent] = useState(false);

  useEffect(() => {
    const handleChoice = (event: Event) => {
      setChoice((event as CustomEvent<CookieChoice>).detail);
    };
    window.addEventListener(COOKIE_CHOICE_EVENT, handleChoice);
    return () => window.removeEventListener(COOKIE_CHOICE_EVENT, handleChoice);
  }, []);

  if (choice) return null;

  const choose = (nextChoice: CookieChoice) => {
    setCookieChoice(nextChoice);
    setChoice(nextChoice);
  };

  return (
    <aside
      aria-label="Настройки cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-brand-300 bg-brand-50 p-4 shadow-2xl sm:p-5"
    >
      <p className="text-sm leading-relaxed text-brand-800 sm:text-base">
        Сайт использует необходимое локальное хранилище для корзины. Яндекс Карты загрузятся
        только с вашего разрешения. Подробнее — в{' '}
        <a className="font-semibold underline" href="/cookies">
          уведомлении о cookies
        </a>.
      </p>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-brand-800 sm:text-base">
        <input
          type="checkbox"
          checked={mapConsent}
          onChange={(event) => setMapConsent(event.target.checked)}
          className="mt-1 h-4 w-4 accent-brand-900"
        />
        <span>
          Я согласен на использование cookies и передачу технических данных сервису Яндекс для
          отображения карты.
        </span>
      </label>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => choose('all')}
          disabled={!mapConsent}
          className="rounded-lg bg-brand-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Разрешить карту
        </button>
        <button
          type="button"
          onClick={() => choose('necessary')}
          className="rounded-lg bg-brand-200 px-4 py-3 font-semibold text-brand-900"
        >
          Только необходимые
        </button>
      </div>
    </aside>
  );
}
