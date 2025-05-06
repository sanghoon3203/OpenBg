import React from 'react';
import SidebarProfile from './SidebarProfile';
import BadgeOverview from './BadgeOverview';
import MenuList from './MenuList';

const Sidebar = ({ activeMenu, setActiveMenu, idToken, onLogout }) => {
  return (
    <div className="bg-black h-screen w-80 p-4 text-white flex flex-col">
      <span className="inline-block h-[10px]"></span>
      <SidebarProfile idToken={idToken} onLogout={onLogout} />
      <span className="inline-block h-[45px]"></span>
      <BadgeOverview />
      <MenuList activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </div>
  );
};

export default Sidebar;
