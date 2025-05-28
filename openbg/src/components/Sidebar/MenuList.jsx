// src/components/Sidebar/MenuList.jsx
import React from 'react';

const MenuList = ({ activeMenu, setActiveMenu }) => {
  const menus = [
    '대시보드',
    '맞춤 뱃지 추천',
    '커뮤니티 활동',
    '내 배지 포트폴리오'
  ];
  
  return (
    <ul className="space-y-4">
      {menus.map((menu) => (
        <li key={menu}>
          <button 
            className={`flex items-center w-full p-2 rounded-md ${activeMenu === menu ? 'bg-gray-800' : ''}`}
            onClick={() => setActiveMenu(menu)}
          >
            <span className="text-gray-500 mr-4">•</span>
            <span 
              className="font-semibold" // 세미볼드는 Tailwind 클래스 사용
              style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
            >
              {menu}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MenuList;