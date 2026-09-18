import { useState, useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import QueryContext from "../../context/QueryContext";
import axios from "../../api";

function ProductForm({ endPoint, defaultData }) {
  const { handleView, isEdit } = useContext(QueryContext);
  defaultData = isEdit && defaultData ? defaultData : {};

  const [formdata, setformdata] = useState({
    ProductName: defaultData.ProductName || "",
    Picture: "",
    Price: defaultData.Price || "",
    Cost: defaultData.Cost || "",
    Note: defaultData.Note || "",
    ProductType: defaultData.ProductType?._id || defaultData.ProductType || "",
    NumberInStock: defaultData.NumberInStock || "",
  });

  const [productType, setProductType] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductType = async () => {
    try {
      const pro_result = await axios.get("/producttype");
      setProductType(pro_result.data.data || []);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  };

  useEffect(() => {
    fetchProductType();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.ProductName.trim()) {
      toast.error("សូមបញ្ចូលឈ្មោះទំនិញ");
      return;
    }
    if (!formdata.ProductType) {
      toast.error("សូមជ្រើសរើសប្រភេទទំនិញ");
      return;
    }
    if (formdata.Price === "") {
      toast.error("សូមបញ្ចូលតម្លៃលក់");
      return;
    }
    if (formdata.Cost === "") {
      toast.error("សូមបញ្ចូលតម្លៃទិញចូល");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append("ProductName", formdata.ProductName.trim());
    if (formdata.Picture instanceof File) {
      submitData.append("Picture", formdata.Picture);
    }
    submitData.append("Price", formdata.Price);
    submitData.append("Cost", formdata.Cost);
    submitData.append("Note", formdata.Note || "");
    submitData.append("ProductType", formdata.ProductType);
    submitData.append("NumberInStock", formdata.NumberInStock || 0);

    const cleanEndpoint = endPoint.startsWith("/") ? endPoint : `/${endPoint}`;

    try {
      let result;
      if (isEdit && defaultData._id) {
        const id = defaultData._id;
        result = await axios.put(`${cleanEndpoint}/${id}`, submitData);
      } else {
        result = await axios.post(cleanEndpoint, submitData);
      }

      toast.success(result.data.message || "ទំនិញត្រូវបានរក្សាទុកដោយជោគជ័យ!", {
        duration: 4000,
        position: "top-right",
      });

      setformdata({
        ProductName: "",
        Picture: "",
        Price: "",
        Cost: "",
        Note: "",
        ProductType: "",
        NumberInStock: "",
      });
      setTimeout(() => {
        handleView();
      }, 500);
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "មានបញ្ហាក្នុងការរក្សាទុកទំនិញ";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border-2 border-[#1e3a5f] bg-white text-[#1e3a5f] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]";

  return (
    <div className="flex justify-center mt-4">
      <Toaster />
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <fieldset className="bg-white border-2 border-[#1e3a5f] rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <legend className="px-3 text-lg font-bold text-[#1e3a5f]">
            {isEdit ? "កែប្រែទំនិញ" : "បន្ថែមទំនិញថ្មី"}
          </legend>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">
              ឈ្មោះ​ទំនិញ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="សរសេរឈ្មោះទំនិញ"
              required
              value={formdata.ProductName}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  ProductName: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">
              ប្រភេទទំនិញ <span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              required
              value={formdata.ProductType}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  ProductType: e.target.value,
                }));
              }}>
              <option value="">ជ្រើសរើសប្រភេទទំនិញ</option>
              {productType &&
                productType.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.ProductType}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">
              តម្លៃលក់ (ដុល្លារ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              className={inputClass}
              placeholder="សរសេរតម្លៃលក់"
              required
              value={formdata.Price}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  Price: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">
              តម្លៃទិញចូល (ដុល្លារ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              className={inputClass}
              placeholder="សរសេរតម្លៃទិញចូល"
              required
              value={formdata.Cost}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  Cost: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">ចំនួនក្នុងស្តុក</label>
            <input
              type="number"
              className={inputClass}
              placeholder="សរសេរចំនួនក្នុងស្តុក"
              value={formdata.NumberInStock}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  NumberInStock: e.target.value,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">រូបភាព</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="w-full px-3 py-2 rounded-lg border-2 border-[#1e3a5f] bg-white text-[#1e3a5f] text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1e3a5f] file:text-white hover:file:opacity-90 cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setformdata((prev) => ({
                    ...prev,
                    Picture: e.target.files[0],
                  }));
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">ចំណាំ</label>
            <textarea
              className={inputClass}
              placeholder="សរសេរចំណាំ"
              rows={3}
              value={formdata.Note}
              onChange={(e) => {
                setformdata((prev) => ({
                  ...prev,
                  Note: e.target.value,
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
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#1e3a5f] text-white hover:opacity-90 font-medium text-sm transition-opacity disabled:opacity-50">
              {loading ? "កំពុងដំណើរការ..." : isEdit ? "កែប្រែ" : "រក្សាទុក"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default ProductForm;
