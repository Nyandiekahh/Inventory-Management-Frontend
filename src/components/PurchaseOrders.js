import React, { useState } from 'react';
import { Plus, Eye, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const PurchaseOrders = ({ requireAdminAuth }) => {
  const { purchaseOrders, updatePurchaseOrder } = useStore();
  const [showAddPO, setShowAddPO] = useState(false);

  const handleReceivePO = (poId) => {
    requireAdminAuth(() => {
      updatePurchaseOrder(poId, { status: 'Received' });
    });
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Received': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600">Manage incoming inventory orders</p>
        </div>
        <button
          onClick={() => requireAdminAuth(() => setShowAddPO(true))}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Purchase Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">#{po.id}</td>
                <td className="px-6 py-4 text-sm">{po.date}</td>
                <td className="px-6 py-4 text-sm">{po.supplier}</td>
                <td className="px-6 py-4 text-sm">{po.items.length} items</td>
                <td className="px-6 py-4 text-sm font-medium">KSh {po.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[po.status]}`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    {po.status === 'Pending' && (
                      <button 
                        onClick={() => handleReceivePO(po.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;