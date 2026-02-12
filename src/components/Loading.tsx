import { FaCircleNotch } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-violet-500">
      <FaCircleNotch className="text-4xl animate-spin" />
    </div>
  );
};

export default Loading;