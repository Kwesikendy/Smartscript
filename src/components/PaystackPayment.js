import React from 'react';
import api from '../api/axios';

const PaystackPayment = ({ 
  amount, 
  credits,
  onSuccess, 
  onClose, 
  metadata = {},
  children 
}) => {
  const handlePayment = async () => {
    try {
      if (!window.PaystackPop) {
        alert('Paystack could not be loaded. Please check your internet connection and try again.');
        return;
      }

      // Initialize payment on backend first
      const initResponse = await api.post('/account/initialize-payment', {
        amount: amount * 100, // Convert to pesewas (smallest currency unit)
        credits: credits,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: "Credit Purchase",
              variable_name: "credit_purchase",
              value: "SmartScript Credits"
            }
          ]
        }
      });

      const { access_code, reference } = initResponse.data.data;

      // Use Paystack Popup with access_code from backend
      const popup = new window.PaystackPop();
      popup.resumeTransaction(access_code, {
        onSuccess: (response) => {
          onSuccess({
            ...response,
            reference: reference, // Use reference from backend
            metadata: {
              credits: credits,
              ...metadata
            }
          });
        },
        onClose: () => {
          onClose();
        }
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  return (
    <div onClick={handlePayment} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default PaystackPayment;
