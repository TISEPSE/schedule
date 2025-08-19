import { Cloud, Thermometer } from 'lucide-react';

export default function WeatherWidget() {
  // Mock weather data
  const weather = {
    temperature: 18,
    condition: 'nuageux',
    icon: Cloud,
    advice: 'Pensez à prendre un gilet !',
  };

  const Icon = weather.icon;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-900">Météo</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-xl font-bold text-gray-900">{weather.temperature}°C</span>
        </div>
        <span className="text-base text-gray-600 capitalize">{weather.condition}</span>
      </div>
      
      <p className="text-sm text-gray-500 mt-2">{weather.advice}</p>
    </div>
  );
}