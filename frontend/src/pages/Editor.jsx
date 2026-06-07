import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Save,
  Share2,
  Upload,
} from "lucide-react";
import api, { getErrorMessage } from "../api/axios";
import { UPLOADS_URL } from "../utils/contact";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import RichEditor from "../components/RichEditor";
import ShareModal from "../components/ShareModal";
import UploadModal from "../components/UploadModal";
import MainLayout from "../layouts/MainLayout";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

const normalizeContent = (content) => {
  if (content && typeof content === "object" && content.type === "doc") {
    return content;
  }

  return EMPTY_DOC;
};

export default function Editor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const contentRef = useRef(EMPTY_DOC);
  const titleRef = useRef("");

  const { data: document, isLoading, isError, error } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const res = await api.get(`/documents/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!document) return;

    const normalized = normalizeContent(document.content);
    const nextTitle = document.title || "";

    setTitle(nextTitle);
    titleRef.current = nextTitle;
    contentRef.current = normalized;
    setIsDirty(false);
    setEditorResetKey((key) => key + 1);
  }, [document?._id]);

  const ownerId = document?.owner?._id || document?.owner;
  const isOwner = ownerId?.toString() === user?._id?.toString();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/documents/${id}`, {
        title: titleRef.current.trim(),
        content: contentRef.current,
      });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["document", id], updated);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsDirty(false);
      showNotification({
        type: "success",
        title: "Document updated",
        message: `"${updated.title}" was saved successfully.`,
      });
      navigate('/')
    },
    onError: (err) => {
      showNotification({
        type: "error",
        title: "Update failed",
        message: getErrorMessage(err, "Failed to save document"),
      });
    },
  });

  const handleTitleChange = (value) => {
    setTitle(value);
    titleRef.current = value;
    setIsDirty(true);
  };

  const handleContentChange = (value) => {
    contentRef.current = value;
    setIsDirty(true);
  };

  const handleImportComplete = (updated) => {
    if (updated?.content) {
      const normalized = normalizeContent(updated.content);
      contentRef.current = normalized;
      queryClient.setQueryData(["document", id], updated);
      setEditorResetKey((key) => key + 1);
      setIsDirty(false);
    } else {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading document...
        </div>
      </MainLayout>
    );
  }

  if (isError || !document) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto p-8 text-left">
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-red-700 text-sm">
            {getErrorMessage(error, "Document not found or access denied")}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 text-sm"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </MainLayout>
    );
  }

  const initialContent = normalizeContent(document.content);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6 md:p-8 w-full text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to documents
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="border border-slate-300 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white"
                >
                  <Share2 size={16} />
                  Share
                </button>

                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="border border-slate-300 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white"
                >
                  <Upload size={16} />
                  Import file
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {saveMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isDirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              isOwner
                ? "bg-emerald-100 text-emerald-700"
                : "bg-violet-100 text-violet-700"
            }`}
          >
            {isOwner ? "You own this document" : "Shared with you"}
          </span>

          {isDirty && (
            <span className="text-xs text-amber-600">Unsaved changes</span>
          )}
        </div>

        <input
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Document title"
          className="w-full border border-slate-300 p-3 rounded-lg mb-4 text-2xl font-semibold text-slate-900 bg-white"
        />

        <RichEditor
          initialContent={initialContent}
          resetKey={editorResetKey}
          onChange={handleContentChange}
        />

        {document.attachments?.length > 0 && (
          <div className="mt-6 bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Attachments
            </h3>
            <ul className="space-y-1">
              {document.attachments.map((file) => (
                <li key={file}>
                  <a
                    href={`${UPLOADS_URL}/${file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {file.replace(/^\d+-/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ShareModal
          documentId={id}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          onShared={() =>
            queryClient.invalidateQueries({ queryKey: ["document", id] })
          }
        />

        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          documentId={id}
          importIntoDocument
          onComplete={handleImportComplete}
        />
      </div>
    </MainLayout>
  );
}
