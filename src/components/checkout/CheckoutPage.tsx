import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatPrice } from '../../utils/formatters';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateConsent,
} from '../../utils/validation';

export interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  comment: string;
  consent: boolean;
}

interface CheckoutPageProps {
  onClose: () => void;
}

export function CheckoutPage({ onClose }: CheckoutPageProps) {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Скролл в верх при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    comment: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Очистить ошибку при редактировании
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.error || 'Ошибка';
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.error || 'Ошибка';
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || 'Ошибка';
    }

    const consentValidation = validateConsent(formData.consent);
    if (!consentValidation.valid) {
      newErrors.consent = consentValidation.error || 'Ошибка';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Подготовить данные заказа
      const paymentMethod = 'Оплата наличными или банковской картой при получении заказа';
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        items: items.map((cartItem: any) => ({
          name: cartItem.menuItem.name,
          price: cartItem.menuItem.price,
          quantity: cartItem.quantity,
          total: cartItem.menuItem.price * cartItem.quantity,
        })),
        totalPrice,
        totalItems,
        pickupLocation: 'Самовывоз Белинского, 6Б',
        paymentMethod,
        comment: formData.comment || 'Как можно скорее',
        timestamp: new Date().toISOString(),
      };

      // Отправить на сервер
      const response = await fetch('/api/orders/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа');
      }

      // Показать сообщение об успехе
      setSuccessMessage('Спасибо! Ваш заказ принят. Проверьте email для подтверждения.');

      // Очистить корзину
      clearCart();

      // Закрыть страницу оформления через 2 секунды
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Ошибка при отправке заказа',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">✓</div>
          <h2 className="font-heading text-2xl font-bold text-brand-900">{successMessage}</h2>
          <Button variant="primary" onClick={onClose} className="w-full py-3">
            Вернуться на сайт
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-brand-200 shadow-sm z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-brand-900">Оформление заказа</h1>
          <button
            onClick={onClose}
            className="text-brand-500 hover:text-brand-900 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Cart Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="font-heading text-xl font-bold text-brand-900">Ваш заказ</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((cartItem: any) => (
              <div key={cartItem.menuItem.id} className="flex justify-between items-start pb-3 border-b border-brand-100">
                <div>
                  <p className="font-heading font-semibold text-brand-900">{cartItem.menuItem.name}</p>
                  <p className="text-sm text-brand-600">{cartItem.menuItem.weight}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-brand-900">
                    {formatPrice(cartItem.menuItem.price * cartItem.quantity)}
                  </p>
                  <p className="text-sm text-brand-600">x{cartItem.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t-2 border-brand-200">
            <div className="flex justify-between items-center">
              <span className="font-heading text-lg font-semibold text-brand-900">Итого:</span>
              <span className="font-heading text-2xl font-bold text-brand-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-sm text-brand-600 mt-2">{totalItems} блюд(о)</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="font-heading text-xl font-bold text-brand-900">Контактные данные</h2>

          {/* Name */}
          <Input
            id="name"
            label="Ваше имя"
            type="text"
            value={formData.name}
            onChange={(value: string | boolean) => handleInputChange('name', value)}
            placeholder="Иван"
            required
            error={errors.name}
          />

          {/* Phone */}
          <Input
            id="phone"
            label="Номер телефона"
            type="tel"
            value={formData.phone}
            onChange={(value: string | boolean) => handleInputChange('phone', value)}
            placeholder="+7 (999) 123-45-67"
            required
            error={errors.phone}
          />

          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="text"
            value={formData.email}
            onChange={(value: string | boolean) => handleInputChange('email', value)}
            placeholder="ваша@почта.ru"
            required
            error={errors.email}
          />

          {/* Pickup Location - Non-editable */}
          <div>
            <label className="block font-heading font-semibold text-brand-900 mb-2">
              Место самовывоза
            </label>
            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg px-4 py-3 text-brand-900 font-body">
              Самовывоз Белинского, 6Б
            </div>
          </div>

          {/* Payment Method - Non-editable */}
          <div>
            <label className="block font-heading font-semibold text-brand-900 mb-2">
              Способ оплаты
            </label>
            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg px-4 py-3 text-brand-900 font-body">
              Оплата наличными или банковской картой при получении заказа
            </div>
          </div>

          {/* Comment */}
          <Input
            id="comment"
            label="Комментарий"
            type="textarea"
            value={formData.comment}
            onChange={(value: string | boolean) => handleInputChange('comment', value)}
            placeholder="Укажите желаемое время получения заказа, по умолчанию 'как можно скорее'"
            rows={3}
          />

          {/* Privacy Consent - Checkbox */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                className="mt-1 w-5 h-5 accent-brand-900 cursor-pointer"
              />
              <span className="text-sm text-brand-700 leading-snug">
                Я согласен с обработкой персональных данных и условиями оказания услуг
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-600 text-sm font-semibold ml-8">{errors.consent}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 font-semibold">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1 py-4"
            >
              {isLoading ? 'Отправка...' : 'Подтвердить заказ'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
