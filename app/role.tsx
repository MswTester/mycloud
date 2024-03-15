import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Role(props: {state: string, setState: Dispatch<SetStateAction<string>>, role: Role|null, setRole: Dispatch<SetStateAction<Role|null>>}){
    const {state, setState, role, setRole} = props
    const [once, setOnce] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [permissions, setPermissions] = useState<string[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [search, setSearch] = useState("")
    const [onWindow, setOnWindow] = useState("")
    const [selected, setSelected] = useState<Role|null>(null)
    
    useEffect(() => {
        if(once){
            reload()
        }
    }, [once])

    useEffect(() => {
        setOnce(true)
    }, [])

    useEffect(() => {
        if(onWindow == ""){
            setName("")
            setPassword("")
            setPermissions([])
            setErrorMsg("")
            setSelected(null)
        }
    }, [onWindow])

    const reload = () => {
        setIsFetching(true)
        fetch("/api/controller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ c: "listRoles" }),
        })
            .then((res) => res.json())
            .then((res) => {
                setIsFetching(false)
                if (res.ok) {
                    setRoles(res.data)
                }
            })
            .catch((err) => console.error(err))
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
                onClick={e => setOnWindow("addRole")}
            >
                Add New
            </button>
        </nav>

        {/* Table */}
        <div className="w-full h-full flex-1 rounded-md border border-1 border-gray-400 dark:border-neutral-700 flex flex-col items-center justify-between">
            <nav className="w-full flex flex-row items-center justify-between text-center p-3 font-semibold text-lg border-b border-b-1 border-b-gray-400 dark:border-b-neutral-700">
                <div className="flex-1">Name</div>
                <div className="flex-1">Created</div>
                <div className="flex-1"></div>
            </nav>
            <div className="w-full h-full flex-1 overflow-y-auto">
                {roles.map((d, i) => {
                    if(!d.name.toLowerCase().includes(search.toLowerCase())) return null
                    return <div key={i}
                    className="w-full flex flex-row items-center justify-between text-center cursor-pointer hover:bg-gray-100 hover:dark:bg-neutral-800 transition-colors p-2"
                    onClick={e => {
                        if((e.target as Element).nodeName == e.currentTarget.nodeName){
                            if(d.password && props.role?.name != "admin"){
                                setOnWindow("password")
                                setSelected(d)
                            } else {
                                setIsFetching(true)
                                fetch("/api/controller", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        c: 'findRole',
                                        d: {_id: d._id}
                                    })
                                }).then(res => res.json()).then(data => {
                                    setIsFetching(false)
                                    setOnWindow("update")
                                    setSelected(data.data)
                                }).catch(err => console.error(err))
                            }
                        }
                    }}
                    >
                    <div className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{d.name}</div>
                    <div className="flex-1">{new Date(d.created).toLocaleDateString()}</div>
                    <div className="flex-1 flex flex-row items-center justify-center gap-3">
                        {d.name != "admin" && <button className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-2 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isFetching}
                        onClick={e => {
                            if(d.password && props.role?.name != "admin"){
                                setOnWindow("password")
                                setSelected(d)
                            } else {
                                setIsFetching(true)
                                fetch("/api/controller", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        c: 'deleteRole',
                                        d: {_id: d._id}
                                    })
                                }).then(res => res.json()).then(data => {
                                    setIsFetching(false)
                                    reload()
                                }).catch(err => console.error(err))
                            }
                        }}>
                            Remove
                        </button>}
                    </div>
                </div>})}
            </div>
        </div>

        {/* AddRole Window */}
        {onWindow == "addRole" && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
        onMouseDown={e => {
            if(e.target == e.currentTarget) setOnWindow("")
        }}>
            <div className="flex flex-col gap-4 p-8 bg-white rounded-lg">
                <p className="text-2xl font-semibold">Add Role</p>
                <input type="text" placeholder="Name" className="p-2 border border-gray-300 rounded-lg" value={name} onChange={e => {setName(e.target.value);setErrorMsg('')}}/>
                <input type="password" placeholder="Password" className="p-2 border border-gray-300 rounded-lg" value={password} onChange={e => {setPassword(e.target.value);setErrorMsg('')}}/>
                <p className="text-red-500">{errorMsg}</p>
                <button disabled={isFetching} className="rounded-md bg-neutral-800 dark:bg-gray-50 text-white dark:text-black p-3 text-md font-semibold hover:bg-neutral-700 hover:dark:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                    setIsFetching(true)
                    fetch("/api/controller", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ c: "makeRole", d: { name, password, created:new Date(), permissions } }),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            if (res.ok) {
                                setOnWindow("")
                                reload()
                            } else {
                                setErrorMsg("Role already exists")
                            }
                        })
                        .catch((err) => console.error(err))
                        .finally(() => setIsFetching(false))
                }}>Add</button>
            </div>
        </div>}
    </main>)
}