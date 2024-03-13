import { Dispatch, SetStateAction, useEffect, useState } from "react";


export default function Role(props: {state: string, setState: Dispatch<SetStateAction<string>>, role: Role|null, setRole: Dispatch<SetStateAction<Role|null>>}){
    const [once, setOnce] = useState(false)
    
    useEffect(() => {
        if(once){
        }
    }, [once])

    useEffect(() => {
        setOnce(true)
    }, [])

    return (
        <></>
    )
}