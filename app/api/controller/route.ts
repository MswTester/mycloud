import { GridFSBucket, ObjectId } from "mongodb";
import {client} from "../db";

export async function POST(request: Request) {
    const req = await request.json()
    const command = req.c
    const data:Data = req.d as Data
    const modifier:Data = req.m as Data
    const database = client.db('mycloud')
    const col = database.collection('root')
    const bucket = new GridFSBucket(database)

    switch(command){
        case 'create': {
            const res = await col.insertOne({ ...data, _id: ObjectId.createFromTime(Date.now()) });
            return new Response(JSON.stringify({ok:true, id: res.insertedId}));
        }
        case 'update': {
            const res = await col.updateOne({_id: new ObjectId(data._id)}, {$set: modifier})
            return new Response(JSON.stringify({ok:true, data:res}))
        }
        case 'delete': {
            const res = await col.deleteOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'read': {
            const res = await col.findOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'list': {
            const res = await col.find().toArray()
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'upload': {
            const res = await bucket.openUploadStream(data.name, {metadata: data})
            return new Response(JSON.stringify({ok:true, id: res.id}))
        }
        case 'download': {
            const res = await bucket.openDownloadStream(new ObjectId(data._id))
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'deletefile': {
            const res = await bucket.delete(new ObjectId(data._id))
            return new Response(JSON.stringify({ok:true}))
        }
        default: {
            return new Response(JSON.stringify({ok:false, error: 'Invalid command'}))
        }
    }
}