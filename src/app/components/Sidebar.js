import { useState, useEffect } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  ChevronsUpDown,
  Plus,
  X,
  Home,
  MapPin,
  Building2,
  LayoutDashboard,
  Leaf,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const [isNotCollapsed, setIsNotCollapsed] = useState(true);
  const currentPath = usePathname();
  const sidebarOptions = ["Dashboard", "Sites", "Addresses", "Programs"];
  const iconMap = {
    Dashboard: LayoutDashboard,
    Sites: MapPin,
    Addresses: Home,
    Programs: Leaf,
  };
  const sortedOptions = [
    "Dashboard",
    ...sidebarOptions.filter((option) => option !== "Dashboard").sort(),
  ];
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsNotCollapsed(window.innerWidth > 768);
    }
  }, []);
  const toggleSidebar = () => {
    setIsNotCollapsed(!isNotCollapsed);
  };
  return (
    <div
      id="sidebar"
      className={`bg-gray-100 dark:bg-gray-800 dark:text-white h-full ${
        isNotCollapsed ? "w-56" : "w-16"
      } transition-all duration-500 z-40 flex flex-col flex-shrink-0`}
    >
      <div
        className={`flex ${isNotCollapsed ? "justify-end" : "justify-center"}`}
      >
        <button
          onClick={toggleSidebar}
          className={`w-12 h-12 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
          <FontAwesomeIcon
            icon={isNotCollapsed ? faChevronLeft : faChevronRight}
          />
        </button>
      </div>
      <div id="search" className={`${isNotCollapsed ? "block" : "hidden"} p-2`}>
        <form>
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 rounded-md"
          />
        </form>
      </div>
      <div>
        <ul className={`${isNotCollapsed ? "mx-2" : ""}`}>
          {sortedOptions.map((option) => {
            const optionPath =
              option === "Dashboard"
                ? "/dashboard"
                : `/dashboard/${option.toLowerCase()}`;
            const isActive = currentPath === optionPath;
            const IconComponent = iconMap[option];
            return (
              <li key={option} className="flex items-center">
                <a
                  href={optionPath}
                  className={`flex ${
                    isNotCollapsed ? "items-center" : "justify-center"
                  } text-gray-900 dark:text-white p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md font-medium ${
                    isActive
                      ? "bg-som-primary text-white hover:bg-som-primary hover:underline"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:underline"
                  }`}
                >
                  <IconComponent
                    className={`${
                      isNotCollapsed ? "mr-2" : "my-2 flex-shrink-0"
                    }`}
                  />
                  {isNotCollapsed && <p href={optionPath}>{option}</p>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
