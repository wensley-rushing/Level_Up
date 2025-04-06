
import LoadingSpinner from './LoadingSpinner';

const MetricCard = ({ title, value, growth, loading, icon, variant = 'default' }) => {
  const variants = {
    default: 'from-blue-50 to-indigo-50 border-blue-100',
    success: 'from-green-50 to-emerald-50 border-green-100',
    warning: 'from-orange-50 to-amber-50 border-orange-100',
    danger: 'from-red-50 to-rose-50 border-red-100',
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${variants[variant]} p-4 rounded-xl border animate-pulse`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${variants[variant]} p-4 rounded-xl border transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="text-gray-600">{title}</div>
        {icon}
      </div>
      <div className="flex items-baseline mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {growth && (
          <div className={`ml-2 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? '+' : ''}{growth}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;


