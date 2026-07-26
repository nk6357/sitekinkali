import { useState, type FormEvent } from 'react';
import { formatPhone } from '../../utils/formatters';

interface ReservationForm {
  name: string;
  phone: string;
  guests: string;
  dateTime: string;
  consent: boolean;
}

const initialForm: ReservationForm = {
  name: '',
  phone: '',
  guests: '',
  dateTime: '',
  consent: false,
};

export function ReservationSection() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationId, setReservationId] = useState('');

  const [minDateTime] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 16),
  );

  const handleGuestsChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setForm((current) => ({ ...current, guests: value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 50) {
      setError('Количество человек должно быть целым числом от 1 до 50.');
      return;
    }

    if (form.name.trim().length < 2) {
      setError('Укажите имя — минимум 2 символа.');
      return;
    }

    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(form.phone)) {
      setError('Укажите телефон в формате +7 (000) 000-00-00.');
      return;
    }

    if (!form.dateTime || new Date(form.dateTime).getTime() < Date.now()) {
      setError('Выберите будущие дату и время.');
      return;
    }

    if (!form.consent) {
      setError('Подтвердите согласие с офертой и политикой конфиденциальности.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          guests,
          dateTime: form.dateTime,
          consent: form.consent,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Не удалось отправить заявку. Попробуйте позже.');
      }

      setReservationId(result?.reservationId || '');
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось отправить заявку. Попробуйте позже.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="bg-brand-50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm sm:p-8 md:p-12">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="font-heading text-3xl font-semibold text-brand-900 md:text-5xl">
              Забронировать столик
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-700 md:text-xl">
              Оставьте контактные данные, количество гостей и удобное время.
            </p>
          </div>

          {reservationId ? (
            <div className="rounded-2xl bg-brand-100 p-8 text-center">
              <h3 className="font-heading text-2xl font-semibold text-brand-900">
                Заявка отправлена
              </h3>
              <p className="mt-3 text-brand-700">
                Ресторан получил ваши данные. Мы позвоним вам, чтобы подтвердить бронирование.
              </p>
              <p className="mt-3 text-sm text-brand-600">
                Номер заявки: <strong className="text-brand-900">{reservationId}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setReservationId('');
                }}
                className="mt-5 block w-full text-sm font-semibold text-brand-700 underline"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-heading font-semibold text-brand-900">Имя *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    autoComplete="name"
                    maxLength={80}
                    className="h-14 w-full rounded-lg border-2 border-brand-200 bg-brand-50 px-4 outline-none transition-colors focus:border-brand-900"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="font-heading font-semibold text-brand-900">Телефон *</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: formatPhone(event.target.value),
                      }))
                    }
                    onBlur={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: formatPhone(event.target.value),
                      }))
                    }
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+7 (000) 000-00-00"
                    maxLength={18}
                    className="h-14 w-full rounded-lg border-2 border-brand-200 bg-brand-50 px-4 outline-none transition-colors focus:border-brand-900"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="font-heading font-semibold text-brand-900">Количество человек *</span>
                  <input
                    type="number"
                    value={form.guests}
                    onChange={(event) => handleGuestsChange(event.target.value)}
                    inputMode="numeric"
                    min={1}
                    max={50}
                    step={1}
                    className="h-14 w-full rounded-lg border-2 border-brand-200 bg-brand-50 px-4 outline-none transition-colors focus:border-brand-900"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="font-heading font-semibold text-brand-900">Дата и время *</span>
                  <input
                    type="datetime-local"
                    value={form.dateTime}
                    min={minDateTime}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, dateTime: event.target.value }))
                    }
                    className="h-14 w-full rounded-lg border-2 border-brand-200 bg-brand-50 px-4 outline-none transition-colors focus:border-brand-900"
                    required
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-brand-50 p-4">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, consent: event.target.checked }))
                  }
                  className="mt-1 h-5 w-5 flex-shrink-0 accent-brand-900"
                />
                <span className="text-sm leading-relaxed text-brand-700">
                  Я принимаю условия{' '}
                  <a href="/offer" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    оферты
                  </a>{' '}
                  и{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    политики конфиденциальности
                  </a>
                  .
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-4 text-center text-base font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mx-auto flex h-14 w-full max-w-sm items-center justify-center whitespace-nowrap rounded-lg bg-brand-900 px-6 font-heading text-lg font-semibold text-brand-50 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Отправляем…' : 'Забронировать'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
