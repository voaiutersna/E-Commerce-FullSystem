import "./globals.css";
import Link from "next/link";

export default function layout({children}:{children:React.ReactNode}){
  return(
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}