'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function Viewer(props: {state: string, setState: Dispatch<SetStateAction<string>>}){
    const [once, setOnce] = useState(false)
    const [data, setData] = useState<Data[]>([])
    const [onWindow, setOnWindow] = useState(false)
    const [search, setSearch] = useState("")
    const [name, setName] = useState("")
    const [format, setFormat] = useState<Format>("text")
    const [onContent, setOnContent] = useState(false)
    const [content, setContent] = useState<any>(null)
    const [selectedData, setSelectedData] = useState<number>(-1)
    const [onFilter, setOnFilter] = useState(false)

    useEffect(() => {
        setOnce(true)
    }, [])

    useEffect(() => {
        if(!onWindow){
            setName("")
            setFormat("text")
        }
    }, [onWindow])

    useEffect(() => {
        if(once){
            reload()
        }
    }, [once])

    const reload = () => {
        fetch("/api/controller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                c: 'list'
            })
        }).then(res => res.json()).then(data => {
            setData(data.data)
        }).catch(err => console.error(err))
    }

    return <main className="flex min-h-screen flex-col items-center justify-between pl-40 pr-40 pt-20 pb-20 gap-3">
        <button
            className="absolute left-10 top-8 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer"
            onClick={e => props.setState("")}
        >
            <h2 className={`mb-3 text-xl font-semibold `}>
                <span className="inline-block transition-transform group-hover:translate-x-[-4px] motion-reduce:transform-none">
                    &lt;-&nbsp;
                </span>
                Back
          </h2>
        </button>
        <nav className="flex flex-row justify-between w-full gap-5">
            <button
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors"
                onClick={e => setOnFilter(true)}
            >
                Filter
            </button>
            <input className="flex-[8] rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-300 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Search"
            onChange={e => setSearch(e.target.value)} value={search}/>
            <button
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors"
                onClick={reload}
            >
                Refresh
            </button>
            <button
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors"
                onClick={e => setOnWindow(true)}
            >
                Add New
            </button>
        </nav>
        {
            <div className="w-full h-full flex-1 rounded-md border border-1 border-gray-400 dark:border-neutral-700 flex flex-col items-center justify-between">
                <nav className="w-full flex flex-row items-center justify-between text-center p-3 font-semibold text-lg border-b border-b-1 border-b-gray-400 dark:border-b-neutral-700">
                    <div className="flex-1">Name</div>
                    <div className="flex-1">Format</div>
                    <div className="flex-1">Created</div>
                    <div className="flex-1">Modified</div>
                    <div className="flex-1"></div>
                </nav>
                <div className="w-full h-full flex-1 overflow-y-auto">
                    {data.map((d, i) => <div key={i}
                    className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:dark:bg-neutral-800 transition-colors p-2"
                    onClick={e => {
                        if((e.target as Element).nodeName == e.currentTarget.nodeName){
                            fetch("/api/controller", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    c: 'read',
                                    d: {_id: d._id}
                                })
                            }).then(res => res.json()).then(data => {
                                setContent(data.data.content)
                                setOnContent(true)
                                setSelectedData(i)
                            }).catch(err => console.error(err))
                        }
                    }}
                    >
                        <div className="flex-1">{d.name}</div>
                        <div className="flex-1">{d.format}</div>
                        <div className="flex-1">{new Date(d.created).toLocaleDateString()}</div>
                        <div className="flex-1">{new Date(d.modified).toLocaleDateString()}</div>
                        <div className="flex-1 flex flex-row items-center justify-center gap-3">
                            <button className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-2 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors"
                            onClick={e => {
                                fetch("/api/controller", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        c: 'delete',
                                        d: {_id: d._id}
                                    })
                                }).then(res => res.json()).then(data => {
                                    reload()
                                }).catch(err => console.error(err))
                            }}>
                                Remove
                            </button>
                        </div>
                    </div>)}
                </div>
            </div>
        }
        {onWindow && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) setOnWindow(false)}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <h2 className="text-2xl font-semibold">Insert new documents</h2>
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Name"
                onChange={e => setName(e.target.value)} value={name}/>
                <select className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                onChange={e => setFormat(e.target.value as Format)} value={format}>
                    <option value="text">Text</option>
                    <option value="img">Image</option>
                    <option value="json">JSON</option>
                </select>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400"
                        onClick={e => setOnWindow(false)}
                    >
                        Close
                    </button>
                    <button
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors"
                        onClick={e => {
                            fetch("/api/controller", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    c: 'create',
                                    d: {name, format, created: new Date(), modified: new Date(), content:""}
                                })
                            }).then(res => res.json()).then(data => {
                                setOnWindow(false)
                                reload()
                            }).catch(err => console.error(err))
                        }}
                    >
                        Insert
                    </button>
                </footer>
            </div>
        </div>}
        {onContent && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) {
                setOnContent(false)
                setSelectedData(-1)
            }}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <h2 className="text-2xl font-semibold">Content</h2>
                <textarea className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                name="" id="" cols={40} rows={10} value={content}
                onChange={e => setContent(e.target.value)}/>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400"
                        onClick={e => {
                            setOnContent(false)
                            setSelectedData(-1)
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400"
                        onClick={e => {
                            let seld = data[selectedData]
                            fetch("/api/controller", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    c: 'update',
                                    d: {_id:seld._id},
                                    m: {content, modified: new Date()}
                                })
                            }).then(res => res.json()).then(data => {
                                setOnContent(false)
                                reload()
                            }).catch(err => console.error(err))
                        }}
                    >
                        Save
                    </button>
                </footer>
            </div>
        </div>}
    </main>
}