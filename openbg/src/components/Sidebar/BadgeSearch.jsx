import React from 'react';
import { Search } from 'lucide-react';

const BadgeSearch = () => {
  return (
    <div className="mb-6">
      <div className="bg-gray-800 rounded-md p-2 flex items-center">
        <Search className="text-gray-500 mr-2" size={20} />
        <input 
          type="text" 
          placeholder="Search your badge" 
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>
    </div>
  );
};

export default BadgeSearch;
