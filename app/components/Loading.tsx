import { FC } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';

const Loading: FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#00FF00] text-black">
      <div className="relative w-full aspect-square max-w-[65%] max-h-[65%] ">
        <Image
          src={asset("/image/loading.png")}
          alt="Loading"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-8 text-center">
        <div className="text-sm mb-2">INTERACTIVE DESIGN BY</div>
        <div className="text-xl font-bold">THE3.STUDIO</div>
      </div>
    </div>
  );
};

export default Loading; 