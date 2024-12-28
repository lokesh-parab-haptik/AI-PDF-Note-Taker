"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UploadPdfDialog from "./_components/UploadPdfDialog";

function Dashboard() {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-2xl">Workspace</h2>
        <UploadPdfDialog />
      </div>
      <div className="flex gap-5 mt-5">
        {fileList?.length > 0
          ? fileList?.map((file, index) => (
              <Link
                href={`/workspace/${file.fileId}`}
                key={index}
                className="mt-5 p-10 border shadow-md hover:bg-slate-100 rounded-lg cursor-pointer h-[180px] w-[200px]"
              >
                <Image
                  className="mx-auto"
                  src={"/pdf.png"}
                  alt="file"
                  width={80}
                  height={80}
                />
                <h2 className="text-lg text-center mt-4">{file.fileName}</h2>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <div
                key={index}
                className="bg-slate-200 rounded-md h-[180px] w-[400px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Dashboard;
