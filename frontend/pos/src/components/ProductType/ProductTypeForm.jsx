import { useState } from "react";
import axios from "../../api";
import toast, { Toaster } from "react-hot-toast";

function ProductTypeForm({ defaultData, handleView, isEdit }) {
  const [formData, setFormData] = useState({
    ProductType: defaultData?.ProductType || "",
    Description: defaultData?.Description || "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isEdit) {
        const id = defaultData._id;
        await axios.put(`/producttype/${id}`, formData);
        toast.success("Item has been updated", {
          duration: 4000,
          position: "top-right",
        });
      } else {
        await axios.post("/producttype", formData);
        toast.success("Item has been added", {
          duration: 4000,
          position: "top-right",
        });
      }

      setFormData({
        ProductType: "",
        Description: "",
      });
      handleView();
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
            {isEdit ? "កែប្រែប្រភេទទំនិញ" : "បន្ថែមប្រភេទទំនិញថ្មី"}
          </legend>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">ឈ្មោះ​</label>
            <input
              type="text"
              className={inputClass}
              placeholder="សរសេរឈ្មោះ"
              required
              value={formData.ProductType}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  ProductType: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">ពិព៍ណនា</label>
            <textarea
              className={inputClass}
              placeholder="សរសេរពិព៍ណនា"
              rows={3}
              value={formData.Description}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  Description: e.target.value,
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
              {isEdit ? "កែប្រែ" : "រក្សាទុក"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default ProductTypeForm;
