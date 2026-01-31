import Image from 'next/image';

interface UploadSuccessProps {
  onClose: () => void;
  imageUrl: string;
  userId: string;
}

export default function UploadSuccess({ onClose, imageUrl, userId }: UploadSuccessProps) {
  // 格式化 userId 为八位数
  const formattedUserId = userId.padStart(8, '0');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[100%] max-w-sm rounded-3xl flex flex-col items-center py-12 px-14 relative">
        <h2 className="text-white text-xl font-bold">
          你的专属图腾已传输至
        </h2>
        <h2 className="text-white text-xl font-bold mb-2">
          觉醒石碑
        </h2>

        <div className="bg-white w-full aspect-[3/5] rounded-xl mb-3 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_10px_5px_rgba(0,128,0,0.7)]">
          <h1 className="text-2xl font-bold text-[#CCCCCC] mb-2 mt-4">THE3.STUDIO</h1>
          <Image src={imageUrl} alt="Uploaded Image" width={300} height={400} className="w-full h-full object-contain" />
          <h1 className="text-md font-bold text-[#CCCCCC] mb-2 mt-1">「ÆV觉醒者编号」：#{formattedUserId}</h1>
        </div>

        <button
          onClick={onClose}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
        >
          <Image
            src="/icon/close.svg"
            alt="Close"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}