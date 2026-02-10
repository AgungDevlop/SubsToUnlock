import { FaExclamationTriangle, FaUserCheck, FaBan } from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-12">
        
        <div className="border-b border-white/10 pb-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Syarat & Ketentuan</h1>
          <p className="text-slate-400">Ketentuan Penggunaan Layanan Subs for Unlock</p>
        </div>

        <div className="space-y-10">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg"><FaUserCheck className="text-purple-400" /></div>
              Penggunaan Layanan
            </h2>
            <ul className="grid gap-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="bg-white/10 w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"></span>
                <span>Minimal usia 13 tahun sesuai standar platform media sosial global.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white/10 w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"></span>
                <span>Tugas sosial (Like, Subscribe, dll) harus mematuhi TOS platform terkait (YouTube, WhatsApp, dll).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-white/10 w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"></span>
                <span>Pengguna bertanggung jawab penuh atas konten yang dikunci di platform ini.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg"><FaBan className="text-red-400" /></div>
              Larangan Keras
            </h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 text-red-200/90 text-sm sm:text-base">
              <p className="mb-2 font-bold">Anda dilarang menggunakan layanan ini untuk:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Menyebarkan malware, virus, atau software berbahaya.</li>
                <li>Phishing, penipuan, atau konten ilegal.</li>
                <li>Konten dewasa, kekerasan, atau ujaran kebencian.</li>
              </ul>
              <p className="mt-3 text-xs opacity-70">Pelanggaran akan mengakibatkan pemblokiran permanen tanpa peringatan.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg"><FaExclamationTriangle className="text-yellow-400" /></div>
              Penafian (Disclaimer)
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Kami tidak menjamin bahwa semua pengguna akan menyelesaikan tugas sosial dengan sempurna. Kami bertindak sebagai perantara teknis. Ketersediaan konten tujuan adalah tanggung jawab pembuat tautan sepenuhnya. Kami berhak menghapus konten yang dilaporkan melanggar hak cipta.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-slate-500 text-xs">
              Dengan mengakses layanan ini, Anda menyetujui persyaratan di atas. <br/>
              Kami berhak mengubah ketentuan ini sewaktu-waktu.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;