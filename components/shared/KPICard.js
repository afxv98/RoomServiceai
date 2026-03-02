import * as Icons from 'lucide-react';
import Link from 'next/link';

// KPI Card component for displaying metrics
export default function KPICard({ title, value, icon, trend, trendDirection = 'up', href }) {
  const IconComponent = Icons[icon] || Icons.Activity;

  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-charcoal rounded flex items-center justify-center text-copper">
          <IconComponent className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-bold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
      <p className="text-3xl font-bold text-charcoal">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block bg-white p-6 rounded-sm shadow-md border border-gray-200 hover:shadow-lg hover:border-copper/40 transition-all duration-300 cursor-pointer"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {cardContent}
    </div>
  );
}
