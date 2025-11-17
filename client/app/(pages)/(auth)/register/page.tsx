"use client"
import { error } from "console"
import { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import axios from "axios"

export default function Register() {
    const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" })
    function HandleChange(e) {
        const { name, value } = e.target //name คือ key , value ตือ ข้อความที่พิม
        // console.log(e.target.value)

        // ...form = copy state เดิม
        // name: value = อัปเดต key ชื่อ "name" (ผิดกรณี dynamic forms)
        // [name]: value = ใช้ค่าที่อยู่ในตัวแปร name เป็น key (ถูกต้องสำหรับ form field)

        // x setForm({ password: 'abcd' })	form กลายเป็น { password: 'abcd' } — ค่าที่เหลือหายหมด
        // ✔ setForm({ ...form, password: 'abcd' })	สเตรจเดิมอยู่, update เฉพาะ field นั้น

        setForm({
            ...form,
            [name]: value //update value ใน key นั้นๆของ event
        })
    }
    function HandleSubmit(e) {
        e.preventDefault()
        // console.log(form)
        if (form.confirmPassword !== form.password) {
            return alert('Password is not match!!!')
        }

        //Mysql
        const RegisterData = async () => {
            try {
                const res = await axios.post('http://localhost:5001/api/register',form)
                // console.log(res.data)
                toast.success(res.data)
            } catch (err) {
                const errMsg = err.response?.data?.message
                toast.error(errMsg)
                console.log(err.response.data)
            }
        }
        RegisterData()
    }
    return (
        <>
            <form onSubmit={HandleSubmit}>
                Email<input className="border" name="email" type="email" onChange={HandleChange}></input>
                Password<input className="border" name="password" type="text" onChange={HandleChange}></input>
                Confirm password<input className="border" name="confirmPassword" type="text" onChange={HandleChange}></input>
                <button className="bg-blue-400 rounded-md">Register</button>
            </form>
        </>
    )
}