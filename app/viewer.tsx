'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function Viewer(props: {state: string, setState: Dispatch<SetStateAction<string>>, role: Role|null, setRole: Dispatch<SetStateAction<Role|null>>}){
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
    const [isFetching, setIsFetching] = useState(false)
    const [title, setTitle] = useState("")
    const [datatype, setDatatype] = useState("")
    const [password, setPassword] = useState("")
    const [onPassword, setOnPassword] = useState(false)
    const [r, setR] = useState<number>(-1)
    const [passErrMsg, setPassErrMsg] = useState("")
    const [updPass, setUpdPass] = useState("")
    const [passWork, setPassWork] = useState<"update"|"delete">("update")

    const [f_format, setF_format] = useState<boolean>(false)
    const [f_cdate, setF_cdate] = useState<boolean>(false)
    const [f_mdate, setF_mdate] = useState<boolean>(false)
    const [f_format1, setF_format1] = useState<Format>("text")
    const [f_cdate1, setF_cdate1] = useState<string>("")
    const [f_cdate2, setF_cdate2] = useState<string>("")
    const [f_mdate1, setF_mdate1] = useState<string>("")
    const [f_mdate2, setF_mdate2] = useState<string>("")
    
    const resizeTextarea = () => {
        const textareas:NodeListOf<HTMLTextAreaElement> = document.querySelectorAll('textarea');
        for (let i = 0; i < textareas.length; i++) {
            textareas[i].rows = Math.round(window.innerHeight / 80)
            textareas[i].cols = Math.round(window.innerWidth / 20)
        }
    }

    useEffect(() => {
        setOnce(true)
    }, [])
    
    useEffect(() => {
        if(!onWindow){
            setName("")
            setFormat("text")
            setPassword("")              
        }
    }, [onWindow])

    useEffect(() => {
        if(!onContent){
            setTitle("")
            setContent("")
            setDatatype("")
            setUpdPass("")
        } else {
            resizeTextarea()
        }
    }, [onContent])

    useEffect(() => {
        resizeTextarea()
    }, [datatype])
    
    useEffect(() => {
        if(once){
            reload()
            window.onload = resizeTextarea;
            window.onresize = resizeTextarea;
        }
        return () => {
            window.onload = null
            window.onresize = null
        }
    }, [once])
    
    const reload = () => {
        setIsFetching(true)
        fetch("/api/controller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                c: 'list'
            })
        }).then(res => res.json()).then(data => {
            setIsFetching(false)
            setData(data.data)
        }).catch(err => console.error(err))
    }

    return <main className="flex flex-col items-center justify-between gap-3" style={{width:'80%', height:'80%', minWidth:'min(100%, 800px)'}}>
        <button
            disabled={isFetching}
            className="absolute left-[3%] top-[3%] rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={e => props.setState("")}
        >
            <h2 className={`text-xl font-semibold `}>
                <span className="inline-block transition-transform group-hover:translate-x-[-4px] motion-reduce:transform-none">
                    &lt;-&nbsp;
                </span>
                Back
          </h2>
        </button>

        {/* Nav */}
        <nav className="flex flex-row justify-between w-full gap-5">
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={reload}
            >
                Refresh
            </button>
            <input className="flex-[8] rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-300 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Search"
            onChange={e => setSearch(e.target.value)} value={search} style={{minWidth: 'min(100%, 100px)'}}/>
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setOnFilter(onFilter => !onFilter)}
            >
                Filter
            </button>
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setOnWindow(true)}
            >
                Add New
            </button>
        </nav>

        {/* Filter */}
        {onFilter && <div className="w-full flex flex-row items-center justify-center gap-3">
            <div className="flex-1 flex flex-row gap-2 justify-center items-center">
                <input type="checkbox" name="" id="format" className="w-6 h-6 rounded-xl" checked={f_format} onChange={e => setF_format(e.target.checked)}/>
                <label htmlFor="format" className="text-lg font-semibold select-none">Format</label>
                <select name="" id="" className="rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                value={f_format1} onChange={e => setF_format1(e.target.value as Format)}>
                    <option value="text">Text</option>
                    <option value="img">Image</option>
                    <option value="json">JSON</option>
                </select>
            </div>
            <div className="flex-1 flex flex-row gap-2 justify-center items-center">
                <input type="checkbox" name="" id="cdate" className="w-6 h-6 rounded-xl" checked={f_cdate} onChange={e => setF_cdate(e.target.checked)}/>
                <label htmlFor="cdate" className="text-lg font-semibold select-none">Created</label>
                <input type="date" className="rounded-md bg p-1 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                value={f_cdate1} onChange={e => setF_cdate1(e.target.value)}/>
                <h2 className="text-lg font-semibold select-none">~</h2>
                <input type="date" className="rounded-md bg p-1 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" 
                value={f_cdate2} onChange={e => setF_cdate2(e.target.value)}/>
            </div>
            <div className="flex-1 flex flex-row gap-2 justify-center items-center">
                <input type="checkbox" name="" id="cdate" className="w-6 h-6 rounded-xl" checked={f_mdate} onChange={e => setF_mdate(e.target.checked)}/>
                <label htmlFor="cdate" className="text-lg font-semibold select-none">Modified</label>
                <input type="date" className="rounded-md bg p-1 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                value={f_mdate1} onChange={e => setF_mdate1(e.target.value)}/>
                <h2 className="text-lg font-semibold select-none">~</h2>
                <input type="date" className="rounded-md bg p-1 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                value={f_mdate2} onChange={e => setF_mdate2(e.target.value)}/>
            </div>
        </div>}

        {/* Table */}
        <div className="w-full h-full flex-1 rounded-md border border-1 border-gray-400 dark:border-neutral-700 flex flex-col items-center justify-between">
            <nav className="w-full flex flex-row items-center justify-between text-center p-3 font-semibold text-lg border-b border-b-1 border-b-gray-400 dark:border-b-neutral-700">
                <div className="flex-1">Name</div>
                <div className="flex-1">Format</div>
                <div className="flex-1">Created</div>
                <div className="flex-1">Modified</div>
                <div className="flex-1"></div>
            </nav>
            <div className="w-full h-full flex-1 overflow-y-auto">
                {data.map((d, i) => {
                    if(!d.name.toLowerCase().includes(search.toLowerCase())) return null
                    if(f_format && d.format != f_format1) return null
                    if(f_cdate && (new Date(d.created).getTime() < new Date(f_cdate1).getTime() || new Date(d.created).getTime() >= new Date(f_cdate2).getTime())) return null
                    if(f_mdate && (new Date(d.modified).getTime() < new Date(f_mdate1).getTime() || new Date(d.modified).getTime() >= new Date(f_mdate2).getTime())) return null
                    return <div key={i}
                    className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800 transition-colors p-2"
                    onClick={e => {
                        if((e.target as Element).nodeName == e.currentTarget.nodeName){
                            if(d.password){
                                setOnPassword(true)
                                setPassWork("update")
                                setR(i)
                            } else {
                                setIsFetching(true)
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
                                    setIsFetching(false)
                                    setContent(data.data.content)
                                    setTitle(data.data.name)
                                    setDatatype(data.data.format)
                                    setUpdPass(data.data.password)
                                    setOnContent(true)
                                    setSelectedData(i)
                                }).catch(err => console.error(err))
                            }
                        }
                    }}
                    >
                    <div className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{d.password && '🔒 '}{d.name}</div>
                    <div className="flex-1">{d.format.toUpperCase()}</div>
                    <div className="flex-1">{new Date(d.created).toLocaleDateString()}</div>
                    <div className="flex-1">{new Date(d.modified).toLocaleDateString()}</div>
                    <div className="flex-1 flex flex-row items-center justify-center gap-3">
                        <button className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-2 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isFetching}
                        onClick={e => {
                            if(d.password){
                                setOnPassword(true)
                                setPassWork("delete")
                                setR(i)
                            } else {
                                setIsFetching(true)
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
                                    setIsFetching(false)
                                    reload()
                                }).catch(err => console.error(err))
                            }
                        }}>
                            Remove
                        </button>
                    </div>
                </div>})}
            </div>
        </div>

        {/* Creation Window */}
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
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                onChange={e => setPassword(e.target.value)} value={password}/>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => setOnWindow(false)}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            setIsFetching(true)
                            fetch("/api/controller", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    c: 'create',
                                    d: {name, format, created: new Date(), modified: new Date(), content:"", password, role: []}
                                })
                            }).then(res => res.json()).then(data => {
                                setIsFetching(false)
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

        {/* Content Window */}
        {onContent && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) {
                setOnContent(false)
                setSelectedData(-1)
            }}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="text-center text-2xl font-semibold rounded-md p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 focus:outline-none transition-colors"
                type="text" name="" id="" value={title} onChange={e => setTitle(e.target.value)} />
                <select className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                onChange={e => {setDatatype(e.target.value as Format);}} value={datatype}>
                    <option value="text">Text</option>
                    <option value="img">Image</option>
                    <option value="json">JSON</option>
                </select>
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                onChange={e => setUpdPass(e.target.value)} value={updPass}/>
                {
                    datatype == "img" ? <canvas
                    width={500} height={300}
                    className="w-full rounded-md border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 transition-colors"
                    ref={canvas => {
                        if(canvas){
                            let ctx = canvas.getContext("2d")
                            let img = new Image()
                            console.log(content.length)
                            img.src = content
                            img.onload = () => {
                                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
                            }
                        }
                    }}
                    onClick={e => {
                        let file = document.createElement("input")
                        file.type = "file"
                        file.accept = "image/*"
                        file.onchange = e => {
                            let reader = new FileReader()
                            reader.onload = e => {
                                setContent(e.target?.result)
                            }
                            reader.readAsDataURL((e.target as HTMLInputElement).files![0])
                        }
                        file.click()
                    }}
                    ></canvas>:
                    datatype == "json" ? <textarea className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                    name="" id="" value={content}
                    onChange={e => setContent(e.target.value)}/>:
                    <textarea className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                    name="" id="" value={content}
                    onChange={e => setContent(e.target.value)}/>
                }
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            setOnContent(false)
                            setSelectedData(-1)
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            let seld = data[selectedData]
                            setIsFetching(true)
                            fetch("/api/controller", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    c: 'update',
                                    d: {_id:seld._id},
                                    m: {content, modified: new Date(), name: title || seld.name, format: datatype, password: updPass}
                                })
                            }).then(res => res.json()).then(data => {
                                setIsFetching(false)
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

        {/* Password Window */}
        {onPassword && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) setOnPassword(false)}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                onChange={e => {setPassword(e.target.value);setPassErrMsg("")}} value={password}/>
                <p className="text-red-500">{passErrMsg}</p>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            setPassErrMsg("")
                            setPassword("")
                            setOnPassword(false)
                        }}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            let tar = data[r]
                            if(password == tar.password || (process.env.masterPassword && password == process.env.masterPassword)){
                                setIsFetching(true)
                                fetch("/api/controller", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        c: passWork == "update" ? 'read' : 'delete',
                                        d: {_id: tar._id}
                                    })
                                }).then(res => res.json()).then(data => {
                                    setIsFetching(false)
                                    setSelectedData(r)
                                    setOnPassword(false)
                                    setR(-1)
                                    setPassword("")
                                    setPassErrMsg("")
                                    setPassWork("update")
                                    if(passWork == "update"){
                                        setContent(data.data.content)
                                        setTitle(data.data.name)
                                        setDatatype(data.data.format)
                                        setUpdPass(data.data.password)
                                        setOnContent(true)
                                    } else {
                                        reload()
                                    }
                                }).catch(err => console.error(err))
                            } else {
                                setPassErrMsg("Invalid Password")
                            }
                        }}
                    >
                        {passWork == "update" ? "Open" : "Delete"}
                    </button>
                </footer>
            </div>
        </div>}
    </main>
}
