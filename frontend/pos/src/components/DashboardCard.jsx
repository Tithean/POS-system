import {
  FaDollarSign,
  FaBox,
  FaChartLine,
  FaUser,
} from "react-icons/fa";

const iconMap = {
  "icon-dollar": <FaDollarSign size={22} />,
  "icon-box":    <FaBox size={22} />,
  "icon-sell":   <FaChartLine size={22} />,
  "icon-user":   <FaUser size={22} />,
};

function DashboardCard({ title, value, icon }) {
  const iconElement = iconMap[icon] ?? <FaDollarSign size={22} />;

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#1e3a5f] w-64 overflow-hidden">
      <div className="h-1.5 w-full bg-[#1e3a5f]" />
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1e3a5f] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#1e3a5f]">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-[#1e3a5f]">
          {iconElement}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
