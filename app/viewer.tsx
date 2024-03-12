'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"

const masterPassword = "master"

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
    const [isFetching, setIsFetching] = useState(false)
    const [title, setTitle] = useState("")
    const [datatype, setDatatype] = useState("")
    const [password, setPassword] = useState("")
    const [onPassword, setOnPassword] = useState(false)
    const [r, setR] = useState<number>(-1)
    const [passErrMsg, setPassErrMsg] = useState("")
    const [updPass, setUpdPass] = useState("")
    const [passWork, setPassWork] = useState<"update"|"remove">("update")
    
    const resizeTextarea = () => {
        const textareas:NodeListOf<HTMLTextAreaElement> = document.querySelectorAll('textarea');
        for (let i = 0; i < textareas.length; i++) {
            textareas[i].rows = Math.round(window.innerHeight / 60)
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
        if(once){
            reload()
            // 로드 시 및 화면 크기 변경 시 함수 호출
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

    const openFile = () => {
        let file = document.createElement("input")
        file.type = "file"
        file.onchange = e => {
            let reader = new FileReader()
            let tar = (e.target as HTMLInputElement).files![0]
            reader.onload = e => {
                let base64 = (e.target as any).result
                console.log(base64, tar)
            }
            reader.readAsDataURL(tar)
        }
        file.click()
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
        <nav className="flex flex-row justify-between w-full gap-5">
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setOnFilter(true)}
            >
                Filter
            </button>
            <input className="flex-[8] rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-300 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Search"
            onChange={e => setSearch(e.target.value)} value={search} style={{minWidth: 'min(100%, 100px)'}}/>
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={reload}
            >
                Refresh
            </button>
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
                    {data.map((d, i) => {
                        if(!d.name.toLowerCase().includes(search.toLowerCase())) return null
                        return <div key={i}
                        className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800 transition-colors p-2"
                        onClick={e => {
                            if((e.target as Element).nodeName == e.currentTarget.nodeName){
                                if(d.password){
                                    setOnPassword(true)
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
                        <div className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{d.name}</div>
                        <div className="flex-1">{d.format}</div>
                        <div className="flex-1">{new Date(d.created).toLocaleDateString()}</div>
                        <div className="flex-1">{new Date(d.modified).toLocaleDateString()}</div>
                        <div className="flex-1 flex flex-row items-center justify-center gap-3">
                            <button className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-2 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isFetching}
                            onClick={e => {
                                if(d.password){
                                    setOnPassword(true)
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
                                    d: {name, format, created: new Date(), modified: new Date(), content:"", password}
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
        {onContent && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) {
                setOnContent(false)
                setSelectedData(-1)
            }}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="text-center text-2xl font-semibold rounded-md p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 focus:outline-none transition-colors"
                type="text" name="" id="" value={title} onChange={e => setTitle(e.target.value)} />
                <select className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
                onChange={e => setDatatype(e.target.value as Format)} value={datatype}>
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
                    <textarea className="rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors"
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
        {onPassword && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) setOnPassword(false)}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <h2 className="text-2xl font-semibold">Input password to open</h2>
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
                            if(password == tar.password || password == masterPassword){
                                setIsFetching(true)
                                fetch("/api/controller", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        c: 'read',
                                        d: {_id: tar._id}
                                    })
                                }).then(res => res.json()).then(data => {
                                    setIsFetching(false)
                                    setContent(data.data.content)
                                    setTitle(data.data.name)
                                    setDatatype(data.data.format)
                                    setUpdPass(data.data.password)
                                    setOnContent(true)
                                    setSelectedData(r)
                                    setOnPassword(false)
                                    setR(-1)
                                    setPassword("")
                                    setPassErrMsg("")
                                }).catch(err => console.error(err))
                            } else {
                                setPassErrMsg("Password is incorrect")
                            }
                        }}
                    >
                        Open
                    </button>
                </footer>
            </div>
        </div>}
    </main>
}
