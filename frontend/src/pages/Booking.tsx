import { useState } from 'react'
import QRCode from 'qrcode.react'
import { TicketIcon, CreditCard } from 'lucide-react'

const Booking = () => {
  const [step, setStep] = useState<'select' | 'payment' | 'confirm'>('select')
  const [ticket, setTicket] = useState<any>(null)

  const bookTicket = () => {
    // Simulate booking
    setTicket({
      id: 'TKT-123456',
      journey: {
        from: 'Central Station',
        to: 'Airport T1',
        routes: ['1A'],
        totalFare: 50
      },
      qrCode: 'sample-qr-data',
      status: 'booked'
    })
    setStep('confirm')
  }

  if (step === 'confirm' && ticket) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Ticket Booked!
          </h1>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 text-center">
          <TicketIcon className="h-24 w-24 mx-auto mb-8 text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ticket #{ticket.id}</h2>
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl mb-8">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">From:</span> {ticket.journey.from}</div>
              <div><span className="font-semibold">To:</span> {ticket.journey.to}</div>
              <div><span className="font-semibold">Routes:</span> {ticket.journey.routes.join(', ')}</div>
              <div className="font-bold text-xl text-emerald-600">₹{ticket.journey.totalFare}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <QRCode value={ticket.qrCode} size={200} />
            <p className="text-sm text-gray-500 mt-2">Show this QR at boarding</p>
          </div>
          <button className="w-full bg-emerald-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all">
            Download Ticket
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Book Tickets
        </h1>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Select Journey</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <select className="p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                <option>Central Station → Airport</option>
              </select>
              <select className="p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100">
                <option>1 passenger</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-dashed border-purple-200">
              <CreditCard className="h-12 w-12 mx-auto text-purple-500 mb-4" />
              <p className="text-gray-600">Pay ₹50 securely with</p>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg" />
                <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg" />
                <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg" />
              </div>
            </div>
          </div>

          <button
            onClick={bookTicket}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <CreditCard className="h-6 w-6" />
            Pay ₹50 & Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default Booking

