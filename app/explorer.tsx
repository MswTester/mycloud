'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function Explorer(props: {state: string, setState: Dispatch<SetStateAction<string>>, role: Role|null, setRole: Dispatch<SetStateAction<Role|null>>}){
    const [once, setOnce] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [files, setFiles] = useState<FileData[]>([])
    const [folders, setFolders] = useState<FolderData[]>([])
    const [path, setPath] = useState<string>("/")
    const [windowType, setWindowType] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [file, setFile] = useState<File|null>(null)
    const [base64, setBase64] = useState<string>('')
    const [onEdit, setOnEdit] = useState<boolean>(false)
    const [e_name, setE_name] = useState<string>('')
    const [e_password, setE_password] = useState<string>('')
    const [selected, setSelected] = useState<[number, string]>([0, '']) // [0] = 0:folder, 1:file, [1] = id
    const [onPassword, setOnPassword] = useState<boolean>(false)
    const [passwordInput, setPasswordInput] = useState<string>('')
    const [pwsd, setPwsd] = useState<string>('')
    const [pwPath, setPwPath] = useState<string>('') // path to open after password check
    const [pwError, setPwError] = useState<string>('')

    useEffect(() => {
        setOnce(true)
    }, [])
    useEffect(() => {
        if(once){
            reload()
        }
    }, [once])

    const getSize = (size:number) => {
        if(size < 1024) return size + "B"
        else if(size < 1024*1024) return (size/1024).toFixed(2) + "KB"
        else if(size < 1024*1024*1024) return (size/1024/1024).toFixed(2) + "MB"
        else if(size < 1024*1024*1024*1024) return (size/1024/1024/1024).toFixed(2) + "GB"
        else return (size/1024/1024/1024/1024).toFixed(2) + "TB"
    }

    const reload = () => {
        setIsFetching(true)
        fetch('/api/controller', {
            method: 'POST',
            body: JSON.stringify({c: 'getTree'})
        }).then(res => res.json()).then(data => {
            setIsFetching(false)
            setFiles(data.data.files)
            setFolders(data.data.folders)
        })
    }

    const closeWindow = () => {
        setWindowType('')
        setName('')
        setPassword('')
        setFile(null)
        setBase64('')
    }

    const checkPassword = (pswd:string, path:string) => {
        setOnPassword(true)
        setPwsd(pswd)
        setPwPath(path)
        setPasswordInput('')
    }

    const openFile = () => {
        let file = document.createElement("input")
        file.type = "file"
        file.onchange = e => {
            let reader = new FileReader()
            let tar = (e.target as HTMLInputElement).files![0]
            reader.onload = e => {
                let base64 = (e.target as any).result
                setFile(tar)
                setBase64(base64)
                setName(tar.name)
            }
            reader.readAsDataURL(tar)
        }
        file.click()
    }

    return (<main className="flex flex-col items-center justify-between gap-3" style={{width:'80%', height:'80%', minWidth:'min(100%, 800px)'}}>
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
                onClick={e => setWindowType("folder")}
            >
                New Folder
            </button>
            <button
                disabled={isFetching}
                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setWindowType('file')}
            >
                Upload
            </button>
        </nav>

        {/* Path Controller */}
        <nav className="w-full flex flex-row items-center justify-center">
            <button
                disabled={isFetching}
                className="rounded-lg border border-transparent p-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setPath('/')}>
                /
            </button>
            {path.split('/').filter(v => v).map((v, i, arr) => (
                <button key={i}
                    disabled={isFetching}
                    className="rounded-lg border border-transparent p-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={e => setPath('/' + arr.slice(0, i+1).join('/') + '/')}>
                    {folders.find(v2 => v2._id === v)?.name}&nbsp;&nbsp;&nbsp;/
                </button>
            ))}
        </nav>

        {/* File Explorer */}
        <div className="w-full h-full flex-1 rounded-md border border-1 border-gray-400 dark:border-neutral-700 flex flex-col items-center justify-between">
            <nav className="w-full flex flex-row items-center justify-between text-center p-3 font-semibold text-lg border-b border-b-1 border-b-gray-400 dark:border-b-neutral-700">
                <div className="flex-1">Name</div>
                <div className="flex-1">Size</div>
                <div className="flex-1">Created</div>
                <div className="flex-1"></div>
            </nav>
            <div className="w-full h-full flex-1 overflow-y-auto">
                {folders.filter(v => v.path == path).map((v, i) => (
                    <div key={i} className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800 transition-colors p-2"
                    onClick={e => {
                        if((e.target as Element).nodeName == e.currentTarget.nodeName){
                            if(v.password){
                                checkPassword(v.password, v.path + v._id + '/')
                            } else {
                                setPath(v.path + v._id + '/')
                            }
                        }
                    }}>
                        <div className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{(v.password && '🔒 ') + v.name}</div>
                        <div className="flex-1">{getSize(files.filter(f => f.path.startsWith(v.path + v._id + '/')).reduce((a, b) => a + b.size, 0))}</div>
                        <div className="flex-1">{new Date(v.created).toLocaleDateString()}</div>
                        <div className="flex-1 gap-2 flex flex-row items-center justify-center">
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    setOnEdit(true)
                                    setE_name(v.name)
                                    setE_password(v.password)
                                    setSelected([0, v._id as string])
                                }}
                            >
                                Edit
                            </button>
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    if(e.currentTarget == e.target){
                                        setIsFetching(true)
                                        let delfilelist = files.filter(f => f.path == v.path + v._id + '/').map(f => f._id)
                                        let delfolderlist = folders.filter(f => f.path == v.path + v._id + '/').map(f => f._id)
                                        fetch('/api/controller', {
                                            method: 'POST',
                                            body: JSON.stringify({c: 'deleteFolder', d: [...delfilelist, ...delfolderlist, v._id]})
                                        }).then(res => res.json()).then(data => {
                                            setIsFetching(false)
                                            if(data.ok){
                                                reload()
                                            }
                                        })
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {files.filter(v => v.path == path).map((v, i) => (
                    <div key={i} className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800 transition-colors p-2"
                    onClick={e => {
                        if((e.target as Element).nodeName == e.currentTarget.nodeName){
                            setIsFetching(true)
                            fetch('/api/controller', {
                                method: 'POST',
                                body: JSON.stringify({c: 'download', d: {_id:v._id}})
                            }).then(res => res.json()).then(data => {
                                setIsFetching(false)
                                if(data.ok){
                                    let a = document.createElement("a")
                                    a.href = data.data.base64
                                    a.download = v.name
                                    a.click()
                                }
                            })
                        }
                    }}>
                        <div className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{(v.password && '🔒 ') + v.name}</div>
                        <div className="flex-1">{getSize(v.size)}</div>
                        <div className="flex-1">{new Date(v.created).toLocaleDateString()}</div>
                        <div className="flex-1 gap-2 flex flex-row items-center justify-center">
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    setOnEdit(true)
                                    setE_name(v.name)
                                    setE_password(v.password)
                                    setSelected([1, v._id as string])
                                }}
                            >
                                Edit
                            </button>
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    setIsFetching(true)
                                    fetch('/api/controller', {
                                        method: 'POST',
                                        body: JSON.stringify({c: 'deleteFile', d: {_id:v._id}})
                                    }).then(res => res.json()).then(data => {
                                        setIsFetching(false)
                                        if(data.ok){
                                            reload()
                                        }
                                    })
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Creation Window */}
        {windowType && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) closeWindow()}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Name"
                value={name} onChange={e => setName(e.target.value)}/>
                {windowType == 'file' && <button
                    disabled={isFetching}
                    className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={openFile}
                >
                    Select File
                </button>}
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}/>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => closeWindow()}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            let isFolder:boolean = windowType == 'folder'
                            let attr = !isFolder ? {size: file?.size, base64} : {}
                            setIsFetching(true)
                            fetch('/api/controller', {
                                method: 'POST',
                                body: JSON.stringify({
                                    c: isFolder ? 'makeFolder' : 'upload',
                                    d: {
                                        name, path,
                                        created: Date.now(),
                                        password,
                                        roles: [],
                                        ...attr
                                    }
                                })
                            }).then(res => res.json()).then(data => {
                                setIsFetching(false)
                                if(data.ok){
                                    closeWindow()
                                    reload()
                                }
                            })
                        }}
                    >
                        Create
                    </button>
                </footer>
            </div>
        </div>}

        {/* Edit Window */}
        {onEdit && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) setOnEdit(false)}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Name"
                value={e_name} onChange={e => setE_name(e.target.value)}/>
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                value={e_password} onChange={e => setE_password(e.target.value)}/>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => setOnEdit(false)}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            setIsFetching(true)
                            fetch('/api/controller', {
                                method: 'POST',
                                body: JSON.stringify({
                                    c: selected[0] == 0 ? 'updateFolder' : 'updateFile',
                                    d: {_id: selected[0] == 0 ? folders.find(v => v._id == selected[1])?._id : files.find(v => v._id == selected[1])?._id},
                                    m: {name: e_name, password: e_password}
                                })
                            }).then(res => res.json()).then(data => {
                                setIsFetching(false)
                                if(data.ok){
                                    setOnEdit(false)
                                    reload()
                                }
                            })
                        }
                    }>
                        Edit
                    </button>
                </footer>
            </div>
        </div>}

        {/* Password Window */}
        {onPassword && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {if(e.currentTarget == e.target) setOnPassword(false)}}>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-10 flex flex-col items-center justify-between gap-5">
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="password" name="" id="" placeholder="Password"
                value={passwordInput} onChange={e => {
                    setPasswordInput(e.target.value)
                    setPwError('')
                }}/>
                <p className="text-red-500">{pwError}</p>
                <footer className="w-full flex flex-row items-center justify-between gap-2">
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors placeholder:text-neutral-600 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            setOnPassword(false)
                            setPasswordInput('')
                            setPwsd('')
                            setPwError('')
                            setPwPath('')
                        }}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            if(passwordInput == pwsd){
                                setOnPassword(false)
                                setPasswordInput('')
                                setPwsd('')
                                setPwError('')
                                setPath(pwPath)
                                setPwPath('')
                            } else {
                                setPwError('Invalid Password')
                            }
                        }
                    }>
                        Open
                    </button>
                </footer>
            </div>
        </div>}

    </main>)
}