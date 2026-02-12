import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaAngleDoubleRight, FaExclamationTriangle, FaLink, FaArrowLeft } from 'react-icons/fa';
import { SEO } from "../components/SEO";

const randomLinks = [
  "https://otieu.com/4/10055984",
];

export function GetLink() {
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = sessionStorage.getItem('targetUrl');
    if (url) {
      setTargetUrl(url);
    } else {
      setError('Target link session has expired or is invalid.');
    }
  }, []);

  const handleGetLinkClick = useCallback(() => {
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomLinks.length);
        window.location.href = randomLinks[randomIndex];
      }, 2000);
    }
  }, [targetUrl]);

  const text = "Get Link".split('');
  const totalElements = text.length + 1;

  if (error) {
    return (
      <>
        <SEO title="Error | Subs 4 Unlock" description="Access Denied" />
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <FaExclamationTriangle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-200 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-8 max-w-xs">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all active:scale-95"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Get Link | Subs 4 Unlock" 
        description="Your destination link is ready. Proceed securely."
      />
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-center relative z-10"
        >
          <div className="w-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FaLink className="text-3xl text-violet-400" />
          </div>

          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">LINK READY</h1>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            Your destination link is prepared. Click the button below to proceed.
          </p>

          {targetUrl ? (
            <div className="relative group">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-violet-600 blur-2xl rounded-2xl"
              />
              
              <motion.button
                onClick={handleGetLinkClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-1 overflow-hidden border-t border-white/20"
              >
                <div className="flex items-center">
                  {text.map((char, index) => (
                    <motion.span
                      key={`char-${index}`}
                      animate={{
                        color: ["#ffffff", "#c7d2fe", "#ffffff"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * (2 / totalElements),
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                      color: ["#ffffff", "#c7d2fe", "#ffffff"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: text.length * (2 / totalElements),
                    }}
                  >
                    <FaAngleDoubleRight className="ml-3 text-2xl" />
                  </motion.span>
                </div>
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-violet-500"></div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Validating Session</p>
            </div>
          )}
        </motion.div>

        <footer className="mt-12 text-center opacity-30 relative z-10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Protected by Subs4Unlock System
          </p>
        </footer>
      </div>
    </>
  );
}

export default GetLink;