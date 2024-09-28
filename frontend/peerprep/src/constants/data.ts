import { color } from "framer-motion";
import { FaHome, FaHistory } from "react-icons/fa";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";

export const COMPLEXITIES = [
  { id: "EASY", color: "green.400" },
  { id: "MED", color: "yellow.400" },
  { id: "HARD", color: "red.400" },
];

export const CATEGORIES = [
  { id: "Strings", color: "blue.300" },
  { id: "Data Structures", color: "green.300" },
  { id: "Algorithms", color: "orange.300" },
  { id: "Bit Manipulation", color: "purple.300" },
  { id: "Recursion", color: "yellow.300" },
];

export const menuItems = [
  {
    label: "Dashboard",
    icon: FaHome,
    color: "white",
    route: "/dashboard",
  },
  {
    label: "Questions",
    icon: HiOutlineDesktopComputer,
    color: "white",
    route: "/questions",
  },

  {
    label: "Account Settings",
    icon: IoMdSettings,
    color: "white",
    route: "/settings",
  },
  // {
  //     label: 'History',
  //     icon: FaHistory,
  //     color: 'white',
  // },
];
