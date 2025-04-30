import React from 'react';
import { motion } from 'framer-motion';

const LogoSlider = ({ logos }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap my-16 relative">
      <div className="flex">
        <motion.div
          className="flex min-w-full"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* 첫 번째 로고 세트 */}
          <div className="flex min-w-full justify-around items-center gap-12 px-4">
            {logos.map((logo, index) => (
              <div key={`logo-${index}`} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <img src={logo.image} alt={logo.name} className="h-12 object-contain" />
              </div>
            ))}
          </div>
          
          {/* 두 번째 로고 세트 (무한 스크롤을 위한 복제) */}
          <div className="flex min-w-full justify-around items-center gap-12 px-4">
            {logos.map((logo, index) => (
              <div key={`logo-copy-${index}`} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <img src={logo.image} alt={logo.name} className="h-12 object-contain" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogoSlider;