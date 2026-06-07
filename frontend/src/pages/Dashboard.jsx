import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DocumentCard from "../components/DocumentCard";
import CreateDocumentModal from "../components/CreateDocumentModal";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const [createOpen, setCreateOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "all";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await api.get("/documents");
      return res.data;
    },
  });

  const filteredDocuments = useMemo(() => {
    if (!user?._id) return data;

    return data.filter((doc) => {
      const ownerId = doc.owner?._id || doc.owner;
      const isOwner = ownerId?.toString() === user._id.toString();

      if (view === "owned") return isOwner;
      if (view === "shared") return !isOwner;
      return true;
    });
  }, [data, user, view]);

  const createMutation = useMutation({
    mutationFn: async (title) => {
      const res = await api.post("/documents", { title });
      return res.data;
    },
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document created");
      setCreateOpen(false);
      navigate(`/editor/${doc._id}`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to create document"));
    },
  });

  const viewTitle =
    view === "owned"
      ? "My documents"
      : view === "shared"
        ? "Shared with me"
        : "All documents";

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{viewTitle}</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Create, edit, import, and share documents with your team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 self-start"
          >
            <FilePlus size={18} />
            New document
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            Loading documents...
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {getErrorMessage(error, "Failed to load documents")}
          </div>
        )}

        {!isLoading && !isError && filteredDocuments.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              No documents yet
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              {view === "shared"
                ? "Documents shared with you will appear here."
                : "Create a blank document or import a .txt, .md, or .docx file from the sidebar."}
            </p>
            {view !== "shared" && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Create your first document
              </button>
            )}
          </div>
        )}

        {!isLoading && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} />
            ))}
          </div>
        )}

        <CreateDocumentModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={(title) => createMutation.mutate(title)}
          isLoading={createMutation.isPending}
        />
      </div>
    </MainLayout>
  );
}
