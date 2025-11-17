import "./globals.css";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function layout({children}:{children:React.ReactNode}){
  return(
    <html>
      <body>
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}