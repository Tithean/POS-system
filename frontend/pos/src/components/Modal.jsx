import { FaReceipt } from "react-icons/fa";

function Modal({ cart, onCloseModal }) {
  const invoiceItems = cart || [];
  const totalAmount = invoiceItems.reduce(
    (total, item) => total + (item.total || Number(item.qty || 0) * Number(item.price || 0)),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <dialog id="my_modal_1" className="modal receipt-dialog">
      <div className="modal-box receipt-content max-w-2xl bg-white text-[#1e3a5f] rounded-3xl p-8 shadow-2xl border border-gray-200">
        {/* Top Header: Logo + INVOICE */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <img
              src="/POS_logo.png"
              alt="POS Logo"
              className="h-11 w-auto object-contain"
            />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-wider text-[#1e3a5f]">
              INVOICE
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-0.5">
              # {invoiceNumber}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 py-4 border-t border-gray-100 text-sm">
          {/* Left: Sender & Bill to */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-bold text-[#1e3a5f]">MASTER POS Store</p>
              <p className="text-xs text-gray-500 mt-0.5">Phnom Penh, Cambodia</p>
              <p className="text-xs text-gray-500">Tel: +855 12 345 678</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Bill to:
              </p>
              <p className="font-bold text-[#1e3a5f]">General Customer</p>
              <p className="text-xs text-gray-500 mt-0.5">Payment: Cash / Paid</p>
            </div>
          </div>

          {/* Right: Meta Details */}
          <div className="flex flex-col gap-1.5 text-right">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Date:</span>
              <span className="font-semibold text-[#1e3a5f]">{currentDate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Payment Terms:</span>
              <span className="font-semibold text-[#1e3a5f]">Immediate</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Status:</span>
              <span className="font-semibold text-emerald-600">Paid</span>
            </div>

            {/* Highlighted Balance Card */}
            <div className="bg-gray-100/90 rounded-xl px-4 py-2.5 mt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-gray-700">Total Paid:</span>
              <span className="font-black text-lg text-[#1e3a5f]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="py-3 px-4 text-left font-bold text-xs uppercase tracking-wider">
                  Item
                </th>
                <th className="py-3 px-4 text-center font-bold text-xs uppercase tracking-wider w-20">
                  Quantity
                </th>
                <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider w-24">
                  Rate
                </th>
                <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider w-28">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.length ? (
                invoiceItems.map((item, index) => {
                  const name = item.prod_name || item.ProductName || "Product";
                  const qty = Number(item.qty || 1);
                  const price = Number(item.price || item.Price || 0);
                  const lineTotal = Number(item.total || qty * price);

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#1e3a5f]">
                        {name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                        {qty}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-gray-600">
                        ${price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#1e3a5f]">
                        ${lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400 text-sm">
                    កន្ត្រកទំនិញទទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mt-4">
          <div className="w-64 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1e3a5f]">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (0%):</span>
              <span className="font-semibold text-[#1e3a5f]">$0.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-black text-[#1e3a5f]">
              <span>Total:</span>
              <span className="text-[#2563eb]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-[#1e3a5f]">សូមអរគុណចំពោះការគាំទ្រ!</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Thank you for your business!</p>
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-action receipt-actions flex gap-3 mt-6">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#1e3a5f] text-[#1e3a5f] font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaReceipt /> បោះពុម្ព (Print)
          </button>
          <form method="dialog" className="flex-1">
            <button
              onClick={onCloseModal}
              className="w-full py-2.5 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              បិទ (Close)
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
