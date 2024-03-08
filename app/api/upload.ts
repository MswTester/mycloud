import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket } from 'mongodb';
import formidable from 'formidable';
import fs, { PathLike } from 'fs';
import {client} from "./db";

export const config = {
  api: {
    bodyParser: false, // Next.js의 기본 바디 파서 비활성화
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'File upload error' });
        return;
      }
      
      // 파일 업로드 로직
      try {
        await client.connect();
        const db = client.db('mycloud');
        const bucket = new GridFSBucket(db, { bucketName: 'files' });
        if(files.file === undefined){
          res.status(500).json({ error: 'No file uploaded' });
          return;
        }
        const fileStream = fs.createReadStream(files.file[0].filepath);
        const uploadStream = bucket.openUploadStream(files.file[0].originalFilename as string);
        fileStream.pipe(uploadStream)
          .on('error', () => res.status(500).json({ error: 'Error uploading file' }))
          .on('finish', () => res.status(200).json({ message: 'File uploaded successfully' }));
      } finally {
        await client.close();
      }
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
