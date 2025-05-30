import React from 'react';

const BadgeCard = ({ title, issuer, date, skills = [], imageUrl, isEmptyCard = false, onDelete, onAdd }) => {
  if (isEmptyCard) {
    return (
      <div
        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 h-40 w-full flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-indigo-300"
        onClick={onAdd}
      >
        <div className="text-gray-400 hover:text-indigo-500 text-center transition-colors duration-300">
          <span className="block text-3xl mb-1">+</span>
          <span className="font-medium text-sm">뱃지 추가 하기</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 h-40 w-full relative group flex items-center"> {/* 카드 자체에 relative 추가 */}
      {/* 삭제 버튼: 카드 자체의 우측 상단 */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2.5 right-2.5 bg-red-500 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-20" // z-index 추가하여 다른 요소 위에 오도록 함
          title="삭제"
        >
          ✕
        </button>
      )}

      {/* 뱃지 이미지/아이콘 영역 */}
      <div className="w-24 h-24 rounded-lg flex items-center justify-center shadow-sm mr-4 flex-shrink-0"> {/* 기존 스타일 유지 */}
        {imageUrl ? (
          <img src={imageUrl} alt={title || "뱃지 이미지"} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex flex-col items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400 mb-1">
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm0 0L12 14 22 4"></path>
            </svg>
            <span className="text-xs font-semibold mt-1 bg-gray-600 bg-opacity-50 px-2 py-0.5 rounded">코딩짱</span>
          </div>
        )}
      </div>

      {/* 뱃지 정보 영역 */}
      <div className="flex-grow flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-800 truncate mb-1">{title || "정보처리기사"}</h3>
        <p className="text-xs text-gray-500 mb-2">주관기관 : {issuer || "한국산업인력공단"}</p>
        <p className="text-xs text-gray-400 flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          취득 날짜: {date || '25/01/25'}
        </p>
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.slice(0, 2).map((skill, idx) => (
              <span key={idx} className="bg-indigo-100 text-indigo-600 text-xs px-1.5 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
            {skills.length > 2 && (
                 <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                 +{skills.length - 2}
               </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;