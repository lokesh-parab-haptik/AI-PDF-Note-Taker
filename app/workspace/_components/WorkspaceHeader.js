import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";

import { useMutation } from "convex/react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

function WorkspaceHeader({ fileName, fileId, editor }) {
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const handleSave = () => {
    saveNotes({
      fileId: fileId,
      notes: editor.getHTML(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    toast.success("Notes Saved Successfully");
  };

  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      <Image src={"/logo.svg"} alt="logo" width={80} height={50} />
      <h2 className="text-2xl font-bold">{fileName}</h2>
      <div className="flex gap-5">
        <Button onClick={handleSave}>Save</Button>
        <UserButton />
      </div>
    </div>
  );
}

export default WorkspaceHeader;
