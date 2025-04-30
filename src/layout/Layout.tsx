import { FaLink } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 bg-purple-800 text-white flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center">
          <div className="relative group">
            <img
              src="/icon.webp"
              alt="Subs 4 Unlock Icon"
              className="w-8 h-8 sm:w-10 sm:h-10 mr-2 object-contain filter drop-shadow-[0_0_1px_rgba(139,92,246,1)] drop-shadow-[0_0_2px_rgba(59,130,246,1)] group-hover:drop-shadow-[0_0_6px_rgba(139,92,246,0.9)] transition-all duration-300"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Subs 4 Unlock</h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-200"
          >
            <FaLink className="mr-2" />
            Create Link
          </button>
        </div>
      </header>

      /* Main Content */
      <main className="flex-1 text-white pt-20 bg-gradient-to-b from-purple-900 to-gray-900">
        {children}
      </main>
    </div>
  );
};

export default Layout;