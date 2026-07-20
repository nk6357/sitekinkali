import { Icon } from '../icons/Icon';
import { MENU_DOWNLOADS } from '../../data/menu';

/**
 * Блок скачивания PDF/DOCX меню внизу главной страницы.
 * Файлы лежат в /brandbook/ и доступны через public/brandbook.
 */
export function MenuDownloads() {
  return (
    <section
      id="downloads"
      className="border-t border-brand-200 bg-brand-100 px-6 py-12"
      aria-labelledby="downloads-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Icon name="инфо" size="lg" alt="" />
          <h2
            id="downloads-heading"
            className="font-heading text-2xl text-brand-900 md:text-3xl"
          >
            Скачать меню
          </h2>
        </div>

        <p className="mx-auto mb-8 max-w-xl text-brand-700">
          Полное меню ресторана и фуршетное предложение — скачайте файлы в удобном формате
        </p>

        <ul className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {MENU_DOWNLOADS.map((file) => (
            <li key={file.id} className="flex-1 sm:max-w-xs">
              <a
                href={file.href}
                download={file.fileName}
                className="flex min-h-[44px] flex-col items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 px-6 py-5 transition-colors hover:border-brand-900 hover:bg-brand-300"
              >
                <span className="font-heading text-lg text-brand-900">{file.title}</span>
                <span className="mt-1 text-sm text-brand-700">{file.description}</span>
                <span className="mt-3 font-heading text-sm text-brand-900 underline-offset-2 hover:underline">
                  Скачать файл
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default MenuDownloads;
