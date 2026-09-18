import { useContext, useState } from "react";
import QueryContext from "../context/QueryContext";

function NavBar() {
  const { handleLogout, currentUser } = useContext(QueryContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const username = currentUser?.Username || "User";

  return (
    <div className="flex items-center justify-between px-6 py-3 shadow-md bg-[#1e3a5f]">
      {/* Brand */}
      <div className="flex items-center">
        <img
          src="/POS_logo.png"
          alt="POS Logo"
          className="h-9 w-auto object-contain"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="text-white text-sm font-semibold tracking-wide">
          {username}
        </span>
        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          className="text-sm px-4 py-1.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors disabled:opacity-50 font-medium"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default NavBar;
