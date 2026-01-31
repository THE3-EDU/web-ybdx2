'use client';

import { FC, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';
import { asset } from '@/lib/asset';

interface InstructionsProps {
  onClose: () => void;
}

const Instructions: FC<InstructionsProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleSwipe = (direction: string) => {
    if (direction === 'LEFT') {
      setCurrentPage((prevPage) => (prevPage + 1) % 2);
    } else if (direction === 'RIGHT') {
      setCurrentPage((prevPage) => (prevPage - 1 + 2) % 2);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('LEFT'),
    onSwipedRight: () => handleSwipe('RIGHT'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center"
      style={{ zIndex: 100000 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchEnd={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        {...handlers}
        className="bg-white rounded-3xl w-[80%] max-w-[400px] p-6 relative" 
        style={{ height: '80vh' }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {currentPage === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-0">
            <Image
              src={asset("/image/intro0.png")}
              alt="Page 1"
              width={300}
              height={400}
              unoptimized
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto min-h-0">
            {/* 步骤1 */}
            <div className="flex items-start mb-8 mt-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold mr-4 text-white">
                1
              </div>
              <div>
                <div className="text-md font-bold mb-1 text-black">绘制你的专属图腾或文字</div>
                <div className="text-xs text-gray-600">DRAW ANY PICTURE OR TEXT</div>
              </div>
            </div>

            {/* 绘制示意图 */}
            <div className="mb-8 flex justify-center">
              <Image
                src={asset("/image/intro1.png")}
                alt="Loading"
                width={200}
                height={100}
                unoptimized
              />
            </div>

            {/* 步骤2 */}
            <div className="flex items-start mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold mr-4 text-white">
                2
              </div>
              <div>
                <div className="text- font-bold mb-1 text-black">完成创作后上传至觉醒石碑</div>
                <div className="text-xs text-gray-600">UPLOAD WHEN FINISHED</div>
              </div>
            </div>

            {/* 舞台大屏信息 */}
            <div className="mb-1 flex justify-center">
              <Image
                src={asset("/image/intro2.png")}
                alt="Loading"
                width={150}
                height={100}
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
      {/* 指示点 */}
      <div className="flex justify-center mt-4">
        <div className={`w-3 h-3 rounded-full mx-1 ${currentPage === 0 ? 'bg-green-500' : 'bg-white'}`}></div>
        <div className={`w-3 h-3 rounded-full mx-1 ${currentPage === 1 ? 'bg-green-500' : 'bg-white'}`}></div>
      </div>
    </div>
  );
};

export default Instructions; 