import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const image = data.get('image') as File;
    const fileName = image.name;

    if (!image) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    
    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadDir, fileName), Buffer.from(await image.arrayBuffer()));
    } catch (error) {
      console.error('文件保存失败:', error);
      return NextResponse.json(
        { error: '文件保存失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      url: `api/uploads/${fileName}`
    });
  } catch (error) {
    console.error('上传处理失败:', error);
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    );
  }
} 

