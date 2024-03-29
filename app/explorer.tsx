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
    const [permissions, setPermissions] = useState<string[]>([])
    const [file, setFile] = useState<File|null>(null)
    const [base64, setBase64] = useState<string>('')
    const [onEdit, setOnEdit] = useState<boolean>(false)
    const [e_name, setE_name] = useState<string>('')
    const [e_password, setE_password] = useState<string>('')
    const [e_permissions, setE_permissions] = useState<string[]>([])
    const [selected, setSelected] = useState<[number, string]>([0, '']) // [0] = 0:folder, 1:file, [1] = id
    const [onPassword, setOnPassword] = useState<string>('')
    const [passwordInput, setPasswordInput] = useState<string>('')
    const [pwsd, setPwsd] = useState<string>('')
    const [pwTarget, setPwTarget] = useState<string>('')
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
        setPermissions([])
        setFile(null)
        setBase64('')
    }

    const checkPassword = (pswd:string, tar:string, type:string) => {
        setOnPassword(type)
        setPwsd(pswd)
        setPwTarget(tar)
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

    const getIdsInPath = (pth:string):string[] => {
        let ids:string[] = []
        let foldersInPath = folders.filter(v => v.path == pth)
        let filesInPath = files.filter(v => v.path == pth)
        foldersInPath.forEach(v => {
            ids.push(v._id as string)
            ids.push(...getIdsInPath(v.path + v._id + '/'))
        })
        filesInPath.forEach(v => {
            ids.push(v._id as string)
        })
        return ids
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
            {path.split('/').filter(v => v).length > 0 && <button
                disabled={isFetching}
                className="rounded-lg border border-transparent p-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={e => setPath(path.split('/').slice(0, -2).join('/') + '/')}>
                &lt;- Back
            </button>}
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
                            if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                checkPassword(v.password, v.path + v._id + '/', 'path')
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
                                    if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                        checkPassword(v.password, `${v.name}%${v._id}%${v.roles}%0`, 'edit')
                                    } else {
                                        setOnEdit(true)
                                        setE_name(v.name)
                                        setE_password(v.password)
                                        setE_permissions(v.roles)
                                        setSelected([0, v._id as string])
                                    }
                                }}
                            >
                                Edit
                            </button>
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    if(e.currentTarget == e.target){
                                        if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                            checkPassword(v.password, `${v._id || ''}%${v.path + v._id + '/'}`, 'deleteFolder')
                                        } else {
                                            setIsFetching(true)
                                            let ids = getIdsInPath(v.path + v._id + '/')
                                            fetch('/api/controller', {
                                                method: 'POST',
                                                body: JSON.stringify({c: 'deleteFolder', d: [...ids, v._id]})
                                            }).then(res => res.json()).then(data => {
                                                setIsFetching(false)
                                                if(data.ok){
                                                    reload()
                                                }
                                            })
                                        }
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
                            if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                checkPassword(v.password, `${v.name}%${v._id}`, 'download')
                            } else {
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
                                    if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                        checkPassword(v.password, `${v.name}%${v._id}%${v.roles}%1`, 'edit')
                                    } else {
                                        setOnEdit(true)
                                        setE_name(v.name)
                                        setE_password(v.password)
                                        setE_permissions(v.roles)
                                        setSelected([1, v._id as string])
                                    }
                                }}
                            >
                                Edit
                            </button>
                            <button
                                disabled={isFetching}
                                className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={e => {
                                    if(v.password && props.role?.name != "admin" && !v.roles.includes(props.role?.name || '')){
                                        checkPassword(v.password, v._id || '', 'deleteFile')
                                    } else {
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
                                    }
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
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Permissions"
                value={permissions.join(',')} onChange={e => setPermissions(e.target.value.split(','))}/>
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
                                        roles: permissions,
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
                <input className="w-full rounded-md bg p-2 border border-1 border-gray-400 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 hover:dark:bg-neutral-800 placeholder:text-neutral-600 dark:placeholder:text-gray-400 font-semibold focus:outline-none text-lg transition-colors" type="text" name="" id="" placeholder="Permissions"
                value={e_permissions.join(',')} onChange={e => setE_permissions(e.target.value.split(','))}/>
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
                                    m: {name: e_name, password: e_password, roles: e_permissions}
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
        onMouseDown={e => {if(e.currentTarget == e.target) setOnPassword('')}}>
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
                            setOnPassword('')
                            setPasswordInput('')
                            setPwsd('')
                            setPwError('')
                            setPwTarget('')
                        }}
                    >
                        Close
                    </button>
                    <button
                        disabled={isFetching}
                        className="flex-1 rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={e => {
                            if(passwordInput == pwsd){
                                setOnPassword('')
                                setPasswordInput('')
                                setPwError('')
                                switch(onPassword){
                                    case 'path':
                                        setPath(pwTarget)
                                        break;
                                    case 'edit':
                                        setOnEdit(true)
                                        setE_name(pwTarget.split('%')[0])
                                        setE_password(pwsd)
                                        setE_permissions(pwTarget.split('%')[2].split(','))
                                        setSelected([+pwTarget.split('%')[3], pwTarget.split('%')[1]])
                                        break;
                                    case 'deleteFolder':
                                        setIsFetching(true)
                                        let pth = pwTarget.split('%')[1]
                                        let id = pwTarget.split('%')[0]
                                        let ids = getIdsInPath(pth)
                                        fetch('/api/controller', {
                                            method: 'POST',
                                            body: JSON.stringify({c: 'deleteFolder', d: [...ids, id]})
                                        }).then(res => res.json()).then(data => {
                                            setIsFetching(false)
                                            if(data.ok){
                                                reload()
                                            }
                                        })
                                        break;
                                    case 'deleteFile':
                                        setIsFetching(true)
                                        fetch('/api/controller', {
                                            method: 'POST',
                                            body: JSON.stringify({c: 'deleteFile', d: {_id: pwTarget}})
                                        }).then(res => res.json()).then(data => {
                                            setIsFetching(false)
                                            if(data.ok){
                                                reload()
                                            }
                                        })
                                        break;
                                    case 'download':
                                        setIsFetching(true)
                                        fetch('/api/controller', {
                                            method: 'POST',
                                            body: JSON.stringify({c: 'download', d: {_id: pwTarget.split('%')[1]}})
                                        }).then(res => res.json()).then(data => {
                                            setIsFetching(false)
                                            if(data.ok){
                                                let a = document.createElement("a")
                                                a.href = data.data.base64
                                                a.download = pwTarget.split('%')[0]
                                                a.click()
                                            }
                                        })
                                        break;
                                }
                                    setPwTarget('')
                                    setPwsd('')
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