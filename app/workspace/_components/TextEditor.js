import React from "react";
import { EditorContent } from "@tiptap/react";
import EditorExtensions from "./EditorExtensions";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

function TextEditor({ fileId, editor }) {
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  useEffect(() => {
    editor && editor.commands.setContent(notes);
  }, [notes && editor]);

  return (
    <div>
      <EditorExtensions editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;
