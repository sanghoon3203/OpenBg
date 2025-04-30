import React from 'react';

const BadgeCard = ({ title, issuer, date, skills = [], isEmptyCard = false, onDelete, onAdd }) => {
  if (isEmptyCard) {
    return (
      <div 
        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 h-56 w-full flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-indigo-300"
        onClick={onAdd}
      >
        <div className="text-gray-400 hover:text-indigo-500 text-center transition-colors duration-300">
          <span className="block text-4xl mb-2">+</span>
          <span className="font-medium">컨텐츠 추가하기</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 h-56 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-blue-500"></div>

      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
          <p className="text-gray-500 text-sm">{issuer}</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          취득 날짜: {date || '정보 없음'}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap mt-1 gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {onDelete && (
        <button 
          onClick={onDelete} 
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
        >
          삭제
        </button>
      )}
    </div>
  );
};

export default BadgeCard;
