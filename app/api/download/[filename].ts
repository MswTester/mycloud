// pages/api/download/[filename].ts
import { MongoClient, GridFSBucket } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filename } = req.query;
    if (typeof filename !== 'string') {
      res.status(400).send('Filename must be a string');
      return;
    }

    await client.connect();
    const db = client.db('mycloud');
    const bucket = new GridFSBucket(db, { bucketName: 'files' });

    const downloadStream = bucket.openDownloadStreamByName(filename);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    downloadStream.pipe(res).on('error', (error) => {
      res.status(404).send('Not found');
    }).on('finish', () => {
      console.log('Download finished');
      client.close();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error downloading file');
  }
}
