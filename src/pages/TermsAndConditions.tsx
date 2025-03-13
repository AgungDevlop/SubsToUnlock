const TermsAndConditions = () => (
  <div className="container mx-auto p-4 text-white pb-20">
    <h1 className="text-3xl font-bold mb-4">Syarat dan Ketentuan Subs for Unlock</h1>

    <h2 className="text-2xl font-bold mt-6 mb-4">Penggunaan Layanan</h2>
    <p>Dengan menggunakan Subs for Unlock, Anda setuju dengan syarat dan ketentuan berikut:</p>
    <ul className="list-disc pl-5 mb-4">
      <li>Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini, sesuai dengan ketentuan umum platform media sosial.</li>
      <li>Anda bertanggung jawab atas semua tautan, tugas sosial, dan konten yang Anda kunci melalui layanan ini.</li>
      <li>Anda dilarang menggunakan layanan ini untuk menyebarkan konten ilegal, menipu, atau melanggar hukum yang berlaku.</li>
      <li>Tindakan sosial yang Anda tetapkan (misalnya subscribe, like, atau join) harus sesuai dengan kebijakan masing-masing platform (YouTube, WhatsApp, dll.).</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-4">Pembuatan dan Penguncian Konten</h2>
    <ul className="list-disc pl-5 mb-4">
      <li>Anda dapat mengunci tautan atau konten dengan menetapkan tugas sosial seperti berlangganan ke channel YouTube, bergabung ke grup WhatsApp, atau mengikuti akun media sosial.</li>
      <li>Setiap data yang Anda unggah akan menghasilkan `key` unik yang digunakan untuk mengakses konten terkunci melalui URL (contoh: `/e/02d23a4112`).</li>
      <li>Kami tidak bertanggung jawab atas konten yang Anda kunci atau tindakan pengguna yang gagal memenuhi tugas sosial.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-4">Kebijakan Konten</h2>
    <p>Kami berhak menghapus atau menangguhkan akses ke konten yang Anda kunci jika melanggar hak cipta, mengandung materi berbahaya, atau melanggar hukum tanpa pemberitahuan sebelumnya. Anda menjamin bahwa konten atau tautan yang Anda unggah adalah milik Anda atau Anda memiliki izin untuk membagikannya.</p>

    <h2 className="text-2xl font-bold mt-6 mb-4">Tanggung Jawab Pengguna</h2>
    <ul className="list-disc pl-5 mb-4">
      <li>Pengguna yang mengakses URL Subs for Unlock bertanggung jawab untuk menyelesaikan tugas sosial yang ditetapkan agar dapat membuka konten.</li>
      <li>Kami tidak menjamin bahwa semua pengguna akan menyelesaikan tugas sosial atau bahwa konten Anda akan selalu tersedia.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-6 mb-4">Perubahan Syarat</h2>
    <p>Kami dapat memperbarui syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan di situs web kami, dan penggunaan layanan setelah perubahan berarti Anda menerima syarat yang baru.</p>
  </div>
);

export default TermsAndConditions;