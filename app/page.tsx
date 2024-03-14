'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Viewer from "./viewer";
import Explorer from "./explorer";

const types:{[key:string]:string} = {
  "Role":"Create & Manage Roles",
  "File":"Upload & Download Files",
  "Table":"Create & Manage Tables",
}

const capitalize = (s:string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Home() {
  const [once, setOnce] = useState<boolean>(false); // [1]
  const [state, setState] = useState<string>("");
  const [role, setRole] = useState<Role|null>(null);
  const [onlogin, setOnlogin] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setOnce(true);
  }, []);

  useEffect(() => {
    if (once) {
      let role = localStorage.getItem("role");
      if (role) {
        setIsFetching(true);
        fetch("/api/controller", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ c: "findRole", d: { _id: role } }),
        })
          .then((res) => res.json())
          .then((res) => {
            setIsFetching(false);
            if (res.ok) {
              setRole(res.data);
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [once]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role._id || "");
    }
  }, [role]);

  useEffect(() => {
    if (!onlogin) {
      setName("");
      setPassword("");
      setErrorMsg("");
    }
  }, [onlogin]);

  return state == "" ? (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:flex lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 select-none cursor-pointer"
          onClick={() => setOnlogin(!onlogin)}
        >
          You logged as&nbsp;
          <code className="font-mono font-bold">{capitalize(role?.name || 'guest')}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/MswTester"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/mycloud.png"
          alt="MyCloud Logo"
          width={200}
          height={200}
          priority
        />
      </div>

      <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left flex justify-between">
        {Object.keys(types).map((type, i) => (
        <div
          key={i}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 select-none cursor-pointer"
          onClick={() => setState(type.toLowerCase())}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            {`${type} `}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            {types[type]}
          </p>
        </div>
        ))}
      </div>

      {onlogin && <div className="absolute w-full h-full left-0 top-0 bg-[#00000055] flex flex-row items-center justify-center"
      onMouseDown={e => {
        if(e.target == e.currentTarget) setOnlogin(false)
      }}>
        <div className="flex flex-col gap-4 p-8 bg-white rounded-lg">
          <p className="text-2xl font-semibold">Login</p>
          <input type="text" placeholder="Username" className="p-2 border border-gray-300 rounded-lg" value={name} onChange={e => {setName(e.target.value);setErrorMsg('')}}/>
          <input type="password" placeholder="Password" className="p-2 border border-gray-300 rounded-lg" value={password} onChange={e => {setPassword(e.target.value);setErrorMsg('')}}/>
          <p className="text-red-500">{errorMsg}</p>
          {role && <button className="p-2 bg-gradient-to-r from-sky-200 to-blue-200 rounded-lg"
          onClick={() => {
            localStorage.removeItem("role")
            setRole(null)
            setOnlogin(false)
          }}>Logout</button>}
          <button className="p-2 bg-gradient-to-r from-sky-200 to-blue-200 rounded-lg"
          onClick={() => {
            setIsFetching(true)
            fetch("/api/controller", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ c: "findRole", d: { name, password } }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.data) {
                  setRole(res.data);
                  setOnlogin(false);
                } else {
                  setErrorMsg("Invalid username or password");
                }
              })
              .catch((err) => console.error(err))
              .finally(() => setIsFetching(false));
          }}>Login</button>
        </div>
      </div>}
    </main>
  ) : state == "role" ? (
    <></>
  ) : state == "file" ? (
    <Explorer state={state} setState={setState} role={role} setRole={setRole}/>
  ) : state == "table" ? (
    <Viewer state={state} setState={setState} role={role} setRole={setRole}/>
  ) : <></>;
}
