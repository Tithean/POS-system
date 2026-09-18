import MasterPage from "../pages/MasterPage";
import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import axios from "../api";

function Dashboard() {
  const [dashboardData, setdashboardData] = useState([]);
  useEffect(() => {
    async function getDashboardData() {
      try {
        const result = await axios.get(
          import.meta.env.VITE_API_URL + "/dashboard",
        );
        setdashboardData(result.data.data);
      } catch (error) {
        console.log(error);
        const message_error = error.response;
        console.log(message_error);
      }
    }

    getDashboardData();
  }, []);
  return (
    <MasterPage showLabel={false} showButton={false}>
      <div className="flex gap-4 mt-10">
        {dashboardData &&
          dashboardData.map((item) => (
            <DashboardCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
      </div>
    </MasterPage>
  );
}

export default Dashboard;
