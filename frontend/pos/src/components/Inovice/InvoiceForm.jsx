import { useContext, useState } from "react";
import axios from "../../api";
import toast, { Toaster } from "react-hot-toast";
import QueryContext from "../../context/QueryContext";

function InvoiceForm() {
  const [formData, setFormData] = useState({
    InvID: "",
    UserName: "",
    DateOfSale: "",
  });
  const { endpoint, handleView } = useContext(QueryContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const result = await axios.post(cleanEndpoint, formData);
      toast.success(result.data.message || "Created successfully");
      if (handleView) handleView();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error submitting form");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border-2 border-[#1e3a5f] bg-white text-[#1e3a5f] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]";

  return (
    <div className="flex justify-center mt-4">
      <Toaster />
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <fieldset className="bg-white border-2 border-[#1e3a5f] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <legend className="px-3 text-lg font-bold text-[#1e3a5f]">
            បន្ថែមវិក្កយបត្រថ្មី
          </legend>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">លេខវិក័យប័ត្រ</label>
            <input
              type="text"
              className={inputClass}
              placeholder="សរសេរលេខវិក័យប័ត្រ"
              value={formData.InvID}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  InvID: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">អ្នកលក់</label>
            <input
              type="text"
              className={inputClass}
              value={formData.UserName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  UserName: e.target.value,
                }));
              }}
              placeholder="សរសេរឈ្មោះអ្នកលក់"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">កាលបរិច្ឆេទ</label>
            <input
              type="date"
              className={inputClass}
              value={formData.DateOfSale}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  DateOfSale: e.target.value,
                }));
              }}
            />
          </div>

          <div className="flex justify-end items-center gap-3 mt-3">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border-2 border-[#1e3a5f] text-[#1e3a5f] bg-white hover:bg-gray-100 font-medium text-sm transition-colors"
              onClick={handleView}>
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#1e3a5f] text-white hover:opacity-90 font-medium text-sm transition-opacity">
              រក្សាទុក
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default InvoiceForm;
