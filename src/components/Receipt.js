import React from 'react';
import { Printer, Download } from 'lucide-react';

const Receipt = ({ sale, store, onClose, onPrint }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  const handleDownload = () => {
    // Convert receipt to downloadable format
    const receiptContent = generateReceiptText();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${sale.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReceiptText = () => {
    return `
=====================================
         ${store?.name || 'STORE NAME'}
=====================================
${store?.location || 'Store Location'}
Tel: +254 XXX XXX XXX
Email: info@${store?.name?.toLowerCase().replace(/\s+/g, '') || 'store'}.com

-------------------------------------
RECEIPT #${sale.id}
Date: ${formatDate(sale.date)}
Time: ${sale.time}
Cashier: ${sale.cashier}
-------------------------------------

ITEMS:
${sale.items.map(item => 
  `${item.name.padEnd(20)} ${item.quantity}x${item.price} = ${(item.quantity * item.price).toFixed(2)}`
).join('\n')}

-------------------------------------
TOTAL:                   KSh ${sale.total.toFixed(2)}
-------------------------------------

Thank you for shopping with us!
Visit us again soon.

=====================================
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Header */}
        <div className="p-6 border-b no-print">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Receipt Generated</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="p-6 print:p-8" id="receipt-content">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{store?.name || 'INVENTORY PRO'}</h1>
            <p className="text-sm text-gray-600">{store?.location || 'Nairobi, Kenya'}</p>
            <p className="text-sm text-gray-600">Tel: +254 XXX XXX XXX</p>
            <p className="text-sm text-gray-600">Email: info@inventorypro.com</p>
          </div>

          <div className="border-t border-b border-gray-300 py-4 mb-4">
            <div className="text-center">
              <h2 className="font-bold text-lg">RECEIPT #{sale.id}</h2>
              <p className="text-sm">{formatDate(sale.date)}</p>
              <p className="text-sm">Cashier: {sale.cashier}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">ITEMS PURCHASED:</h3>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-600">
                      {item.quantity} × KSh {item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">
                    KSh {(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-300 pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>TOTAL:</span>
              <span>KSh {sale.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for shopping with us!</p>
            <p>Visit us again soon.</p>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs">Powered by InventoryPro</p>
              <p className="text-xs">www.inventorypro.com</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-gray-50 no-print">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-3 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print\\:p-8 {
            padding: 2rem !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;