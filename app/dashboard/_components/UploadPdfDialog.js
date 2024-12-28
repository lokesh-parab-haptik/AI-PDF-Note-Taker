"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import uuid4 from "uuid4";

function UploadPdfDialog() {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntryToDb = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [open, setOpen] = useState(false);

  const OnFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    setLoading(true);
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId = uuid4();
    const fileUrl = await getFileUrl({ storageId: storageId });
    const res = await addFileEntryToDb({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName ?? "Untitled File",
      fileUrl: fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    // API Call to PDF process Data
    const apiRes = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
    await embeddDocument({
      splitText: apiRes.data.result,
      fileId: fileId,
    });
    setOpen(false);
    setLoading(false);
    toast.success("File Uploaded Successfully");
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="w-[200px]">
          + Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className="mt-5">Select a file to Upload</h2>
              <div className="flex gap-2 items-center border p-3 hover:bg-slate-100 rounded-md cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => OnFileSelect(e)}
                />
              </div>
              <div className="mt-2">
                <label>File Name *</label>
                <Input
                  placeholder="File Name"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div className="mt-5 flex justify-end">
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={onUpload} disabled={loading}>
                    {loading && <Loader2Icon className="animate-spin mr-2" />}
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdfDialog;
