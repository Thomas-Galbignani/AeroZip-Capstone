import { useState } from 'react';
import { API_BASE_URL } from '../../constants';
import { authService } from '../../services/authService';

interface CheckoutButtonProps {
  reservationId: string;
  amount: number;
  userEmail: string;
}

const StripeCheckoutButton: React.FC<CheckoutButtonProps> = ({
  reservationId,
  amount,
  userEmail,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Preparazione Stripe
      const response = await fetch(
        `${API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
          },
          body: JSON.stringify({
            reservationId: reservationId,
            amount: amount,
            customerEmail: userEmail,
            successUrl: `${window.location.origin}/payment-success?reservationId=${reservationId}`,
            cancelUrl: `${window.location.origin}/payment-cancel`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Errore nella creazione della sessione');
      }

      const data = await response.json();

      // Redirect alla pagina di checkout Stripe
      window.location.href = data.url;
    } catch (err) {
      console.error('Errore:', err);
      alert('Errore nel processo di pagamento');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        padding: '12px 24px',
        backgroundColor: loading ? '#9fa6ff' : '#635BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        transition: 'all 0.2s',
      }}
    >
      {loading ? 'Caricamento...' : 'Procedi al pagamento'}
    </button>
  );
};

export default StripeCheckoutButton;
