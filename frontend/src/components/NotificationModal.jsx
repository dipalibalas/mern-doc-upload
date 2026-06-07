import { CheckCircle2, XCircle } from "lucide-react";

export default function NotificationModal({
  open,
  type = "success",
  title,
  message,
  onClose,
}) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="text-emerald-600" size={36} />
          ) : (
            <XCircle className="text-red-600" size={36} />
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

        {message && (
          <p className="mt-3 text-slate-500 text-sm leading-relaxed">{message}</p>
        )}

        <button
          type="button"
          onClick={onClose}
          className={`mt-8 w-full py-3 rounded-lg text-sm font-medium text-white transition ${
            isSuccess
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
