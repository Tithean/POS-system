import MasterPage from "../pages/MasterPage";
import QueryContext from "../context/QueryContext";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "../api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

function Sale() {
  const { setLabel } = useContext(QueryContext);
  const [productType, setProductType] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectType, setSelectType] = useState("ALL");
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCart = (product) => {
    if (product.NumberInStock < 1) {
      toast.error("ទំនិញនេះអស់ពីស្តុក");
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.prod_id == product._id,
      );

      if (existingIndex !== -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            if (item.qty >= product.NumberInStock) return item;
            const nextQty = item.qty + 1;
            return {
              ...item,
              prod_name: product.ProductName,
              qty: nextQty,
              total: nextQty * parseFloat(product.Price),
            };
          }
          return item;
        });
      } else {
        return [
          ...prev,
          {
            prod_id: product._id,
            prod_name: product.ProductName,
            price: product.Price,
            stock: product.NumberInStock,
            qty: 1,
            total: parseFloat(product.Price),
          },
        ];
      }
    });
  };

  const handleClearCart = () => setCart([]);
  const getProductType = useCallback(async () => {
    try {
      const resultProductType = await axios.get("/producttype");
      setProductType(resultProductType.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const getProduct = useCallback(async () => {
    try {
      const resultProduct = await axios.get("/sale?type=" + selectType);
      setProduct(resultProduct.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [selectType]);

  useEffect(() => {
    setLabel("ការលក់");
    getProductType();
  }, [getProductType, setLabel]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const submitSale = async () => {
    try {
      if (cart.length === 0) {
        toast.error("សូមជ្រើសរើសទំនិញមុនពេលធ្វើការទិញ");
        return;
      }
      setIsSubmitting(true);
      const result = await axios.post(import.meta.env.VITE_API_URL + "/sale", {
        cart,
      });

      const status = result.data.status;
      if (status === "success") {
        setShowReceipt(true);
        getProduct();
        toast.success("ការទិញបានជោគជ័យ");
        document.getElementById("my_modal_1").showModal();
      } else {
        setShowReceipt(false);
        toast.error("មានបញ្ហាក្នុងការទិញ");
      }
    } catch (error) {
      setShowReceipt(false);
      toast.error(error?.response?.data?.message || "Error submitting sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQty = (pro_id, operation) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.prod_id !== pro_id) return item;
          const qty = Math.min(
            Number.isFinite(item.stock) ? item.stock : Number.MAX_SAFE_INTEGER,
            Math.max(0, item.qty + operation),
          );
          return { ...item, qty, total: qty * Number(item.price) };
        })
        .filter((item) => item.qty > 0),
    );
  };

  const onCloseModal = () => {
    setCart([]);
    setShowReceipt(false);
  };

  return (
    <MasterPage showButton={false}>
      <Modal cart={cart} onCloseModal={onCloseModal} />
      <div className="flex gap-4">
        {/* Left */}
        <div className="w-[70%]">
          {/* Product Type filter */}
          <div className="bg-white w-full rounded-xl border-2 border-[#1e3a5f] shadow-sm p-4">
            <p className="font-bold text-sm mb-3 text-[#1e3a5f]">ប្រភេទទំនិញ</p>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-[#1e3a5f] transition-colors ${
                  selectType === "ALL"
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-[#1e3a5f] hover:bg-blue-50"
                }`}
                onClick={() => setSelectType("ALL")}
              >
                ALL
              </button>
              {productType.map((item) => (
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-[#1e3a5f] transition-colors ${
                    selectType === item._id
                      ? "bg-[#1e3a5f] text-white"
                      : "bg-white text-[#1e3a5f] hover:bg-blue-50"
                  }`}
                  key={item._id}
                  onClick={() => setSelectType(item._id)}
                >
                  {item.ProductType}
                </button>
              ))}
            </div>
          </div>

          {/* Product Listing */}
          <div className="grid grid-cols-4 mt-4 bg-white w-full rounded-xl border-2 border-[#1e3a5f] shadow-sm p-4 gap-3">
            {product.length ? (
              product.map((item) => (
                <div
                  key={item._id}
                  className={`border-2 rounded-xl flex flex-col justify-center items-center p-3 transition-all ${
                    item.NumberInStock > 0
                      ? "border-[#1e3a5f]/20 hover:border-[#1e3a5f] hover:shadow-md hover:cursor-pointer"
                      : "opacity-40 cursor-not-allowed border-gray-200"
                  }`}
                  onClick={() => handleCart(item)}
                >
                  <img
                    className="w-24 h-24 object-cover rounded-lg"
                    src={`${import.meta.env.VITE_API_URL}/upload/${item.Picture}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${import.meta.env.VITE_API_URL}/upload/image.png`;
                    }}
                  />
                  <p className="text-center text-sm font-semibold text-[#1e3a5f] mt-2">{item.ProductName}</p>
                  <p className="text-xs text-[#1e3a5f]/70">ស្តុក: {item.NumberInStock}</p>
                  <p className="text-sm font-bold text-[#2563eb]">${item.Price}</p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10 text-[#1e3a5f]/60 font-medium">គ្មានទំនិញទេ</div>
            )}
          </div>
        </div>

        {/* Right – Cart */}
        <div className="bg-white rounded-xl border-2 border-[#1e3a5f] shadow-sm w-[30%] flex flex-col overflow-hidden">
          {/* Cart header */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#1e3a5f]">
            <p className="text-white font-semibold text-sm">ទំនិញកម្មង់</p>
            <button
              className="text-xs text-red-200 hover:text-white hover:cursor-pointer px-2 py-1 rounded transition-colors"
              onClick={handleClearCart}
            >
              ជម្រះ
            </button>
          </div>

          <table className="w-full flex-1 text-[#1e3a5f]">
            <thead>
              <tr className="bg-[#1e3a5f]/90 text-white">
                <th className="p-2 text-xs text-left font-medium">ឈ្មោះទំនិញ</th>
                <th className="p-2 text-xs font-medium text-center">បរិមាណ</th>
                <th className="p-2 text-xs text-right font-medium">តម្លៃសរុប</th>
              </tr>
            </thead>
            <tbody>
              {cart.length ? (
                cart.map((item) => (
                  <tr key={item.prod_id} className="border-b border-blue-50 text-[#1e3a5f]">
                    <td className="p-2 w-[35%]">
                      <p className="text-xs font-medium">{item.prod_name}</p>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="w-6 h-6 rounded border-2 border-[#1e3a5f] text-[#1e3a5f] bg-white hover:bg-blue-50 text-sm font-bold leading-none flex items-center justify-center"
                          type="button"
                          onClick={() => handleQty(item.prod_id, -1)}
                        >
                          -
                        </button>
                        <input
                          className="text-center w-8 text-sm font-bold bg-white text-[#1e3a5f] border border-[#1e3a5f]/30 rounded outline-none"
                          type="number"
                          value={item.qty}
                          readOnly
                          aria-label={`Quantity for ${item.prod_name}`}
                        />
                        <button
                          className="w-6 h-6 rounded border-2 border-[#1e3a5f] text-[#1e3a5f] bg-white hover:bg-blue-50 text-sm font-bold leading-none flex items-center justify-center"
                          type="button"
                          onClick={() => handleQty(item.prod_id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 w-[25%]">
                      <p className="text-right text-sm font-bold text-[#1e3a5f]">${item.total}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-[#1e3a5f]/60 text-sm">
                    សូមជ្រើសរើសមុខទំនិញ
                  </td>
                </tr>
              )}
              {/* Total row */}
              <tr className="border-t-2 border-[#1e3a5f] bg-blue-50/50">
                <td className="p-2"></td>
                <td className="p-2 text-center text-sm font-bold text-[#1e3a5f]">
                  សរុប
                </td>
                <td className="p-2 text-right text-sm font-bold text-[#2563eb]">
                  ${cartTotal}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-4">
            <button
              type="button"
              className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 bg-[#1e3a5f]"
              onClick={submitSale}
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? "កំពុងដំណើរការ..." : "✓ ធ្វើការទិញ"}
            </button>
          </div>
        </div>
      </div>
    </MasterPage>
  );
}

export default Sale;
