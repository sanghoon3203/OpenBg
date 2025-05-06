import React from 'react';
import { motion } from 'framer-motion';

const BadgeSlider = ({ badges }) => {
  const handleImageError = (e) => {
    e.target.src = '/fallback.png'; // 이미지 깨졌을 때 대체 이미지
  };

  return (
    <div className="overflow-hidden whitespace-nowrap py-16 bg-white">
      <div className="flex">
        <motion.div
          className="flex w-fit"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 45, // 느리게 설정
              ease: 'linear',
            },
          }}
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 px-6"
            >
              {badges.map((badge, index) => (
                <div
                  key={`${i}-${index}`}
                  className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition-all w-[340px] h-[360px] flex flex-col justify-start"
                >
                  <div className="mx-6 mt-6">
                    <img
                      src={badge.image}
                      alt={badge.title}
                      onError={handleImageError}
                      className="w-[290px] h-[200px] object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-4 pt-3">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {badge.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      발행: {badge.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BadgeSlider;
