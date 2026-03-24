import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import QRCode from 'qrcode.react';
import { TicketIcon, CreditCard, Loader2 } from 'lucide-react';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface TicketStub {
  ticketId: string;
  qrCode: string;
  totalFare: number;
  clientSecret: string;
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<TicketStub | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError('');

    // Sample journey - replace with form data
    const { data } = await axios.post('/api/booking/book', {
      userId: 'demo-user',
      journey: {
        fromStop: 'stop001',
        toStop: 'stop002',
        route: '1A'
      },
      totalFare: 50
    });

    setTicket(data);

    // Confirm payment
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Fallback
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
    } else {
      // Success - ticket confirmed
      alert('Payment successful! Ticket ready.');
    }

    setIsLoading(false);
  };

  if (ticket && !error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 text-center">
          <TicketIcon className="h-24 w-24 mx-auto mb-8 text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ticket #{ticket.ticketId}</h2>
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl mb-8">
            <div className="text-lg">₹{ticket.totalFare} paid</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <QRCode value={ticket.qrCode} size={200} />
            <p className="text-sm text-gray-500 mt-2">Show this QR at boarding</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Secure Payment
        </h1>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Journey</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 border border-gray-200 rounded-xl">Central Station → Airport</div>
              <div className="p-4 border border-gray-200 rounded-xl">1 passenger • ₹50</div>
            </div>
          </div>
          
          <PaymentElement />
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            disabled={!stripe || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-6 w-6" />
                <span>Pay ₹50 Securely</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {stripePromise && (
        <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Booking;

