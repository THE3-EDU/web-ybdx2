'use client';

import Image from "next/image";
import Loading from "../components/Loading";
import Instructions from "../components/Instructions";
import P5Canvas from "../components/P5Canvas";
import { asset } from "@/lib/asset";
import { useEffect, useLayoutEffect, useState } from "react";


export default function ShowPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isEraserEnabled, setIsEraserEnabled] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

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

  const handleDone = () => {
    if (!hasDrawing) return;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResultImageUrl(url);
      setShowResult(true);
    }, 'image/png');
  };

  const handleCloseResult = () => {
    if (resultImageUrl) {
      URL.revokeObjectURL(resultImageUrl);
      setResultImageUrl(null);
    }
    setShowResult(false);
    clearCanvas();
    setHasDrawing(false);
    setIsEraserEnabled(false);
  };

  const handleDownload = () => {
    if (!resultImageUrl) return;
    const a = document.createElement('a');
    a.href = resultImageUrl;
    a.download = `drawing_${Date.now()}.png`;
    a.click();
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
              src={asset("/icon/q.svg")}
              alt="Help"
              width={30}
              height={30}
              unoptimized
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
                src={asset("/icon/eraser.svg")}
                alt="Eraser"
                width={20}
                height={20}
                className={!hasDrawing ? 'opacity-50' : ''}
                unoptimized
              />
            </button>
            <div className="absolute bottom-0 w-full aspect-[3/4]">
              <P5Canvas
                isEraserEnabled={isEraserEnabled}
                onDrawingChange={setHasDrawing}
                showInstructions={showInstructions}
              />
            </div>
          </div>
        </div>

        {/* 底部完成按钮 */}
        <div className="h-[17vh] flex flex-col items-center justify-start mt-2 space-y-2">
          <button 
            className={`bg-[#00FF00] text-black font-bold py-4 px-24 rounded-full text-xl shadow-lg mx-auto transition-all ${
              !hasDrawing || showInstructions
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#00FF00]/90 active:bg-[#00FF00]/80'
            }`}
            onClick={handleDone}
            disabled={!hasDrawing || showInstructions}
          >
            完成
          </button>
        </div>
      </div>

      {showInstructions && (
        <Instructions onClose={() => {
          setShowInstructions(false);
        }} />
      )}

      {showResult && resultImageUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-[100%] max-w-sm rounded-3xl flex flex-col items-center py-12 px-14 relative bg-black/80">
            <h2 className="text-white text-xl font-bold mb-4">你的画作</h2>
            <div className="relative bg-white w-full aspect-[3/5] rounded-xl mb-4 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_10px_5px_rgba(0,128,0,0.7)]">
              <Image src={resultImageUrl} alt="你的画作" fill className="object-contain" unoptimized />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="bg-[#00FF00] text-black font-bold py-3 px-6 rounded-full"
              >
                下载图片
              </button>
              <button
                onClick={handleCloseResult}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
              >
                <Image
                  src={asset("/icon/close.svg")}
                  alt="关闭"
                  width={24}
                  height={24}
                  unoptimized
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
