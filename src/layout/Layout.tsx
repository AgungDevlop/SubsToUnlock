import { FaLink } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 bg-purple-800 text-white flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Subs 4 Unlock</h1>
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

      {/* Main Content */}
      <main className="flex-1 text-white pt-20 bg-gradient-to-b from-purple-900 to-gray-900">
        {children}
      </main>
    </div>
  );
};

export default Layout;