import React from 'react';

const PaystackPayment = ({ 
  email, 
  amount, 
  onSuccess, 
  onClose, 
  reference, 
  metadata = {},
  currency = 'GHS',
  children 
}) => {
  const handlePayment = () => {
    if (!window.PaystackPop) {
      alert('Paystack could not be loaded. Please check your internet connection and try again.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here', // Replace with your Paystack public key
      email,
      amount: amount * 100, // Paystack expects amount in pesewas (smallest currency unit)
      currency,
      ref: reference,
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Credit Purchase",
            variable_name: "credit_purchase",
            value: "SmartScript Credits"
          }
        ]
      },
      callback: (response) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose();
      }
    });

    handler.openIframe();
  };

  return (
    <div onClick={handlePayment} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default PaystackPayment;
