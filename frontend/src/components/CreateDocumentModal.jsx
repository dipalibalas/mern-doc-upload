import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CreateDocumentModal({
  open,
  onClose,
  onCreate,
  isLoading = false,
}) {
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-bold text-xl text-slate-900">New document</h2>
        <p className="text-sm text-slate-500 mt-2">
          Give your document a title to get started.
        </p>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Document title"
          className="mt-4 border border-slate-300 p-3 rounded-lg w-full text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter") handleCreate();
          }}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={handleClose}
            className="border border-slate-300 px-4 py-2 rounded-lg text-sm"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading || !title.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
