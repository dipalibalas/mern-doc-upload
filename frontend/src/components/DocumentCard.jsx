import { useState } from "react";
import {
  FileText,
  MoreVertical,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ShareModal from "./ShareModal";

const formatDate = (value) => {
  if (!value) return "Recently updated";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function DocumentCard({ doc }) {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const ownerId = doc.owner?._id || doc.owner;
  const isOwner = ownerId?.toString() === user?._id?.toString();
  const isShared = !isOwner;

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/documents/${doc._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      showNotification({
        type: "success",
        title: "Document deleted",
        message: `"${doc.title}" was removed successfully.`,
      });
    },
    onError: (error) => {
      showNotification({
        type: "error",
        title: "Delete failed",
        message: getErrorMessage(error, "Failed to delete document"),
      });
    },
  });

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(false);

    if (window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
        <Link to={`/editor/${doc._id}`} className="block p-5">
          <div className="flex justify-between items-start gap-2">
            <FileText className="text-blue-600 shrink-0" size={22} />

            <div className="flex items-center gap-1 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isShared
                    ? "bg-violet-100 text-violet-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isShared ? "Shared with me" : "Owned"}
              </span>

              {isOwner && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setMenuOpen((open) => !open);
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
                    aria-label="Document options"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setMenuOpen(false);
                          setShareOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Share2 size={16} />
                        Share
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <h3 className="mt-4 font-semibold text-lg text-slate-900 text-left line-clamp-2">
            {doc.title}
          </h3>

          <p className="text-sm text-slate-500 mt-2 text-left">
            {formatDate(doc.updatedAt)}
          </p>

          {doc.sharedWith?.length > 0 && isOwner && (
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 text-left">
              <Users size={14} />
              Shared with {doc.sharedWith.length}{" "}
              {doc.sharedWith.length === 1 ? "person" : "people"}
            </p>
          )}
        </Link>
      </div>

      <ShareModal
        documentId={doc._id}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onShared={() =>
          queryClient.invalidateQueries({ queryKey: ["documents"] })
        }
      />
    </>
  );
}
