import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";

const ACCEPTED_TYPES = ".txt,.md,.docx";

export default function UploadModal({
  open,
  onClose,
  documentId = null,
  importIntoDocument = false,
  onComplete,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      if (importIntoDocument && documentId) {
        formData.append(
          "importContent",
          importIntoDocument ? "true" : "false",
        );
        const res = await api.post(
          `/documents/${documentId}/attach`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return res.data;
      }

      const res = await api.post("/documents/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      if (documentId) {
        queryClient.invalidateQueries({
          queryKey: ["document", documentId],
        });
      }

      toast.success(
        importIntoDocument
          ? "File attached and content imported"
          : "Document imported successfully",
      );

      setSelectedFile(null);
      onClose();
      onComplete?.(data);

      if (!documentId && data?._id) {
        navigate(`/editor/${data._id}`);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Upload failed"));
    },
  });

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please choose a file first");
      return;
    }

    uploadMutation.mutate(selectedFile);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-bold text-xl text-slate-900">
          {importIntoDocument ? "Import into document" : "Import new document"}
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Supported formats: <strong>.txt</strong>, <strong>.md</strong>,{" "}
          <strong>.docx</strong> (max 5MB). DOCX files are converted to plain
          text for editing.
        </p>

        <label className="mt-5 border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition">
          <UploadCloud className="text-blue-600" size={36} />

          <span className="mt-3 text-sm text-slate-600">
            {selectedFile ? selectedFile.name : "Click to choose a file"}
          </span>

          <input
            type="file"
            hidden
            accept={ACCEPTED_TYPES}
            onChange={(event) =>
              setSelectedFile(event.target.files?.[0] || null)
            }
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-300 px-4 py-2 rounded-lg text-sm"
            disabled={uploadMutation.isPending}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {uploadMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {importIntoDocument ? "Import content" : "Create document"}
          </button>
        </div>
      </div>
    </div>
  );
}
