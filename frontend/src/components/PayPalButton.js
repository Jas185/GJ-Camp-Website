import React, { useEffect, useRef, useState } from 'react';

const PayPalButton = ({ amount, onSuccess, onError, onCancel }) => {
  const paypalRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  const buttonRendered = useRef(false);

  // Charger le SDK PayPal une seule fois
  useEffect(() => {
    const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      setError('Client ID PayPal non configuré');
      return;
    }

    // Si le SDK est déjà chargé
    if (window.paypal) {
      console.log('✅ SDK PayPal déjà disponible');
      setSdkReady(true);
      return;
    }

    // Charger le SDK
    console.log('📥 Chargement du SDK PayPal...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ SDK PayPal chargé');
      setSdkReady(true);
    };
    
    script.onerror = () => {
      console.error('❌ Erreur de chargement du SDK PayPal');
      setError('Erreur de chargement PayPal');
    };
    
    document.body.appendChild(script);
  }, []);

  // Rendre les boutons PayPal quand le SDK est prêt
  useEffect(() => {
    if (!sdkReady || !paypalRef.current || buttonRendered.current) {
      return;
    }

    console.log('🎨 Rendu des boutons PayPal pour', amount, '€');

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: amount.toFixed(2)
            },
            description: `Inscription Camp GJ 2025 - ${amount}€`
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture();
          console.log('✅ Paiement réussi:', details);
          if (onSuccess) onSuccess(details);
        } catch (err) {
          console.error('❌ Erreur capture:', err);
          if (onError) onError(err);
        }
      },
      onError: (err) => {
        console.error('❌ Erreur PayPal:', err);
        if (onError) onError(err);
      },
      onCancel: (data) => {
        console.log('⚠️ Paiement annulé');
        if (onCancel) onCancel(data);
      }
    }).render(paypalRef.current)
      .then(() => {
        console.log('✅ Boutons rendus');
        buttonRendered.current = true;
      })
      .catch(err => {
        console.error('❌ Erreur rendu:', err);
        setError('Erreur lors du rendu des boutons');
      });
  }, [sdkReady, amount, onSuccess, onError, onCancel]);

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        background: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        color: '#c00',
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  if (!sdkReady) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#667eea'
      }}>
        ⏳ Chargement de PayPal...
      </div>
    );
  }

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
