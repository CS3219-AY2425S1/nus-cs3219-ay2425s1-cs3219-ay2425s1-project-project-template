import { FaHome, FaHistory } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

export const COMPLEXITIES = [
    { id: 'EASY', color: "green.400" },
    { id: 'MED',  color: 'yellow.400' },
    { id: 'HARD', color: 'red.400' }
  ];

  export const CATEGORIES = [
    { id: 'Strings',  color: 'blue.300' },
    { id: 'Data Structures', color: 'green.300' },
    { id: 'Algorithms', color: 'orange.300' },
    { id: 'Bit Manipulation', color: 'purple.300' },
    { id: 'Recursion', color: 'yellow.300' }
  ];

  export const menuItems = [
    {
        label: 'Home',
        icon: FaHome,
        color: 'white',
    },
    {
        label: 'Account Settings',
        icon: IoMdSettings,
        color: 'white',
    },
    {
        label: 'History',
        icon: FaHistory,
        color: 'white',
    },
];