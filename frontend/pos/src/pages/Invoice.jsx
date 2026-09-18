import MasterPage from "./MasterPage";
import { useEffect, useContext, useState } from "react";
import QueryContext from "../context/QueryContext";
import axios from "../api";
import InvoiceModal from "../components/InvoiceModal";

function Invoice() {
  const { setLabel } = useContext(QueryContext);
  const [data, setData] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);

  const getInvoice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL +
          `/api/invoice?startDate=${startDate}&endDate=${endDate}`,
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  const showInvoiceDetails = async (item) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/api/invoice/${item._id}`,
      );
      setInvoiceNumber(item.InvoiceNumber);
      setInvoiceData(response.data.data);
      setInvoiceDate(item.createdAt);
      document.getElementById("my_modal_1").showModal();
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  useEffect(() => {
    setLabel("របាយការណ៍");
    getInvoice();
  }, [startDate, endDate]);

  return (
    <MasterPage showButton={false}>
      <InvoiceModal
        data={invoiceData}
        InvoceNumber={invoiceNumber}
        InvoiceDate={invoiceDate}
      />
      {/* filter report */}
      <div className="flex gap-6 items-center bg-white p-5 rounded-xl border-2 border-[#1e3a5f] shadow-sm mb-4">
        <div>
          <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">ថ្ងៃចាប់ផ្តើម</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border-2 border-[#1e3a5f] bg-white text-[#1e3a5f] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">ថ្ងៃបញ្ចប់</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border-2 border-[#1e3a5f] bg-white text-[#1e3a5f] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      {/* table */}
      <div className="bg-white rounded-xl border-2 border-[#1e3a5f] shadow-sm overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="bg-[#1e3a5f]">
              <th className="p-3 text-white text-sm font-medium text-left">ល.រ</th>
              <th className="p-3 text-white text-sm font-medium text-left">លេខវិក្កយបត្រ</th>
              <th className="p-3 text-white text-sm font-medium text-left">លក់ដោយ</th>
              <th className="p-3 text-white text-sm font-medium text-left">តម្លៃសរុប</th>
              <th className="p-3 text-white text-sm font-medium text-left">កាលបរិច្ឆេទ</th>
              <th className="p-3 text-white text-sm font-medium text-left">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length ? (
              data.map((item, index) => (
                <tr key={item._id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors text-[#1e3a5f]">
                  <td className="p-3 text-sm text-[#1e3a5f]">{index + 1}</td>
                  <td className="p-3 text-sm font-medium text-[#1e3a5f]">{item.InvoiceNumber}</td>
                  <td className="p-3 text-sm text-[#1e3a5f]">{"User"}</td>
                  <td className="p-3 text-sm font-bold text-[#2563eb]">
                    $ {item.TotalAmount || 0}
                  </td>
                  <td className="p-3 text-sm text-[#1e3a5f]/80">{item.createdAt}</td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-medium hover:opacity-90 transition-opacity bg-[#1e3a5f]"
                      onClick={() => showInvoiceDetails(item)}
                    >
                      មើលលំអិត
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-[#1e3a5f]/60">
                  គ្មានទិន្នន័យ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MasterPage>
  );
}

export default Invoice;
