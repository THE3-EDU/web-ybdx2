'use client';

import Image from "next/image";
import Loading from "./components/Loading";
import Instructions from "./components/Instructions";
import P5Canvas from "./components/P5Canvas";
import UploadSuccess from "./components/UploadSuccess";
import { useEffect, useLayoutEffect, useState } from "react";


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isEraserEnabled, setIsEraserEnabled] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 使用 useLayoutEffect 来避免闪烁
  useLayoutEffect(() => {
    setMounted(true);

    // 检查用户是否已登录
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userId');
    setUserId(userID);

    if (!userID) {
      console.log('signin');
      window.location.href = 'http://www.the3dio.cn/awakening';
    }else{
      console.log('pass');
    }
  }, []);

  // useEffect(() => {
  //   setShowInstructions(true);
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
    };
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // useEffect(() => {
  //   console.log('showInstructions changed:', showInstructions);
  //   // 初始化或更新逻辑
  // }, [showInstructions]);

  const handleUpload = async () => {
    if (!hasDrawing) return;
  
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
  
    setIsUploading(true);
    setUploadError(null);
  
    // 重新生成时间戳，确保文件名唯一
    const newTimestamp = new Date().toISOString().replace(/[-:.]/g, "");
    // setTimestamp(newTimestamp);
  
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/png');
      });
  
      if (!userId) {
        throw new Error('用户未登录');
      }
  
      const formImageData = new FormData();
      const formMetadataData = new FormData();
      const fileName = `drawing_${userId}_${newTimestamp}.png`; // 使用新的时间戳
  
      formImageData.append('image', blob, fileName);
      formMetadataData.append('userId', userId);
      formMetadataData.append('imageName', fileName);
      formMetadataData.append('fileSize', blob.size.toString());
  
      const imageResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formImageData
      });
  
      const imageData = await imageResponse.json();
      if (!imageResponse.ok) {
        throw new Error(imageData.error || '图片上传失败');
      }
  
      setImageUrl(`/api/upload/${fileName}`);
      setShowUploadSuccess(true);
  
      const metadataResponse = await fetch('http://www.the3dio.cn/api/upload', {
        method: 'POST',
        body: formMetadataData
      });
  
      const metadataData = await metadataResponse.json();
      if (!metadataResponse.ok) {
        throw new Error(metadataData.error || '元数据上传失败');
      }
  
      clearCanvas();
      setHasDrawing(false);
      setIsEraserEnabled(false);
  
      setIsUploading(false);
      setUploadError(null);
    } catch (err) {
      console.error('上传失败:', err);
      setUploadError(err instanceof Error ? err.message : '上传失败，请重试');
    }
  };

  const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawing(false);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="relative h-[100vh] md:h-[100vh] lg:h-[100vh] xl:h-[100vh] 2xl:h-[100vh] bg-white overflow-hidden">
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#00FF00] via-[#00FF00]/50 to-white p-4">
        <div className="flex items-center justify-between">
          <button 
            className="text-black p-2 hover:bg-[#E8FFE8] rounded-full transition-colors touch-none"
            onClick={() => setShowInstructions(true)}
            onTouchStart={(e) => {
              e.preventDefault();
              setShowInstructions(true);
            }}
          >
            <Image
              src="/icon/q.svg"
              alt="Help"
              width={30}
              height={30}
            />
          </button>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 flex items-start justify-center">
          <div className="relative h-[70vh] aspect-[3/4.5] bg-white rounded-3xl shadow-lg overflow-hidden">
            <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-300">THE3.STUDIO</h1>
            <button 
              onClick={() => {
                if (!hasDrawing) return;
                setIsEraserEnabled(true);
                setTimeout(() => setIsEraserEnabled(false), 100);
                clearCanvas();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                if (!hasDrawing) return;
                setIsEraserEnabled(true);
                setTimeout(() => setIsEraserEnabled(false), 100);
                clearCanvas();
              }}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors touch-none ${
                hasDrawing 
                  ? 'bg-[#E8FFE8] hover:bg-[#E0FFE0] cursor-pointer active:bg-[#D0FFD0]' 
                  : 'bg-gray-100 cursor-not-allowed opacity-50'
              }`}
              disabled={!hasDrawing}
            >
              <Image
                src="/icon/eraser.svg"
                alt="Eraser"
                width={20}
                height={20}
                className={!hasDrawing ? 'opacity-50' : ''}
              />
            </button>
            <div className="absolute bottom-0 w-full aspect-[3/4]">
              <P5Canvas
                isEraserEnabled={isEraserEnabled}
                onDrawingChange={setHasDrawing}
                showInstructions={showInstructions}
                onUploadSuccess={(url) => {
                  setShowUploadSuccess(true);
                  setImageUrl(url);
                }}
                onUploadError={(error) => setUploadError(error)}
              />
            </div>
          </div>
        </div>

        {/* 底部上传按钮 */}
        <div className="h-[17vh] flex flex-col items-center justify-start mt-2 space-y-2">
          {uploadError && (
            <p className="text-red-500 text-sm">{uploadError}</p>
          )}
          <button 
            className={`bg-[#00FF00] text-black font-bold py-4 px-24 rounded-full text-xl shadow-lg mx-auto transition-all ${
              isUploading || !hasDrawing || showInstructions
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#00FF00]/90 active:bg-[#00FF00]/80'
            }`}
            onClick={handleUpload}
            disabled={isUploading || !hasDrawing || showInstructions}
          >
            {isUploading ? 'UPLOADING...' : 'UPLOAD'}
          </button>
        </div>
      </div>

      {showInstructions && (
        <Instructions onClose={() => {
          setShowInstructions(false);
        }} />
      )}

      {showUploadSuccess && imageUrl && (
        <UploadSuccess 
          onClose={() => {
            setShowUploadSuccess(false);
            clearCanvas();
            setHasDrawing(false);
          }} 
          imageUrl={imageUrl} 
          userId={userId ? userId.padStart(8, '0') : '00000000'}
        />
      )}
    </main>
  );
}
