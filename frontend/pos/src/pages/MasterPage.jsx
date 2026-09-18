import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import QueryContext from "../context/QueryContext";
import { useContext } from "react";

function MasterPage({ children, showLabel = true, showButton = true }) {
  const { showTable, Label, handleView } = useContext(QueryContext);
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <NavBar />
      <div className="flex flex-1">
        <Menu />
        {/* Content */}
        <div className="flex-1 px-6 py-5">
          {(showLabel || showButton) && (
            <div className="flex justify-between items-center mb-5">
              {showLabel && (
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  {Label}
                </h1>
              )}
              {showButton && (
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity bg-[#1e3a5f]"
                  type="button"
                  onClick={handleView}
                >
                  {showTable ? "+ បន្ថែមថ្មី" : "បង្ហាញតារាង"}
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default MasterPage;
