import client from "../db";

export async function POST(request: Request) {
    const req = await request.json()
    const database = client.db('mycloud')
    const col = database.collection('root')

    switch(req.c){
        case 'create': {
            const res = await col.insertOne(req.d)
            return new Response(JSON.stringify({ok:true, id: res.insertedId}))
        }
        case 'update': {
            const res = await col.updateOne({_id: req.d._id}, {$set: req.d})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'delete': {
            const res = await col.deleteOne({_id: req.d._id})
            return new Response(JSON.stringify({ok:true}))
        }
        case 'read': {
            const res = await col.findOne({_id: req.d._id})
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        case 'list': {
            const res = await col.find().toArray()
            return new Response(JSON.stringify({ok:true, data: res}))
        }
        default: {
            return new Response(JSON.stringify({ok:false, error: 'Invalid command'}))
        }
    }
}