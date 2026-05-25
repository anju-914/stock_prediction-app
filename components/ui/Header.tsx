import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/ui/NavItems";
import UserDropdown from "@/components/ui/UserDropdown";

const Header = ({ user }:{ user: User }) => {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/icons/logo.svg" alt="Stockly logo" width={32} height={32} className="h-8 w-auto cursor-pointer" style={{ width: "auto" }} />
                    <span className="text-white font-semibold text-xl">Stockly</span>
                </Link>
                <nav className= "hidden sm:block">
                    <NavItems />
                </nav>
                <UserDropdown  user={user}/>
            </div>
        </header>
    )
}
export default Header


