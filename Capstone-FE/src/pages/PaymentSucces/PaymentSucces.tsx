import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import { authService } from '../../services/authService';
import { reservationService } from '../../services/reservationService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const reservationId = searchParams.get('reservationId');

  useEffect(() => {
    const completeCheckout = async (): Promise<void> => {
      if (!reservationId) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/reservations/${reservationId}/checkout`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          setProcessing(false);
          reservationService.removePendingReservation();
          reservationService.removeReservation();
        } else {
          throw new Error('Errore nella finalizzazione');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError(true);
        setProcessing(false);
      }
    };

    completeCheckout();
  }, [reservationId, navigate]);

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '64px', color: '#f44336' }}>✗</div>
        <h1>Errore</h1>
        <p>
          Si è verificato un errore nella finalizzazione della prenotazione.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Il pagamento potrebbe essere andato a buon fine, ma c'è stato un
          problema con l'invio della conferma. Controlla la tua email o contatta
          il supporto.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          Torna alla home
        </button>
      </div>
    );
  }

  if (processing) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h2>Finalizzazione pagamento...</h2>
        <p style={{ color: '#666' }}>
          Attendere prego, stiamo completando la tua prenotazione.
        </p>
        <div
          style={{
            margin: '30px auto',
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #635BFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Non chiudere questa pagina...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: '80px',
          color: '#4CAF50',
          marginBottom: '20px',
        }}
      >
        ✓
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        Pagamento completato!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        La tua prenotazione è stata confermata con successo.
        <br />
        Grazie per aver utilizzato AeroZip.
      </p>

      <div
        style={{
          backgroundColor: '#f0f8ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <p style={{ margin: '10px 0', fontSize: '16px' }}>
          Riceverai una email con i biglietti a breve
        </p>
        <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
          Controlla anche la cartella spam se non vedi l'email
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button onClick={() => navigate('/')} className="aero-zip-button">
          Torna alla home
        </button>
      </div>

      <p
        style={{
          marginTop: '40px',
          fontSize: '14px',
          color: '#999',
        }}
      >
        ID Prenotazione: {reservationId}
      </p>
    </div>
  );
};

export default PaymentSuccess;
