import React from 'react';

const CourseCard = ({ id }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>
      <h3 className="font-bold">프로그래밍 기초 강좌 {id}</h3>
      <p className="text-gray-500 text-sm">한국 IT 교육센터</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-blue-500 font-bold">무료</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
          수강하기
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
