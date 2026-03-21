import { useState, useEffect } from 'react'
import axios from 'axios'
import { BusStop, JourneyPlan } from 'shared/types'
import { Search, MapPin, Clock } from 'lucide-react'

const Planner = () => {
  const [stops, setStops] = useState<BusStop[]>( [])
  const [fromStop, setFromStop] = useState('')
  const [toStop, setToStop] = useState('')
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStops = async (): Promise<void> => {
      try {
        const res = await axios.get<BusStop[]>('/api/planner/stops')
        setStops(res.data)
      } catch (err: unknown) {
        console.error('Failed to fetch stops:', err)
      }
    }
    fetchStops()
  }, [])

  const planJourney = async (): Promise<void> => {
    if (!fromStop || !toStop) return
    setLoading(true)
    try {
      const res = await axios.post<{ success: boolean; plan: JourneyPlan }>('/api/planner/plan-journey', { fromStop, toStop })
      setPlan(res.data.plan)
    } catch (err: unknown) {
      console.error('Failed to plan journey:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Plan Your Journey
        </h1>
        <p className="text-xl text-gray-600">Find the fastest route across the city bus network</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              From
            </label>
            <select 
              value={fromStop} 
              onChange={(e) => setFromStop(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all"
            >
              <option value="">Select starting point</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>{stop.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              To
            </label>
            <select 
              value={toStop} 
              onChange={(e) => setToStop(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all"
            >
              <option value="">Select destination</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>{stop.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={planJourney}
          disabled={!fromStop || !toStop || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-6 w-6" />
          {loading ? 'Planning...' : 'Plan Journey'}
          <Clock className="h-6 w-6" />
        </button>
      </div>

      {plan && (
        <div className="mt-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Journey Plan</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <div className="font-semibold text-lg">{plan.totalDuration?.toFixed(0)} min</div>
                <div className="text-sm text-gray-600">Total time</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <div className="font-semibold text-lg">₹{plan.totalFare}</div>
                <div className="text-sm text-gray-600">Total fare</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white">
              <div className="font-semibold">Route: {plan.path?.map((id) => stops.find((s) => s.id === id)?.name || 'Unknown').join(' → ')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planner

