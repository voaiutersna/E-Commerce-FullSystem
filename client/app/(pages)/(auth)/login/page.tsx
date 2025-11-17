"use client"
import { error } from "console"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import axios from "axios"
import UseEcomStore from "../../(store)/Ecom-store";
import { useRouter } from "next/navigation"

export default function Login() {
    // console.log(UseEcomStore()) จะได้ object ทั้งก่อนมาไว้ใช้งาน
    const router = useRouter()
    const actionLogin = UseEcomStore((object) => object.actionLogin)
    const [form, setForm] = useState({ email: "", password: "" })
    function HandleChange(e) {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value //update value ใน key นั้นๆของ event
        })
    }
    function HandleSubmit(e) {
        e.preventDefault()
        const LoginData = async () => {
            try {
                const res = await actionLogin(form)
                console.log(res)
                const { role } = res.data?.payload
                // console.log(role)
                //redirect user or admin page
                toast.success(res.data?.message)
                if (role === "admin"){
                    router.push('/dashboard')
                }else{
                    router.push("/homeuser")
                }
            } catch (err) {
                console.log("Error from LoginData")
                // console.log(err)
                const errMsg =  err.response?.data?.message
                toast.error(errMsg)
            }
        }
        LoginData()

    }
    return (
        <>
            <form onSubmit={HandleSubmit}>
                Email<input className="border" name="email" type="email" onChange={HandleChange}></input>
                Password<input className="border" name="password" type="text" onChange={HandleChange}></input>
                <button className="bg-blue-400 rounded-md">Login</button>
            </form>
        </>
    )
}