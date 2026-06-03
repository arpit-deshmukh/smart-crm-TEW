const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;