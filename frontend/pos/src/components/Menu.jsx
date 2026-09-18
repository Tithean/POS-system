import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBoxes, FaShoppingCart, FaFileInvoiceDollar, FaTags } from "react-icons/fa";

const menuItems = [
  { to: "/",            label: "ផ្ទាំងដើម",   icon: <FaHome size={16} /> },
  { to: "/producttype", label: "ប្រភេទទំនិញ", icon: <FaTags size={16} /> },
  { to: "/product",     label: "ទំនិញ",        icon: <FaBoxes size={16} /> },
  { to: "/sale",        label: "ការលក់",        icon: <FaShoppingCart size={16} /> },
  { to: "/invoice",     label: "របាយការណ៍",    icon: <FaFileInvoiceDollar size={16} /> },
];

function Menu() {
  const location = useLocation();

  return (
    <aside className="min-h-screen w-56 flex flex-col py-6 px-3 gap-1 bg-[#1e3a5f]">
      <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3 text-white/40">
        Menu
      </p>
      {menuItems.map((item) => {
        const isActive =
          item.to === "/"
            ? location.pathname === "/"
            : location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");

        return (
          <Link
            key={item.to}
            to={item.to}
            className={[
              "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-[0.95rem] transition-all duration-150 no-underline",
              isActive
                ? "bg-white/20 text-white font-semibold border-l-[3px] border-white pl-[13px]"
                : "text-white/85 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

export default Menu;
