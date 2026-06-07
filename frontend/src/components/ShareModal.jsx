import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";

export default function ShareModal({ documentId, open, onClose, onShared }) {
  const [email, setEmail] = useState("");

  const shareMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/documents/${documentId}/share`, { email });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Document shared successfully");
      setEmail("");
      onShared?.();
      onClose();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to share document"));
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-bold text-xl text-slate-900">Share document</h2>
        <p className="text-sm text-slate-500 mt-2">
          Enter the email of a registered user to grant edit access.
        </p>

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="collaborator@example.com"
          className="border border-slate-300 w-full p-3 rounded-lg mt-4 text-sm"
        />

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-300 py-2.5 rounded-lg text-sm"
            disabled={shareMutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => shareMutation.mutate()}
            disabled={shareMutation.isPending || !email.trim()}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {shareMutation.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
