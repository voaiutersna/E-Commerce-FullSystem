import Link from "next/link"
export default function LayoutGuest() {
    return (
        <nav className="bg-green-400">
            <div className="mx-auto px-4">
                <div className="flex flex-row justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href={'/'} className="font-bold text-2xl">LOGO</Link>
                        <Link href={'/'}>Home</Link>
                        <Link href={'/'}>Shop</Link>
                        <Link href={'/'}>Cart</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href={'/register'}>Register</Link>
                        <Link href={'/login'}>Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}