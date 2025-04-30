import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';

const RecommendedCoursesContent = ({ idToken }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idToken) {
      getRecommendations(idToken)
        .then(res => {
          setRecommendations(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }
  }, [idToken]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">추천 강좌</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.recommended_courses &&
          recommendations.recommended_courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-bold">{course.course_title}</h3>
              <p className="text-gray-500 text-sm">{course.platform}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-blue-500 font-bold">무료</span>
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  수강하기
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecommendedCoursesContent; 

