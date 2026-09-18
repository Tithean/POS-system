import { useEffect, useState, useContext } from "react";
import QueryContext from "../context/QueryContext";

import MasterPage from "../pages/MasterPage";
import axios from "../api";
import Table from "../components/Table/Table";
import ProductTypeForm from "../components/ProductType/ProductTypeForm";
import toast, { Toaster } from "react-hot-toast";

function ProductTypePage() {
  const {
    setEndpoint,
    setColumns,
    setRows,
    setLabel,
    handleView,
    showTable,
    setIsEdit,
    isEdit,
  } = useContext(QueryContext);
  // To show Table or Form

  // To set data to Form when Edit
  const [data, setData] = useState({});
  // To know when form is edit or add new
  // const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setLabel("ប្រភេទទំនិញ");
  }, []);

  const columns = ["ឈ្មោះប្រភេទទំនិញ", "ពិព៍ណនា"];
  const rows = ["ProductType", "Description"];
  const endPoint = "producttype";

  async function handleDelete(id) {
    try {
      const result = await axios.delete(`/producttype/${id}`);
      toast.success(result.data.message, {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        duration: 4000,
        position: "top-right",
      });
    }
  }

  async function handleEdit(item) {
    // 1. Change view from table to form
    handleView();
    // 2. set data to form product type
    setData(item);
    // 3. set isEdit to true for change submit for PUT
    setIsEdit(true);
  }

  return (
    <MasterPage>
      <Toaster />
      {showTable ? (
        <Table
          deleteHandler={handleDelete}
          editHandler={handleEdit}
          columns={columns}
          rows={rows}
          endPoint={endPoint}
        />
      ) : (
        <ProductTypeForm
          defaultData={data}
          handleView={handleView}
          isEdit={isEdit}
        />
      )}
    </MasterPage>
  );
}

export default ProductTypePage;
