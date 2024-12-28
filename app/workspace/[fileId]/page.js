"use client";
import { useParams } from "next/navigation";
import React from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../_components/TextEditor";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

function Workspace() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start Taking your notes here..." }),
      Highlight.configure({ color: "#ffc078" }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus: outline-none h-screen p-5",
      },
    },
  });
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: fileId,
  });

  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);

  return (
    <div>
      <WorkspaceHeader
        fileName={fileInfo?.fileName}
        fileId={fileId}
        editor={editor}
      />
      <div className="grid grid-cols-2">
        <div>
          <TextEditor fileId={fileId} editor={editor} />
        </div>
        <div>
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
