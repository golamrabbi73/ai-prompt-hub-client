const ChartCard = ({ title, children }) => (
  <div className="border border-base-300 bg-base-200 p-5">
    <h3 className="mb-4 font-mono text-[11px] uppercase tracking-wider text-base-content/50">
      {title}
    </h3>
    {children}
  </div>
);

export default ChartCard;