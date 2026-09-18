import { useState, useEffect } from "react";
import axios from "../api";

function useQuery(url) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleQuery = async () => {
      try {
        setLoading(true);

        console.log("Fetching:", url);

        const response = await axios.get(url);

        setResult(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    handleQuery();
  }, [url]);

  return { result, loading };
}

export default useQuery;
