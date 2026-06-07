import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const ToolbarButton = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
    }`}
  >
    {children}
  </button>
);

export default function RichEditor({ content, onChange, editable = true }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {editable && (
        <div className="flex flex-wrap gap-2 p-3 border-b border-slate-200 bg-slate-50">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarButton>

          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="underline">U</span>
          </ToolbarButton>

          <span className="w-px h-8 bg-slate-200 mx-1" />

          <ToolbarButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </ToolbarButton>

          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </ToolbarButton>

          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </ToolbarButton>

          <span className="w-px h-8 bg-slate-200 mx-1" />

          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            • List
          </ToolbarButton>

          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            1. List
          </ToolbarButton>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="min-h-[480px] p-5 prose prose-slate max-w-none text-left [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[440px]"
      />
    </div>
  );
}
