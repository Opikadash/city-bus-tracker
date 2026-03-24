import { useEffect, useState } from 'react';
import { BarChart3, Clock, TrendingUp, Route } from 'lucide-react';
import axios from 'axios';

interface AnalyticsData {
  data: Array<{
    route: string;
    trips: number;
    avgDelay: number;
  }>;
  peakHour: string;
  totalEvents: number;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/analytics/busiest-routes')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-xl font-medium text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📊
          </h1>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Analytics Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time insights from S3 data pipeline & Airflow ETL
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Busiest Routes</h2>
            </div>
            <div className="space-y-4">
              {data?.data.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <div>
                    <div className="font-semibold text-gray-900">{item.route}</div>
                    <div className="text-sm text-gray-500">{item.trips} trips</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-blue-600">{item.avgDelay.toFixed(1)}min delay</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex items-center mb-6">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Peak Hours</h2>
            </div>
            <div className="text-4xl font-bold text-orange-600 text-center mb-4">{data?.peakHour}</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{data?.totalEvents.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total events processed</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full font-semibold">
            <Route className="h-5 w-5" />
            <span>Powered by AWS S3 + Airflow ETL Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

