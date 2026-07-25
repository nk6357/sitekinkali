import { Icon } from '../icons/Icon';
import { Footer } from '../layout/Footer';
import {
  LEGAL_DETAILS,
  LEGAL_DOCUMENTS,
  type LegalDocumentId,
} from '../../data/legal';

interface LegalPageProps {
  documentId: LegalDocumentId;
}

export function LegalPage({ documentId }: LegalPageProps) {
  const document = LEGAL_DOCUMENTS[documentId];

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="sticky top-0 z-40 border-b border-brand-200 bg-brand-50/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <a href="/" className="flex items-center gap-3" aria-label="Вернуться на главную">
            <Icon name="аватар" size="md" alt="Кинкали" />
            <span className="font-heading text-lg font-semibold">Кинкали</span>
          </a>
          <a
            href="/"
            className="rounded-lg border border-brand-300 px-4 py-2 text-sm transition-colors hover:bg-brand-100"
          >
            На главную
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mb-10 rounded-3xl bg-brand-100 p-6 md:p-10">
          <p className="mb-3 text-sm text-brand-600">Юридическая информация</p>
          <h1 className="font-heading text-3xl font-semibold leading-tight md:text-5xl">
            {document.title}
          </h1>
          <p className="mt-4 max-w-3xl text-brand-700">{document.description}</p>
          <p className="mt-5 text-sm text-brand-600">
            Редакция от {LEGAL_DETAILS.updatedAt}
          </p>
        </div>

        <article className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm md:p-10">
          <div className="space-y-10">
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 font-heading text-2xl font-semibold text-brand-900">
                  {section.title}
                </h2>

                {section.paragraphs && (
                  <div className="space-y-4 text-brand-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-7 md:text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ul className="space-y-3 text-brand-700">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 text-base leading-7 md:text-lg">
                        <span className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-brand-900" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-brand-200 pt-6 text-sm text-brand-600">
            По вопросам документов: {' '}
            <a
              href={LEGAL_DETAILS.emailHref}
              className="font-semibold text-brand-900 underline decoration-brand-400 underline-offset-4"
            >
              {LEGAL_DETAILS.email}
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
