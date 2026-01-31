import { NextRequest, NextResponse } from 'next/server';
import { join, extname } from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    // 解析文件名
    const urlParts = request.nextUrl.pathname.split('/');
    const filename = urlParts[urlParts.length - 1]; // 获取最后的文件名
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error('文件不存在:', filePath);
      return new NextResponse('文件不存在', { status: 404 });
    }

    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    console.log('文件大小:', fileBuffer.length);

    // 获取文件 MIME 类型
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    const mimeType = mimeTypes[extname(filename).toLowerCase()] || 'application/octet-stream';

    // 设置响应头
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('文件读取失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}