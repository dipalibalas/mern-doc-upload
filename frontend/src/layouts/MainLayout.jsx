import { useState } from "react";
import Sidebar from "../components/Sidebar";
import UploadModal from "../components/UploadModal";

export default function MainLayout({ children }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar onUploadClick={() => setUploadOpen(true)} />

      <main className="flex-1 min-w-0">{children}</main>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </div>
  );
}
