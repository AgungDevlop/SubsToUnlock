import { FaEnvelope, FaWhatsapp, FaTelegramPlane, FaMapMarkerAlt, FaClock, FaHeadset } from 'react-icons/fa';

export function Contact() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
            <FaHeadset className="text-3xl text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Hubungi Kami</h1>
          <p className="text-slate-400">Tim Support Subs for Unlock siap membantu Anda 24/7.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Email */}
          <a href="mailto:support@subsforunlock.com" className="group flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaEnvelope className="text-xl text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Email</h3>
            <span className="text-xs text-slate-400">support@subsforunlock.com</span>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/62881037428871" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaWhatsapp className="text-xl text-green-400" />
            </div>
            <h3 className="font-bold text-white mb-1">WhatsApp</h3>
            <span className="text-xs text-slate-400">+62 881-0374-28871</span>
          </a>

          {/* Telegram */}
          <a href="https://t.me/subsforunlock" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-6 bg-slate-800/30 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaTelegramPlane className="text-xl text-sky-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Telegram</h3>
            <span className="text-xs text-slate-400">@subsforunlock</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" /> Lokasi
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Kami berbasis di <strong>Bali, Indonesia</strong>. <br/>
              Dijalankan oleh Agung Developer. Untuk pertemuan langsung, silakan buat janji temu melalui kontak di atas.
            </p>
          </div>

          <div className="bg-slate-800/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaClock className="text-orange-400" /> Jam Operasional
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Senin - Jumat</span>
                <span className="text-white">09:00 - 17:00 WITA</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Sabtu</span>
                <span className="text-white">10:00 - 14:00 WITA</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Minggu / Libur</span>
                <span className="text-red-400">Tutup</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            Estimasi respon: <span className="text-purple-400 font-medium">24-48 jam</span> pada hari kerja.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Contact;