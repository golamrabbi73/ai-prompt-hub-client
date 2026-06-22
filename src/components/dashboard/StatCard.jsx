const StatCard = ({ label, value, icon: Icon, accent = false }) => (
  <div
    className={`flex items-center gap-4 border p-5 ${
      accent ? "border-secondary bg-secondary/5" : "border-base-300 bg-base-200"
    }`}
  >
    {Icon && (
      <span
        className={`text-2xl ${accent ? "text-secondary" : "text-base-content/40"}`}
      >
        <Icon size={22} />
      </span>
    )}
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-base-content/40">
        {label}
      </p>
      <p className="mt-0.5 font-display text-2xl font-semibold text-base-content">
        {value ?? 0}
      </p>
    </div>
  </div>
);

export default StatCard;