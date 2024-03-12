import { GridFSBucket, ObjectId } from "mongodb";
import {client} from "../db";

export async function POST(request: Request) {
    const req = await request.json()
    const command = req.c
    const data:Data = req.d as Data
    const modifier:Data = req.m as Data
    const database = client.db('mycloud')
    const root = database.collection('root')
    const files = database.collection('files')
    const folders = database.collection('folders')
    const roles = database.collection('roles')

    switch(command){
        case 'create': {
            const res = await root.insertOne({ ...data, _id: ObjectId.createFromTime(Date.now()) });
            return new Response(JSON.stringify({ok:true, id: res.insertedId}));
        }
        case 'update': {
            const res = await root.updateOne({_id: new ObjectId(data._id)}, {$set: modifier})
            return new Response(JSON.stringify({ok:true, data:res}))
        }
        case 'delete': {
            const res = await root.deleteOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'read': {
            const res = await root.findOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'list': {
            const res = await root.find({}, {projection: {content:0}}).toArray()
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'upload': {
            const res = await files.insertOne({ ...data, _id: ObjectId.createFromTime(Date.now())})
            return new Response(JSON.stringify({ok:true, id:res.insertedId}))
        }
        case 'download':{
            const res = await files.findOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true, data:res}))
        }
        case 'remove':{
            const res = await files.deleteOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'getTree':{
            let fileRes = await files.find({}, {projection: {base64:0}}).toArray()
            let folderRes = await folders.find({}).toArray()
            return new Response(JSON.stringify({ok:true, data:{files:fileRes, folders:folderRes}}))
        }
        case 'makeRole':{
            const res = await roles.insertOne({ ...data, _id: ObjectId.createFromTime(Date.now())})
            return new Response(JSON.stringify({ok:true, id:res.insertedId}))
        }
        case 'deleteRole':{
            const res = await roles.deleteOne({_id: new ObjectId(data._id)})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'listRoles':{
            const res = await roles.find({}, {projection: {password:0}}).toArray()
            return new Response(JSON.stringify({ok:true, data:res}))
        }
        default: {
            return new Response(JSON.stringify({ok:false, error: 'Invalid command'}))
        }
    }
}