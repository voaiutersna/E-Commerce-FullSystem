import { create } from "zustand";
import axios from "axios";
import { persist,createJSONStorage } from "zustand/middleware";
const EcomStore = (set)=>({
    user:null,
    token:null,
    actionLogin: async(form)=>{
        const res = await axios.post('http://localhost:5001/api/login',form)
        //updateค่า
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return (res)
    }
})

const usePersist = {
    name:"ecmon-store",
    storage:createJSONStorage(()=>localStorage)
}

const UseEcomStore = create(persist(EcomStore,usePersist))
//create() → สร้าง store → ใช้ได้ทุก component → share state → ไม่ต้อง props drilling
export default UseEcomStore

//Mysql
        // const LoginData = async () => {
        //     try {
        //         const res = await axios.post('http://localhost:5001/api/login',form)
        //         console.log(res)
        //         toast.success(res.data.message)
        //     } catch (err) {
        //         const errMsg = err.response?.data?.message
        //         toast.error(errMsg)
        //         console.log(err.response.data)
        //     }
        // }
        // LoginData()