'use client';

import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockOrders } from '@/lib/mockData';
import { useNotification } from '@/contexts/NotificationContext';

export default function OrderDetailPage() {
  const { toast } = useNotification();
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.id);
  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Button onClick={() => router.push('/dashboard/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    console.log(`Changing order ${orderId} status to:`, newStatus);
    toast.success(`Order status changed to: ${newStatus}`);
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.push('/dashboard/orders')}>
          ← Back to Orders
        </Button>
      </div>

      <div className="bg-white p-8 rounded-sm shadow-md border border-gray-200">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-600">
              {order.date} at {order.time}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Order Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Room Number</p>
                <p className="text-lg font-bold">Room {order.room}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Channel</p>
                <span
                  className={`inline-block mt-1 text-sm px-3 py-1 rounded ${
                    order.channel === 'voice'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.channel.charAt(0).toUpperCase() + order.channel.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">£{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Items</h2>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between p-3 bg-gray-50 rounded">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Special Requests */}
        {order.specialRequests && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Special Requests</h2>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-gray-700">{order.specialRequests}</p>
            </div>
          </div>
        )}

        {/* Upsell Information */}
        {order.upsell && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Upsell Applied</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-medium">✓ {order.upsell}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold mb-4">Update Order Status</h2>
          <div className="flex flex-wrap gap-3">
            {order.status === 'new' && (
              <Button onClick={() => handleStatusChange('in_progress')}>
                Mark In Progress
              </Button>
            )}
            {order.status === 'in_progress' && (
              <Button onClick={() => handleStatusChange('ready')}>Mark Ready</Button>
            )}
            {order.status === 'ready' && (
              <Button onClick={() => handleStatusChange('delivered')}>Mark Delivered</Button>
            )}
            {order.status === 'delivered' && (
              <p className="text-green-600 font-medium py-2">✓ Order completed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
