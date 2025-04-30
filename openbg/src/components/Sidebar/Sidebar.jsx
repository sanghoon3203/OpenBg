import React from 'react';
import SidebarProfile from './SidebarProfile';
import BadgeSearch from './BadgeSearch';
import BadgeOverview from './BadgeOverview';
import MenuList from './MenuList';

const Sidebar = ({ activeMenu, setActiveMenu, idToken, onLogout }) => {
  return (
    <div className="bg-black h-screen w-80 p-4 text-white flex flex-col">
      <SidebarProfile idToken={idToken} onLogout={onLogout} />
      <BadgeSearch />
      <BadgeOverview />
      <MenuList activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </div>
  );
};

export default Sidebar;
