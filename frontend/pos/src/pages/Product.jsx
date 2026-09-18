import MasterPage from "../pages/MasterPage";
import { useState, useEffect, useContext } from "react";
import QueryContext from "../context/QueryContext";
import toast, { Toaster } from "react-hot-toast";

import Table from "../components/Table/Table";
import ProductForm from "../components/Product/ProductForm";

import axios from "../api";

function Product() {
  const {
    setEndpoint,
    setColumns,
    setRows,
    showTable,
    setLabel,
    handleView,
    setIsEdit,
  } = useContext(QueryContext);
  //   const [showTable, setShowTable] = useState(true);
  setLabel("ទំនិញ");

  async function handleDelete(id) {}

  const deleteHandler = async (id) => {
    const result = await axios.delete(
      import.meta.env.VITE_API_URL + "/product/" + id,
    );
    toast.success(result.data.message, {
      duration: 4000,
      position: "top-right",
    });
  };
  const [defaultData, setDefaultData] = useState({});
  const editHandler = (item) => {
    handleView();
    setIsEdit(true);
    setDefaultData(item);
  };

  const columns = [
    "រូបភាព",
    "ឈ្មោះទំនិញ",
    "ប្រភេទទំនិញ",
    "តម្លៃលក់",
    "តម្លៃទិញចូល",
    "ចំនួនក្នុងស្តុក",
    "ចំណាំ",
  ];
  const rows = [
    "Picture",
    "ProductName",
    "ProductType",
    "Price",
    "Cost",
    "NumberInStock",
    "Note",
  ];
  const endPoint = "product";

  return (
    <MasterPage>
      <Toaster />

      {showTable ? (
        <Table
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          columns={columns}
          rows={rows}
          endPoint={endPoint}
        />
      ) : (
        <ProductForm endPoint={endPoint} defaultData={defaultData} />
      )}
    </MasterPage>
  );
}

export default Product;
