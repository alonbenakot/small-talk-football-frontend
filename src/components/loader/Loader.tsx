const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-xs">
      <div className="absolute left-1/2" style={{ top: "30%", transform: "translateX(-50%)" }}>
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-700 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-emerald-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-emerald-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
