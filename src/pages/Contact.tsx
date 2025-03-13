export function Contact() {
  return (
    <div className="container mx-auto p-4 text-white pb-20">
      <h1 className="text-3xl font-bold mb-4">Hubungi Kami - Subs for Unlock</h1>
      <p>Kami di Subs for Unlock siap membantu Anda dengan pertanyaan, dukungan teknis, atau saran terkait layanan kami. Jika Anda adalah pembuat konten yang ingin memanfaatkan platform ini untuk meningkatkan interaksi sosial atau pengguna yang membutuhkan bantuan dengan konten terkunci, jangan ragu untuk menghubungi kami!</p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Kontak Kami</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@subsforunlock.com" className="text-purple-400 hover:underline">
            support@subsforunlock.com
          </a>
        </li>
        <li>
          <strong>WhatsApp:</strong>{' '}
          <a href="https://wa.me/62881037428871" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            +62881037428871
          </a>
        </li>
        <li>
          <strong>Telegram:</strong>{' '}
          <a href="https://t.me/subsforunlock" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            @subsforunlock
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-6 mb-4">Lokasi</h2>
      <p>Kami berbasis di Bali, Indonesia, dan dijalankan oleh Agung Developer. Untuk pertemuan langsung, silakan hubungi kami terlebih dahulu melalui salah satu kontak di atas.</p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Jam Operasional</h2>
      <p>Senin - Jumat: 09:00 - 17:00 WITA (Waktu Indonesia Tengah)<br />Sabtu: 10:00 - 14:00 WITA<br />Minggu dan Hari Libur Nasional: Tutup</p>

      <p className="mt-4">Kami berkomitmen untuk menjawab pertanyaan Anda secepat mungkin, biasanya dalam waktu 24-48 jam pada hari kerja. Terima kasih telah memilih Subs for Unlock!</p>
    </div>
  );
}

export default Contact;