"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });

    console.log(result);
  };

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <h2 className="text-6xl font-bold text-center">
        Simplify PDF Note-Taking
      </h2>
      <h2 className="text-6xl font-bold text-blue-900 text-center">
        with AI-Powered
      </h2>
      <Link href={"/dashboard"}>
        <Button className="text-sm rounded-lg h-12 w-48">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
