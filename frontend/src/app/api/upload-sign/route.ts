import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('video') as File;
    const label = formData.get('label') as string;

    if (!file || !label) {
        return Response.json({ message: 'Missing video or label' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filePath = join(uploadsDir, `${label}-${timestamp}.mp4`);
    await writeFile(filePath, buffer);

    return Response.json({ message: 'Video uploaded successfully!' });
}