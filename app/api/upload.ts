// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import multer from 'multer';
import { MongoClient, GridFSBucket } from 'mongodb';

// MongoDB 설정
const uri = 'your_mongodb_uri';
const client = new MongoClient(uri);
const dbName = 'your_database_name';

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err: { stack: any; }, req: any, res: { status: (arg0: number) => { (): any; new(): any; end: { (arg0: string): void; new(): any; }; }; }, next: any) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (_req: any, res: { status: (arg0: number) => { (): any; new(): any; end: { (arg0: string): void; new(): any; }; }; }) => {
    res.status(404).end('Page is not found');
  },
}).use(upload.single('file')) // 'file'은 클라이언트에서 보내는 파일 필드의 이름입니다.
.post(async (req: { file: { originalname: string; buffer: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    uploadStream.write(req.file.buffer);
    uploadStream.end();

    uploadStream.on('finish', () => {
      res.status(201).send({ message: 'File uploaded successfully', fileId: uploadStream.id });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to upload file.');
  } finally {
    await client.close();
  }
});

export default handler;
export const config = {
  api: {
    bodyParser: false, // Multer를 사용하기 때문에 bodyParser는 비활성화합니다.
  },
};
