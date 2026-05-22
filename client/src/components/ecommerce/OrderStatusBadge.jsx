const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  processing: "bg-sky-50 text-sky-800 border-sky-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  cancelled: "bg-red-50 text-red-800 border-red-200",
};

export default function OrderStatusBadge({ status }) {
  const key = String(status || "pending").toLowerCase();
  const style =
    STATUS_STYLES[key] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${style}`}
    >
      {status || "pending"}
    </span>
  );
}
