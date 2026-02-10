import { useEffect, useState } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Mencegah browser menampilkan prompt default yang membosankan
      e.preventDefault();
      // Simpan event supaya bisa dipanggil nanti
      setDeferredPrompt(e);
      // Tampilkan UI custom kita
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Tampilkan prompt install asli browser
    deferredPrompt.prompt();
    // Tunggu respon user
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            
            <div className="bg-slate-800 p-3 rounded-xl">
               <img src="/icon.webp" alt="App Icon" className="w-8 h-8 object-cover rounded-lg" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">Install App</h4>
              <p className="text-slate-400 text-xs mt-0.5">Install Subs4Unlock for faster access!</p>
            </div>

            <div className="flex gap-2">
                <button
                onClick={handleInstallClick}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
                aria-label="Install App"
                >
                <FaDownload size={14} />
                </button>
                <button
                onClick={() => setShowInstallBanner(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-2.5 rounded-xl transition-colors"
                aria-label="Close"
                >
                <FaTimes size={14} />
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPWA;