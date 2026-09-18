import { RiPlayLargeFill, RiPlayReverseLargeFill } from "react-icons/ri";
import axios from "../../api";
import { useEffect, useState, useContext } from "react";
import QueryContext from "../../context/QueryContext";
import useQuery from "../../hooks/useQuery";

function TableFilter({ setData, endPoint }) {
  const { query, setQuery } = useContext(QueryContext);
  const cleanEndpoint = endPoint.startsWith("/") ? endPoint : `/${endPoint}`;
  const url = `${cleanEndpoint}?search=${query.search}&limit=${query.limit}&page=${query.page}`;
  const { result, loading } = useQuery(url);

  function changeValue(name, value) {
    setQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (!loading) {
      setData(result.data);
      setQuery((prev) => ({
        ...prev,
        total_record: result.total_record,
        total_page: result.total_page,
      }));
    }
  }, [loading]);

  return (
    <div className="flex justify-between items-center p-3">
      {/* Rows per page select */}
      <select
        className="px-3 py-2 rounded-lg border-2 border-[#1e3a5f] text-sm font-medium focus:outline-none bg-white text-[#1e3a5f]"
        value={query.limit}
        onChange={(e) => changeValue("limit", e.target.value)}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="ALL">All</option>
      </select>

      {/* Search input */}
      <div className="flex items-center gap-2 border-2 border-[#1e3a5f] rounded-lg px-3 py-2 bg-white">
        <svg
          className="h-4 w-4 text-[#1e3a5f]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          className="outline-none bg-transparent text-sm text-[#1e3a5f] placeholder:text-[#1e3a5f]/50"
          placeholder="Search"
          value={query.search}
          onChange={(e) => changeValue("search", e.target.value)}
        />
      </div>
    </div>
  );
}

function TableFooter({ setData }) {
  const { query, setQuery } = useContext(QueryContext);
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <p className="text-sm font-medium text-[#1e3a5f]">
        ទំព័រ {query.page}/{query.total_page}
      </p>
      <div className="flex gap-1">
        <button
          className="px-3 py-1.5 rounded-lg border border-[#1e3a5f] text-[#1e3a5f] bg-white text-sm font-medium transition-colors disabled:opacity-40"
          onClick={() => {
            setQuery((prev) => ({
              ...prev,
              page: query.page - 1,
            }));
          }}
          disabled={query.page == 1}>
          <RiPlayReverseLargeFill />
        </button>
        <button
          className="px-3 py-1.5 rounded-lg border border-[#1e3a5f] text-[#1e3a5f] bg-white text-sm font-medium"
          disabled>
          ទំព័រ {query.page}
        </button>
        <button
          className="px-3 py-1.5 rounded-lg border border-[#1e3a5f] text-[#1e3a5f] bg-white text-sm font-medium transition-colors disabled:opacity-40"
          onClick={() => {
            setQuery((prev) => ({
              ...prev,
              page: query.page + 1,
            }));
          }}
          disabled={query.total_page == query.page}>
          <RiPlayLargeFill />
        </button>
      </div>
    </div>
  );
}

export { TableFilter, TableFooter };
