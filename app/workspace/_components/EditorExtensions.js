import { chatSession } from "@/configs/AIModel";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import {
  Bold,
  Code2Icon,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  ListCollapseIcon,
  Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function EditorExtensions({ editor }) {
  const { fileId } = useParams();
  const { user } = useUser();
  const SearchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.AddNotes);

  const onAIClick = async () => {
    toast("AI is getting your answer, please wait...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ""
    );

    const result = await SearchAI({ query: selectedText, fileId: fileId });
    const unFormattedAns = JSON.parse(result);
    let AllUnformattedAns = "";
    unFormattedAns &&
      unFormattedAns.forEach((item) => {
        AllUnformattedAns = AllUnformattedAns + item.pageContent;
      });

    const PROMPT =
      "for Question :" +
      selectedText +
      "and with the given content as answer," +
      "please give appropriate ans in HTML format. The answer content is" +
      AllUnformattedAns;

    const AIModelResult = await chatSession.sendMessage(PROMPT);
    const FinalAns = AIModelResult.response
      .text()
      .replace("```", "")
      .replace("html", "")
      .replace("```", "");

    const AllText = editor.getHTML();
    editor.commands.setContent(
      AllText + "<p> <strong>Answer:</strong>" + FinalAns + "</p>"
    );

    saveNotes({
      fileId: fileId,
      notes: editor.getHTML(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    editor && (
      <div className="p-3">
        <div className="control-group">
          <div className="button-group flex gap-3">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""
              }
            >
              <Heading1 />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""
              }
            >
              <Heading2 />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""
              }
            >
              <Heading3 />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "text-blue-500" : ""}
            >
              <Bold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? "text-blue-500" : ""}
            >
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor?.isActive("highlight") ? "text-blue-500" : ""}
            >
              <Highlighter />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor?.isActive("code") ? "text-blue-500" : ""}
            >
              <Code2Icon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? "is-active" : ""}
            >
              <ListCollapseIcon />
            </button>
            <button
              onClick={() => onAIClick()}
              className={"hover:text-blue-500"}
            >
              <Sparkles />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditorExtensions;
