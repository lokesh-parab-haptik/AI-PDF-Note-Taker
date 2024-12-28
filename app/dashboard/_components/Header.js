import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="flex justify-between p-5 shadow-sm">
      <Image src={"./logo.svg"} alt="logo" width={80} height={50} />
      <h1 className="text-2xl font-bold">AI PDF Notes App</h1>
      <UserButton />
    </div>
  );
}

export default Header;
