import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect, useState } from "react";

interface BlockNoteEditorProps {
  setIssue: (issue: any) => void;
}

export default function BlockNoteEditor({ setIssue }: BlockNoteEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const editor = useCreateBlockNote();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded"></div>;
  }

  return (
          <BlockNoteView
      //@ts-ignore
      editor={editor}
      sideMenu={false}
      theme="light"
      onChange={() => {
        setIssue(editor.document);
      }}
    />
  );
}
