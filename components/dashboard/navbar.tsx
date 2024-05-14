import Logo from "../logo";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white/5 py-3 px-[1rem] md:px-[5rem] lg:px-[10rem] h-full flex items-center flex-row justify-between">
        <div>
          <Logo />
        </div>

        <div>
          <UserButton />
        </div>
      </nav>
    </>
  );
}
