// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { MongoClient, GridFSBucket } from 'mongodb';

// MongoDB 설정
import {client} from './db'

// Multer 설정 - 메모리 스토리지 사용
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // Multer를 사용하기 때문에 기본 bodyParser를 비활성화합니다.
  },
};

const uploadFileToGridFS = async (file: Express.Multer.File): Promise<string> => {
  try {
    await client.connect();
    const db = client.db('mycloud');
    const bucket = new GridFSBucket(db, { bucketName: 'files' });

    // 스트림을 사용해 파일을 GridFS에 저장
    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.write(file.buffer);
    uploadStream.end();

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });
      uploadStream.on('error', reject);
    });
  } finally {
    await client.close();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    upload.single('file')((req as any), {} as any, async (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const file = (req as any).file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }

      try {
        const fileId = await uploadFileToGridFS(file);
        res.status(200).json({ message: 'File uploaded successfully', fileId });
      } catch (error) {
        res.status(500).json({ error: (error as any).message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
