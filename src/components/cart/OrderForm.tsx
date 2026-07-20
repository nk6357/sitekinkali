import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formatPrice, getNowDateTimeLocal, isValidPhone } from '../../utils/formatters';

/**
 * Форма оформления предзаказа для самовывоза
 * Отправляет данные на Formspree
 */
export function OrderForm() {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupDateTime: getNowDateTimeLocal(),
    comment: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Формировать список товаров в текстовом формате
  const getOrderItems = (): string => {
    return items
      .map((item) => `${item.menuItem.name} (${item.quantity}x) - ${formatPrice(item.menuItem.price * item.quantity)}`)
      .join('\n');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидация
    if (!formData.name.trim()) {
      setErrorMessage('Пожалуйста, укажите ваше имя');
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setErrorMessage('Пожалуйста, укажите корректный номер телефона');
      return;
    }

    if (!formData.pickupDateTime) {
      setErrorMessage('Пожалуйста, укажите дату и время самовывоза');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Пожалуйста, согласитесь на обработку данных');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Корзина пуста. Добавьте блюда для заказа');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Подготовить данные формы
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('pickupDateTime', formData.pickupDateTime);
      formPayload.append('comment', formData.comment);
      formPayload.append('items', getOrderItems());
      formPayload.append('totalPrice', formatPrice(totalPrice));

      // Отправить на Formspree
      // TODO: Заменить на реальный endpoint Formspree
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          pickupDateTime: getNowDateTimeLocal(),
          comment: '',
          consent: false,
        });
        clearCart();

        // Показать успешное сообщение на 5 секунд
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage('Ошибка при отправке заказа. Попробуйте позже.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Ошибка при отправке заказа. Проверьте подключение к интернету.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-brand-50 rounded-xl p-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h3 className="font-heading text-2xl font-semibold text-brand-900 mb-2">
          Заказ принят!
        </h3>
        <p className="text-brand-700 mb-6">
          Спасибо за ваш заказ. Мы скоро с вами свяжемся для подтверждения.
        </p>
        <Button variant="primary" href="#menu-section">
          Назад к меню
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-50 rounded-xl p-6 md:p-8">
      <h3 className="font-heading text-2xl font-semibold text-brand-900 mb-6">
        Детали предзаказа
      </h3>

      {/* Сообщение об ошибке */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Информация о товарах */}
      {items.length > 0 && (
        <div className="mb-6 p-4 bg-brand-100 rounded-lg">
          <p className="text-sm text-brand-700 font-semibold mb-2">
            Ваш заказ: {items.length} {items.length === 1 ? 'блюдо' : 'блюд'}
          </p>
          <p className="text-lg font-semibold text-brand-900">
            Итого: {formatPrice(totalPrice)}
          </p>
        </div>
      )}

      {/* Поля формы */}
      <div className="space-y-4 mb-6">
        <Input
          id="name"
          label="Ваше имя"
          type="text"
          value={formData.name}
          onChange={(val) => handleInputChange('name', val as string)}
          placeholder="Иван"
          required
        />

        <Input
          id="phone"
          label="Номер телефона"
          type="tel"
          value={formData.phone}
          onChange={(val) => handleInputChange('phone', val as string)}
          placeholder="+7 (999) 999-99-99"
          required
        />

        <Input
          id="pickupDateTime"
          label="Дата и время самовывоза"
          type="datetime-local"
          value={formData.pickupDateTime}
          onChange={(val) => handleInputChange('pickupDateTime', val as string)}
          required
        />

        <Input
          id="comment"
          label="Комментарий (опционально)"
          type="textarea"
          value={formData.comment}
          onChange={(val) => handleInputChange('comment', val as string)}
          placeholder="Напишите пожелания или особые просьбы..."
          rows={3}
          maxLength={500}
        />

        <Input
          id="consent"
          label="Я согласен(а) с обработкой моих персональных данных"
          type="checkbox"
          checked={formData.consent}
          onChange={(val) => handleInputChange('consent', val as boolean)}
          required
        />
      </div>

      {/* Справка о доставке */}
      <div className="mb-6 p-4 bg-brand-100 rounded-lg text-sm text-brand-700">
        <p className="font-semibold mb-2">Информация:</p>
        <p>Оплата производится наличными или картой при получении в ресторане.</p>
      </div>

      {/* Кнопка отправки */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || items.length === 0}
        className="w-full py-4"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить предзаказ'}
      </Button>
    </form>
  );
}
