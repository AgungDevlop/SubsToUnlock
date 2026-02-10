import { FaCheckCircle, FaCode, FaShieldAlt, FaUsers, FaBolt } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Tentang Kami
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Platform inovatif untuk kreator Indonesia meningkatkan interaksi sosial dan mengamankan konten eksklusif.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
            <FaBolt className="text-3xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Proses Cepat</h3>
            <p className="text-slate-400 text-sm">Pembuatan tautan dan pengaturan tugas sosial yang instan dan mudah.</p>
          </div>
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
            <FaShieldAlt className="text-3xl text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aman & Transparan</h3>
            <p className="text-slate-400 text-sm">Keamanan data dan integritas layanan adalah prioritas utama kami.</p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaUsers className="text-purple-500" /> Fitur Unggulan
          </h2>
          <ul className="grid gap-4 sm:grid-cols-1">
            {[
              "Penguncian tautan dengan tugas sosial (Subscribe, Join Group, Follow).",
              "Dukungan multi-platform: YouTube, WhatsApp, Telegram, TikTok, Instagram.",
              "Pembuatan key unik untuk setiap konten.",
              "Antarmuka yang ramah pengguna untuk kreator dan audiens."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <FaCheckCircle className="text-purple-500 mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 border-l-4 border-purple-500">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FaCode className="text-blue-400" /> Developer Note
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
            Dikembangkan oleh <strong>Agung Developer</strong> dari Bali. Kami berkomitmen mendukung pembuat konten membangun audiens autentik. Subs for Unlock menggabungkan manfaat bagi kreator dan pengguna dengan sistem <code className="bg-slate-700 px-1.5 py-0.5 rounded text-purple-300 text-xs font-mono">/e/key-unik</code> yang efisien.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;