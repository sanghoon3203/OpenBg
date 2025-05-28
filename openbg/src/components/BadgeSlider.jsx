import React from 'react';
import { motion } from 'framer-motion'; //

const BadgeSlider = ({ badges }) => { //
  const handleImageError = (e) => { //
    // 이미지 로드 실패 시 대체 이미지 경로 또는 스타일 처리
    e.target.style.display = 'none'; // 이미지 숨김
    const fallbackText = e.target.parentElement.querySelector('.fallback-text');
    if (fallbackText) {
      fallbackText.style.display = 'flex';
    }
  };

  // 뱃지를 두 줄로 나누기
  const firstRowBadges = badges.filter((_, index) => index % 2 === 0);
  const secondRowBadges = badges.filter((_, index) => index % 2 !== 0);

  const renderBadgeRow = (badgeList, rowIndex, animationConfig) => (
    <motion.div
      className="flex" //
      animate={{ x: animationConfig.xPercentage }} // 각 행이 독립적으로 옆으로 흐르도록
      transition={{
        x: {
          repeat: Infinity, //
          repeatType: 'loop', //
          duration: animationConfig.duration, //
          ease: 'linear', //
          delay: animationConfig.delay,
        },
      }}
    >
      {[...Array(3)].map((_, i) => ( // 뱃지 목록을 3번 반복하여 끊김 없는 효과
        <div
          key={`${rowIndex}-${i}`}
          className="flex-none flex items-center gap-x-[54px] px-[27px]"
        >
          {badgeList.map((badge, index) => (
            <div
              key={`${rowIndex}-${i}-${index}`}
              className="relative group flex-shrink-0"
              style={{
                width: '350px',
                height: '200px',
                // 두 번째 줄의 경우, y축 이동 및 x축 시작 위치를 살짝 다르게 설정
                transform: `translateY(${rowIndex * 30}px) translateX(${rowIndex * -50}px)`,
              }}
            >
              <img
                src={badge.image || 'https://via.placeholder.com/350x200/E0E7FF/4F46E5?text=Fallback'}
                alt={badge.title} //
                onError={handleImageError} //
                className="w-full h-full object-cover rounded-xl shadow-md transition-all duration-300 ease-in-out group-hover:shadow-lg"
              />
              <div
                className="fallback-text absolute inset-0 hidden items-center justify-center bg-gray-200 rounded-xl text-gray-500"
              >
                {badge.title || '이미지 없음'}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 ease-in-out rounded-xl p-2">
                <p className="text-white text-center text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 break-words">
                  {badge.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );

  // 각 줄에 대한 애니메이션 설정
  const firstRowAnimation = {
    xPercentage: ['0%', '-100%'], // 첫 번째 줄은 왼쪽으로 흐름
    duration: 70, // 기존 속도
    delay: 0,
  };

  const secondRowAnimation = {
    xPercentage: ['-50%', '50%'], // 두 번째 줄은 다른 시작점에서 반대 방향 또는 다른 범위로 흐르게 설정 가능
                                  // 또는 같은 방향이지만 속도/딜레이 다르게: ['0%', '-100%']
    duration: 85, // 약간 다른 속도
    delay: 1.5,    // 더 긴 지연 시간
  };


  return (
    <div className="overflow-hidden py-12 bg-white">
      <div style={{ marginBottom: '54px' }}>
        {renderBadgeRow(firstRowBadges, 0, firstRowAnimation)}
      </div>
      <div>
        {renderBadgeRow(secondRowBadges, 1, secondRowAnimation)}
      </div>
    </div>
  );
};

export default BadgeSlider; //