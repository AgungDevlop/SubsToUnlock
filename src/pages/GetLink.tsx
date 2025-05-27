import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAngleDoubleRight } from 'react-icons/fa';

// Array tautan acak (sama seperti di PageLink.tsx)
const randomLinks = [
  "https://obqj2.com/4/9277726",
  "https://offensive-beat.com/b.3tV/0pP/3Mp/vabsmOVzJzZcD/0m2fMczqEE0GOoTHc-yNLXT/YrzvMhTfQI5UNpz/Mj",
];

export function GetLink() {
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load ad script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://ptichoolsougn.net/401/9372886';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup: Remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Ambil URL dari session storage
    const url = sessionStorage.getItem('targetUrl');
    if (url) {
      setTargetUrl(url);
    } else {
      setError('No target URL found. Please go back and try again.');
    }
  }, []);

  const handleGetLinkClick = () => {
    if (targetUrl) {
      // Buka URL target di tab baru
      window.open(targetUrl, '_blank');
      // Setelah 2 detik, alihkan tab lama ke tautan acak
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomLinks.length);
        window.location.href = randomLinks[randomIndex];
      }, 2000);
    }
  };

  // Pisahkan teks "Get Link" menjadi huruf-huruf dan tambahkan ikon
  const text = "Get Link".split('');
  const totalElements = text.length + 1; // +1 untuk ikon

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-700 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Target Link</h1>
        {targetUrl ? (
          <motion.button
            onClick={handleGetLinkClick}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(255, 255, 255, 0.2)",
                "0 0 10px 5px rgba(255, 255, 255, 0.4)",
                "0 0 20px 10px rgba(255, 255, 255, 0.3)",
                "0 0 30px 15px rgba(255, 255, 255, 0.2)",
                "0 0 20px 10px rgba(255, 255, 255, 0.3)",
                "0 0 10px 5px rgba(255, 255, 255, 0.4)",
                "0 0 0 0 rgba(255, 255, 255, 0.2)",
              ], // Efek ombak memancar
            }}
            transition={{
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeOut" },
            }}
            className="relative inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-64 text-lg"
          >
            <div className="flex items-center justify-center">
              {text.map((char, index) => (
                <motion.span
                  key={`char-${index}`}
                  className="font-bold"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  animate={{
                    color: ["#ffffff", "#1e3a8a", "#ffffff"], // Putih ke biru tua ke putih
                  }}
                  transition={{
                    color: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                      delay: index * (2 / totalElements), // Penundaan berurutan
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                animate={{
                  color: ["#ffffff", "#1e3a8a", "#ffffff"], // Putih ke biru tua ke putih
                }}
                transition={{
                  color: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                    delay: text.length * (2 / totalElements), // Penundaan untuk ikon
                  },
                }}
              >
                <FaAngleDoubleRight className="ml-2 w-6 h-6" />
              </motion.span>
            </div>
          </motion.button>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 mx-auto"></div>
        )}
      </div>
    </motion.div>
  );
}

export default GetLink;