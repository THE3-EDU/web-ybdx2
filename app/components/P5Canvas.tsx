'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type p5 from 'p5';

interface P5CanvasProps {
  isEraserEnabled: boolean;
  onDrawingChange?: (hasDrawing: boolean) => void;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  showInstructions: boolean;
  userId?: string;
}

function P5Canvas({ 
  isEraserEnabled, 
  onDrawingChange,
  showInstructions
}: P5CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const hasDrawnSomething = useRef(false);
  const clearCanvasRef = useRef<(() => void) | null>(null);
  const showInstructionsRef = useRef(showInstructions);

  useEffect(() => {
    showInstructionsRef.current = showInstructions;
  }, [showInstructions]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const initP5 = async () => {
      const p5Module = await import('p5');
      const p5 = p5Module.default;

      const sketch = (p: p5) => {
        p.setup = () => {
          const canvasDiv = canvasRef.current;
          if (!canvasDiv) return;
          
          const canvas = p.createCanvas(canvasDiv.clientWidth, canvasDiv.clientHeight);
          canvas.parent(canvasDiv);
          canvasElementRef.current = canvas.elt as HTMLCanvasElement;
        };
      
        p.draw = () => {
          // 检查是否有触摸事件或鼠标按下
          const isTouching = p.touches.length > 0;
          const isMousePressed = p.mouseIsPressed && p.mouseButton === p.LEFT;

          if (!showInstructionsRef.current && (isTouching || isMousePressed)) {
            if (isEraserEnabled) {
              p.erase();
              p.ellipse(p.mouseX, p.mouseY, 20, 20);
              p.noErase();
            } else {
              p.stroke(0, 255, 0);
              p.strokeWeight(50);
              p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
              
              if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                onDrawingChange?.(true);
                hasDrawnSomething.current = true;
              }
            }
          } else {
            console.log('showInstructionsRef.current', showInstructionsRef.current);
          }
        };

        p.mouseWheel = () => {
          // 禁用滚轮事件的默认行为
          return false;
        };

        p.mouseDragged = () => {
          if (!isEraserEnabled) {
            // 用户正在画画，更新状态
            onDrawingChange?.(true);
            hasDrawnSomething.current = true;
          }
        };

        p.touchStarted = () => {
          if (!isEraserEnabled) {
            onDrawingChange?.(true);
            hasDrawnSomething.current = true;
          }
        };

        clearCanvasRef.current = () => {
          hasDrawnSomething.current = false;
          onDrawingChange?.(false);
        };
      };

      p5InstanceRef.current = new p5(sketch);
    };

    initP5();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [onDrawingChange, isEraserEnabled, showInstructions]);

  useEffect(() => {
    if (isEraserEnabled && clearCanvasRef.current) {
      clearCanvasRef.current();
    }
  }, [isEraserEnabled]);

  return (
    <div ref={canvasRef} className="w-full h-full bg-white" />
  );
}

// 使用dynamic import避免SSR
export default dynamic(() => Promise.resolve(P5Canvas), {
  ssr: false
}); 