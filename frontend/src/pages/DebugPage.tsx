import { useState } from 'react';
import api from '../config/api';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    try {
      // Test 1: Basic fetch to health endpoint
      console.log('Testing connection to:', apiUrl.replace('/api', ''));
      const healthUrl = apiUrl.replace('/api', '') + '/health';
      const healthResponse = await fetch(healthUrl);
      const healthData = await healthResponse.json();
      
      // Test 2: API endpoint
      const apiResponse = await api.get('/api/buses/search?from=test&to=test');
      
      setResult({
        success: true,
        apiUrl,
        healthCheck: healthData,
        apiTest: apiResponse.data,
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      setResult({
        success: false,
        apiUrl,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Debug</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="space-y-2">
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
        </div>
      </div>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {result && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {result.success ? '✅ Success' : '❌ Error'}
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
