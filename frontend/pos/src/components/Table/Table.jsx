import { useState, useEffect, useContext } from "react";
import axios from "../../api";
import { TableFilter, TableFooter } from "./TableFilter";

function Table({ deleteHandler, editHandler, columns, rows, endPoint }) {
  const [data, setData] = useState([]);

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-[#1e3a5f] bg-white">
      {data && (
        <div>
          <TableFilter setData={setData} endPoint={endPoint} />
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr className="bg-[#1e3a5f]">
                <th className="text-white font-medium p-3">ល.រ</th>
                {columns.map((column, index) => (
                  <th key={index} className="text-white font-medium p-3">
                    {column}
                  </th>
                ))}
                <th className="text-white font-medium p-3">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors text-[#1e3a5f]">
                  <th className="p-3 text-sm text-[#1e3a5f]">{index + 1}</th>
                  {rows.map((row, index) => (
                    <td key={index} className="p-3 text-sm text-[#1e3a5f]">
                      {row == "Picture" && item[row] ? (
                        <img
                          className="w-14 h-14 rounded-2xl object-cover"
                          src={`${import.meta.env.VITE_API_URL}/upload/${item[row]}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${import.meta.env.VITE_API_URL}/upload/image.png`;
                          }}
                        />
                      ) : row == "ProductType" && item[row] ? (
                        item[row]["ProductType"] || item[row]
                      ) : (
                        item[row]
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <button
                      type="button"
                      className="text-sm font-medium px-3 py-1 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                      onClick={() => editHandler(item)}>
                      កែប្រែ
                    </button>
                    <span className="text-gray-300 mx-1">|</span>
                    <button
                      type="button"
                      className="text-sm font-medium px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      onClick={async () => {
                        setData((prev) =>
                          prev.filter((it) => it._id != item._id),
                        );
                        await deleteHandler(item._id);
                      }}>
                      លុប
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TableFooter setData={setData} />
        </div>
      )}
    </div>
  );
}

export default Table;
