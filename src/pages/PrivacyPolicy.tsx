import {FaUserSecret, FaDatabase, FaLock } from 'react-icons/fa';
import { SEO } from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy | Subs 4 Unlock" 
        description="Learn how Subs 4 Unlock handles your data, privacy, and security."
        url="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto pb-20">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-12">
          
          <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Kebijakan Privasi</h1>
            <p className="text-slate-400">Terakhir diperbarui: {new Date().getFullYear()}</p>
          </div>

          <div className="space-y-10">
            <section>
              <p className="text-slate-300 leading-relaxed">
                Kami di <span className="text-purple-400 font-bold">Subs 4 Unlock</span> berkomitmen untuk melindungi informasi pribadi Anda. Dokumen ini menjelaskan transparansi pengelolaan data saat Anda menggunakan layanan pembuka tautan eksklusif kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaUserSecret className="text-purple-500" /> Informasi yang Dikumpulkan
              </h2>
              <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5">
                <ul className="space-y-3 text-slate-300 text-sm sm:text-base">
                  <li className="flex gap-3">
                    <span className="font-bold text-white min-w-[120px]">Data Identifikasi:</span>
                    <span>Alamat IP, jenis perangkat, dan browser (User Agent).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-white min-w-[120px]">Data Interaksi:</span>
                    <span>Status tugas sosial (Subscribe, Like, Follow) untuk verifikasi akses.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-white min-w-[120px]">Data Log:</span>
                    <span>Waktu akses, tautan yang dibuat, dan tautan yang dibuka.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaDatabase className="text-blue-500" /> Penggunaan Informasi
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-blue-500">
                <li>Memverifikasi penyelesaian tugas sosial secara otomatis.</li>
                <li>Menganalisis performa sistem dan mendeteksi anomali trafik.</li>
                <li>Mencegah penyalahgunaan layanan (spam/bot).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLock className="text-green-500" /> Keamanan & Hak Anda
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  Kami menggunakan enkripsi SSL/TLS standar industri. Data Anda tidak diperjualbelikan ke pihak ketiga untuk pemasaran.
                </p>
                <p>
                  Anda berhak meminta penghapusan jejak data digital Anda dengan menghubungi: 
                  <a href="mailto:support@subs4unlock.com" className="text-purple-400 hover:text-purple-300 ml-1 font-medium transition-colors">
                    support@subs4unlock.com
                  </a>
                </p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;