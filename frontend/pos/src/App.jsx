import { useEffect, useState } from "react";
import axios from "./api";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";

import QueryContext from "./context/QueryContext";
import NavigationAuth from "./components/NavigationAuth";

function App() {
  const [Auth, setAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/check");
      if (response.data.authenticated) {
        setAuth(true);
        setCurrentUser(response.data.user || null);
      } else {
        setAuth(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuth(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
    } catch (err) {
      console.error(err);
    }
    setAuth(false);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setAuth(true);
    setCurrentUser(user || null);
    checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const [query, setQuery] = useState({
    search: "",
    limit: 10,
    page: 1,
    total_record: 1,
    total_page: 1,
  });

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [endpoint, setEndpoint] = useState("");

  const [showTable, setShowTable] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [Label, setLabel] = useState("");

  const handleView = () => {
    setShowTable((old_value) => !old_value);
    setIsEdit(false);
  };

  if (Auth === false) {
    return <NavigationAuth onLogin={handleLoginSuccess} />;
  }

  return (
    <div>
      <QueryContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          query,
          setQuery,
          columns,
          setColumns,
          rows,
          setRows,
          endpoint,
          setEndpoint,
          showTable,
          setShowTable,
          isEdit,
          setIsEdit,
          handleView,
          Label,
          setLabel,
          handleLogout,
        }}
      >
        <Toaster />
        <Navigation />
      </QueryContext.Provider>
    </div>
  );
}

export default App;
