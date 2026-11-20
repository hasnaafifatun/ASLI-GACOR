import {
  AnnualEvalMap,
  AnnualEvalSatkerRecord,
  AuditKinerjaItem,
  MasterSatker,
  MonevActivityItem,
  MonevProgramGroup,
  MonevQuarterStatus,
  MonevQuarters,
  MonevSatkerRecord,
  PageId,
  PengawasanRegulerItem,
  RiskAssessmentRecord,
  RiskLevelCategory,
  RiskLibraryItem,
  RiskMatrixConfig,
  RiskMatrixGrid,
  UpgLevel,
} from '../types/upg';

export const PAGE_META: Record<
  PageId,
  { title: string; crumb: string; subtitle: string }
> = {
  'pengawasan-reguler': {
    title: 'Daftar Obrik > Pengawasan Reguler',
    crumb: 'Pengawasan Reguler',
    subtitle: 'Pengawasan Reguler Badan Pengawasan Mahkamah Agung RI',
  },
  'audit-kinerja': {
    title: 'Audit Kinerja / Daftar Obrik',
    crumb: 'Audit Kinerja',
    subtitle: 'Audit Kinerja Badan Pengawasan Mahkamah Agung RI',
  },
  'ppg-risiko': {
    title: 'Penilaian Risiko Gratifikasi',
    crumb: 'PPG / Penilaian Risiko Gratifikasi',
    subtitle: 'Program Pengendalian Gratifikasi (PPG)',
  },
  'ppg-dashboard': {
    title: 'Dashboard PPG',
    crumb: 'PPG / Dashboard PPG',
    subtitle: 'Monitoring Penilaian Risiko & Evaluasi Tahunan PPG',
  },
  'ppg-monev': {
    title: 'Monev PPG',
    crumb: 'PPG / Monev PPG',
    subtitle: 'Matriks Monitoring Triwulanan Program Pengendalian Gratifikasi',
  },
};

export const UPG_LEVELS: UpgLevel[] = [
  'UPG Tingkat 1',
  'UPG Tingkat 2',
  'UPG Tingkat 3',
];

export function makeSatkerUniqueId(upgLevel: UpgLevel, kodeSatker: number): string {
  return `${upgLevel}::${kodeSatker}`;
}

export const MASTER_SATKER_LIST: MasterSatker[] = [
  // UPG TINGKAT 1 (Kode 1..6)
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 1),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 1,
    namaSatker: 'Badan Pengawasan',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 2),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 2,
    namaSatker:
      'Badan Strategi Kebijakan dan Pendidikan dan Pelatihan Hukum dan Peradilan',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 3),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 3,
    namaSatker: 'Badan Urusan Administrasi',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 4),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 4,
    namaSatker: 'Direktorat Jenderal Badan Peradilan Agama',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 5),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 5,
    namaSatker:
      'Direktorat Jenderal Badan Peradilan Militer dan Peradilan Tata Usaha Negara',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 1', 6),
    upgLevel: 'UPG Tingkat 1',
    kodeSatker: 6,
    namaSatker: 'Direktorat Jenderal Badan Peradilan Umum',
  },

  // UPG TINGKAT 2 (Kode 1..6)
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 1),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 1,
    namaSatker: 'Pengadilan Tinggi Ambon',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 2),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 2,
    namaSatker: 'Pengadilan Tinggi Aceh',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 3),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 3,
    namaSatker: 'Pengadilan Tinggi Jakarta',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 4),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 4,
    namaSatker: 'Pengadilan Tinggi Jawa Tengah',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 5),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 5,
    namaSatker: 'Pengadilan Tinggi Surabaya',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 2', 6),
    upgLevel: 'UPG Tingkat 2',
    kodeSatker: 6,
    namaSatker: 'Pengadilan Tinggi Yogyakarta',
  },

  // UPG TINGKAT 3 (Kode 1..7)
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 1),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 1,
    namaSatker: 'Pengadilan Negeri Bandung',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 2),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 2,
    namaSatker: 'Pengadilan Negeri Bantul',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 3),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 3,
    namaSatker: 'Pengadilan Negeri Jakarta Pusat',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 4),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 4,
    namaSatker: 'Pengadilan Agama Semarang',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 5),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 5,
    namaSatker: 'Pengadilan Agama Jakarta Pusat',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 6),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 6,
    namaSatker: 'Pengadilan Tata Usaha Negara Yogyakarta',
  },
  {
    uniqueId: makeSatkerUniqueId('UPG Tingkat 3', 7),
    upgLevel: 'UPG Tingkat 3',
    kodeSatker: 7,
    namaSatker: 'Pengadilan Militer III-10 Surabaya',
  },
];

export const RISK_CONTROL_LIBRARY: RiskLibraryItem[] = [
  {
    kodeRisiko: 'PPG.RK.1',
    pernyataanRisiko:
      'Petugas menerima uang terima kasih atau fasilitas dari pengguna layanan untuk mempercepat layanan.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Pelayanan Publik',
    faktorPenyebab: 'Sistem',
    penyebabRisiko: [
      'Tarif resmi dan alur PTSP kurang terlihat.',
      'Interaksi di luar kanal resmi tidak tercatat.',
    ],
    dampakRisiko: [
      'Kesetaraan layanan, integritas aparatur, dan kepercayaan publik terganggu.',
    ],
    mandatoryControls: ['Pembentukan Tim UPG'],
  },
  {
    kodeRisiko: 'PPG.RK.2',
    pernyataanRisiko:
      'Pihak berperkara menitipkan bingkisan hari raya kepada hakim atau aparatur yang menangani perkara.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Penanganan Perkara',
    faktorPenyebab: 'Individu dan lingkungan kerja',
    penyebabRisiko: [
      'Adanya kedekatan atau hubungan personal antara pihak berperkara dengan hakim atau aparatur.',
      'Kurangnya pemahaman dan kepatuhan terhadap ketentuan gratifikasi.',
      'Belum optimalnya pelaporan dan pengendalian penerimaan bingkisan.',
    ],
    dampakRisiko: [
      'Independensi dan objektivitas penanganan perkara terganggu.',
      'Integritas hakim dan aparatur peradilan dipertanyakan.',
      'Menurunnya kepercayaan masyarakat terhadap lembaga peradilan.',
    ],
    mandatoryControls: [
      'Pembentukan Tim UPG',
      'Penyusunan Pedoman Internal dan SOP',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.3',
    pernyataanRisiko:
      'Aparatur menerima pemberian atau jamuan makan dari penyedia barang/jasa dalam proses pengadaan.',
    klasifikasiRisiko: 'Pengadaan Barang dan Jasa',
    prosesSubproses: 'Pemilihan dan Pelaksanaan Kontrak PBJ',
    faktorPenyebab: 'Sistem dan interaksi eksternal',
    penyebabRisiko: [
      'Interaksi informal antara PPK/Pokja dengan penyedia di luar forum resmi.',
      'Belum optimalnya penerapan pakta integritas pengadaan.',
    ],
    dampakRisiko: [
      'Objektivitas pemilihan penyedia dan kualitas hasil pengadaan terganggu.',
      'Berpotensi menimbulkan kerugian keuangan negara.',
    ],
    mandatoryControls: [
      'Penyusunan Pedoman Internal dan SOP',
      'Sosialisasi internal kepada seluruh pegawai',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.4',
    pernyataanRisiko:
      'Panitera atau jurusita menerima uang transport tambahan di luar ketentuan resmi saat pelaksanaan panggilan atau eksekusi.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Panggilan Sidang dan Eksekusi Putusan',
    faktorPenyebab: 'Individu dan lingkungan kerja',
    penyebabRisiko: [
      'Kurangnya transparansi informasi panjar biaya perkara kepada pihak berperkara.',
      'Minimnya pengawasan lapangan terhadap pelaksanaan tugas jurusita.',
    ],
    dampakRisiko: [
      'Timbulnya praktik pungutan liar dan pelanggaran kode etik aparatur.',
      'Menurunnya kepercayaan publik terhadap proses peradilan.',
    ],
    mandatoryControls: [
      'Briefing PTSP',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.5',
    pernyataanRisiko:
      'Hakim atau aparatur menerima fasilitas akomodasi, tiket perjalanan, atau hiburan dari pihak yang memiliki kepentingan perkara atau pekerjaan.',
    klasifikasiRisiko: 'Benturan Kepentingan',
    prosesSubproses: 'Penanganan Perkara dan Kedinasan',
    faktorPenyebab: 'Individu',
    penyebabRisiko: [
      'Kurangnya pemahaman batasan fasilitas yang dilarang dalam ketentuan gratifikasi.',
      'Tidak adanya mekanisme pelaporan segera atas tawaran fasilitas dari pihak luar.',
    ],
    dampakRisiko: [
      'Independensi hakim dan aparatur terancam.',
      'Reputasi lembaga peradilan tercemar.',
    ],
    mandatoryControls: [
      'E-learning Peningkatan Pemahaman Gratifikasi',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.6',
    pernyataanRisiko:
      'Petugas PTSP menerima imbalan dalam pengurusan salinan putusan, surat keterangan, atau legalisasi dokumen.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Pelayanan Terpadu Satu Pintu (PTSP)',
    faktorPenyebab: 'Sistem',
    penyebabRisiko: [
      'Informasi standar waktu layanan dan PNBP belum tersampaikan secara jelas.',
      'Pengawasan langsung atasan pada loket layanan belum rutin dilakukan.',
    ],
    dampakRisiko: [
      'Diskriminasi kecepatan layanan bagi pengguna layanan.',
      'Terganggunya integritas layanan publik peradilan.',
    ],
    mandatoryControls: ['Briefing PTSP', 'Pembentukan Tim UPG'],
  },
  {
    kodeRisiko: 'PPG.RK.7',
    pernyataanRisiko:
      'Pejabat atau pegawai menerima hadiah pada acara keluarga (pernikahan, khitanan, syukuran) dari pihak berperkara atau mitra kerja yang memiliki konflik kepentingan.',
    klasifikasiRisiko: 'Benturan Kepentingan',
    prosesSubproses: 'Relasi Sosial dan Kedinasan',
    faktorPenyebab: 'Budaya dan lingkungan kerja',
    penyebabRisiko: [
      'Anggapan bahwa pemberian dalam acara pribadi selalu diperbolehkan.',
      'Kurangnya pemahaman kewajiban pelaporan gratifikasi terkait jabatan.',
    ],
    dampakRisiko: [
      'Terjadinya konflik kepentingan dalam pengambilan keputusan kedinasan.',
      'Pelanggaran ketentuan pelaporan gratifikasi.',
    ],
    mandatoryControls: [
      'Sosialisasi internal kepada seluruh pegawai',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.8',
    pernyataanRisiko:
      'Aparatur menerima komisi, rabat, atau potongan harga khusus dari rekanan terkait pengelolaan anggaran atau perjalanan dinas.',
    klasifikasiRisiko: 'Pengelolaan Keuangan',
    prosesSubproses: 'Pelaksanaan Anggaran dan Perjalanan Dinas',
    faktorPenyebab: 'Sistem dan Individu',
    penyebabRisiko: [
      'Verifikasi bukti pertanggungjawaban keuangan belum ketat.',
      'Belum ada larangan tegas dan pemantauan terhadap pemberian cashback/komisi rekanan.',
    ],
    dampakRisiko: [
      'Pemborosan anggaran dan potensi temuan pemeriksaan.',
      'Menurunnya akuntabilitas pengelolaan keuangan satuan kerja.',
    ],
    mandatoryControls: [
      'Penyusunan Pedoman Internal dan SOP',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.9',
    pernyataanRisiko:
      'Pejabat pengambil keputusan menerima pemberian dalam proses mutasi, promosi, atau rekrutmen pegawai/PPNPN.',
    klasifikasiRisiko: 'Manajemen SDM',
    prosesSubproses: 'Mutasi, Promosi, dan Rekrutmen',
    faktorPenyebab: 'Individu dan tata kelola',
    penyebabRisiko: [
      'Proses penilaian kinerja dan seleksi belum sepenuhnya transparan.',
      'Adanya upaya pendekatan personal dari kandidat kepada pejabat penilai.',
    ],
    dampakRisiko: [
      'Penempatan SDM tidak berbasis meritokrasi.',
      'Menurunnya moral dan kepercayaan internal pegawai.',
    ],
    mandatoryControls: [
      'Pembentukan Tim UPG',
      'Sosialisasi internal kepada seluruh pegawai',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.10',
    pernyataanRisiko:
      'Mediator atau petugas layanan mediasi menerima tanda terima kasih dari salah satu pihak yang bersengketa.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Pelaksanaan Mediasi Perkara',
    faktorPenyebab: 'Individu',
    penyebabRisiko: [
      'Interaksi intensif dalam ruang mediasi tertutup tanpa pengawasan memadai.',
      'Kurangnya edukasi kepada para pihak mengenai layanan mediasi bebas imbalan.',
    ],
    dampakRisiko: [
      'Netralitas dan objektivitas proses mediasi terganggu.',
      'Merusak citra layanan penyelesaian sengketa peradilan.',
    ],
    mandatoryControls: [
      'Sosialisasi internal kepada seluruh pegawai',
      'E-learning Peningkatan Pemahaman Gratifikasi',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.11',
    pernyataanRisiko:
      'Petugas pengelolaan barang bukti atau lelang menerima gratifikasi dari peserta lelang atau pihak terkait.',
    klasifikasiRisiko: 'Penanganan Perkara',
    prosesSubproses: 'Pengelolaan Barang Bukti dan Lelang Eksekusi',
    faktorPenyebab: 'Sistem dan Individu',
    penyebabRisiko: [
      'Akses informasi barang lelang atau barang bukti tidak sepenuhnya terkendali.',
      'Minimnya audit berkala atas administrasi barang bukti dan lelang.',
    ],
    dampakRisiko: [
      'Terjadinya keberpihakan dalam proses lelang atau pengelolaan barang bukti.',
      'Potensi pelanggaran hukum dan gugatan dari pihak yang dirugikan.',
    ],
    mandatoryControls: [
      'Penyusunan Pedoman Internal dan SOP',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.12',
    pernyataanRisiko:
      'Aparatur menerima parsel, voucher belanja, atau uang elektronik dari instansi mitra atau kuasa hukum menjelang hari besar keagamaan.',
    klasifikasiRisiko: 'Benturan Kepentingan',
    prosesSubproses: 'Relasi Kelembagaan dan Advokat',
    faktorPenyebab: 'Budaya kerja',
    penyebabRisiko: [
      'Tradisi pemberian bingkisan hari raya masih dianggap wajar.',
      'Belum efektifnya himbauan penolakan gratifikasi menjelang hari besar.',
    ],
    dampakRisiko: [
      'Melemahkan budaya integritas aparatur peradilan.',
      'Menimbulkan persepsi publik adanya perlakuan khusus bagi pemberi.',
    ],
    mandatoryControls: [
      'Sosialisasi internal kepada seluruh pegawai',
      'Laporan UPG secara berjenjang',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.13',
    pernyataanRisiko:
      'Pejabat atau tim pemeriksa menerima fasilitas atau cenderamata bernilai ekonomis saat melaksanakan pengawasan atau pembinaan ke satuan kerja.',
    klasifikasiRisiko: 'Pengawasan Internal',
    prosesSubproses: 'Pengawasan Reguler dan Pembinaan',
    faktorPenyebab: 'Budaya dan lingkungan kerja',
    penyebabRisiko: [
      'Satuan kerja yang diperiksa memberikan jamuan atau oleh-oleh sebagai bentuk penghormatan.',
      'Kurangnya penegasan kode etik pengawasan sebelum penugasan.',
    ],
    dampakRisiko: [
      'Independensi dan objektivitas hasil pengawasan menurun.',
      'Temuan pengawasan berpotensi tidak dilaporkan secara akurat.',
    ],
    mandatoryControls: [
      'Penyusunan Pedoman Internal dan SOP',
      'E-learning Peningkatan Pemahaman Gratifikasi',
    ],
  },
  {
    kodeRisiko: 'PPG.RK.14',
    pernyataanRisiko:
      'Petugas keamanan atau resepsionis menerima tips dari advokat atau pengunjung untuk mengatur akses pertemuan non-prosedural dengan hakim atau pejabat.',
    klasifikasiRisiko: 'Sektor Layanan Publik',
    prosesSubproses: 'Keamanan dan Tata Kelola Akses Tamu',
    faktorPenyebab: 'Sistem dan pengawasan',
    penyebabRisiko: [
      'Prosedur buku tamu dan pengendalian akses area terbatas belum ditegakkan konsisten.',
      'Kurangnya pemahaman petugas garda depan mengenai larangan gratifikasi.',
    ],
    dampakRisiko: [
      'Terbukanya celah pertemuan tidak sah yang mengancam independensi hakim.',
      'Pelanggaran Sistem Manajemen Anti Penyuapan (SMAP).',
    ],
    mandatoryControls: ['Briefing PTSP', 'Pembentukan Tim UPG'],
  },
  {
    kodeRisiko: 'PPG.RK.15',
    pernyataanRisiko:
      'Aparatur menerima honorarium, sponsorship, atau fasilitas narasumber yang tidak sesuai ketentuan dan berpotensi menimbulkan benturan kepentingan.',
    klasifikasiRisiko: 'Benturan Kepentingan',
    prosesSubproses: 'Kegiatan Eksternal dan Pengembangan Kompetensi',
    faktorPenyebab: 'Individu',
    penyebabRisiko: [
      'Belum adanya verifikasi atas undangan narasumber dari pihak eksternal.',
      'Kurangnya pemahaman batas kewajaran honorarium dan pelaporan gratifikasi.',
    ],
    dampakRisiko: [
      'Munculnya ketergantungan atau keberpihakan kepada pihak penyelenggara.',
      'Pelanggaran disiplin pegawai dan ketentuan pengendalian gratifikasi.',
    ],
    mandatoryControls: [
      'E-learning Peningkatan Pemahaman Gratifikasi',
      'Laporan UPG secara berjenjang',
    ],
  },
];

export const PROBABILITY_OPTIONS = [
  {
    value: 1,
    label: 'Level 1 – Kemungkinan Tidak Terjadi (1% - 10%)',
    shortDesc: 'KEMUNGKINAN TIDAK TERJADI',
    range: '1% - 10%',
  },
  {
    value: 2,
    label: 'Level 2 – Kemungkinan Kecil (11% - 30%)',
    shortDesc: 'KEMUNGKINAN KECIL',
    range: '11% - 30%',
  },
  {
    value: 3,
    label: 'Level 3 – Mungkin (31% - 50%)',
    shortDesc: 'MUNGKIN',
    range: '31% - 50%',
  },
  {
    value: 4,
    label: 'Level 4 – Kemungkinan Besar (51% - 90%)',
    shortDesc: 'KEMUNGKINAN BESAR',
    range: '51% - 90%',
  },
  {
    value: 5,
    label: 'Level 5 – Hampir Pasti Terjadi (91% - 99%)',
    shortDesc: 'HAMPIR PASTI TERJADI',
    range: '91% - 99%',
  },
] as const;

export const IMPACT_OPTIONS = [
  { value: 1, label: 'Level 1 – Sangat Rendah', shortDesc: 'SANGAT RENDAH' },
  { value: 2, label: 'Level 2 – Rendah', shortDesc: 'RENDAH' },
  { value: 3, label: 'Level 3 – Sedang', shortDesc: 'SEDANG' },
  { value: 4, label: 'Level 4 – Tinggi', shortDesc: 'TINGGI' },
  { value: 5, label: 'Level 5 – Sangat Tinggi', shortDesc: 'SANGAT TINGGI' },
] as const;

export const RISK_STATUS_TABLE: {
  category: RiskLevelCategory;
  deskripsi: string;
  level: number;
  rangeNilai: string;
}[] = [
  {
    category: 'Ekstrim/Sangat Tinggi',
    deskripsi: 'EKSTRIM/SANGAT TINGGI',
    level: 5,
    rangeNilai: '15 S/D 25',
  },
  {
    category: 'Tinggi',
    deskripsi: 'TINGGI',
    level: 4,
    rangeNilai: '10 S/D 12',
  },
  {
    category: 'Moderat',
    deskripsi: 'MODERAT',
    level: 3,
    rangeNilai: '5 S/D 9',
  },
  {
    category: 'Rendah',
    deskripsi: 'RENDAH',
    level: 2,
    rangeNilai: '3 S/D 4',
  },
  {
    category: 'Sangat Rendah',
    deskripsi: 'SANGAT RENDAH',
    level: 1,
    rangeNilai: '1 S/D 2',
  },
];

export function createDefaultRiskMatrix(): RiskMatrixConfig {
  const grid: RiskMatrixGrid = {
    // Matriks Analisis Risiko 5x5 (Skala Kemungkinan x Dampak)
    '1-1': 'Sangat Rendah', // 1
    '1-2': 'Sangat Rendah', // 2
    '1-3': 'Rendah', // 3
    '1-4': 'Rendah', // 4
    '1-5': 'Moderat', // 5
    '2-1': 'Sangat Rendah', // 2
    '2-2': 'Rendah', // 4
    '2-3': 'Moderat', // 6
    '2-4': 'Moderat', // 8
    '2-5': 'Tinggi', // 10
    '3-1': 'Rendah', // 3
    '3-2': 'Moderat', // 6
    '3-3': 'Moderat', // 9
    '3-4': 'Tinggi', // 12
    '3-5': 'Ekstrim/Sangat Tinggi', // 15
    '4-1': 'Rendah', // 4
    '4-2': 'Moderat', // 8
    '4-3': 'Tinggi', // 12
    '4-4': 'Ekstrim/Sangat Tinggi', // 16
    '4-5': 'Ekstrim/Sangat Tinggi', // 20
    '5-1': 'Moderat', // 5
    '5-2': 'Tinggi', // 10
    '5-3': 'Ekstrim/Sangat Tinggi', // 15
    '5-4': 'Ekstrim/Sangat Tinggi', // 20
    '5-5': 'Ekstrim/Sangat Tinggi', // 25
  };
  return {
    updatedAt: '',
    note: 'Matriks Analisis Risiko 5x5 sesuai ketentuan yang berlaku.',
    grid,
  };
}

export function getMatrixRiskCategory(
  matrix: RiskMatrixConfig,
  prob: number | '',
  impact: number | ''
): RiskLevelCategory | null {
  if (prob === '' || impact === '') return null;
  return matrix.grid[`${prob}-${impact}`] ?? 'Moderat';
}

export function isValidHttpsUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

export function isRiskAssessmentComplete(record: RiskAssessmentRecord): boolean {
  if (!record.satkerUniqueId || !record.kodeRisiko) return false;
  if (record.inherentProb === '' || record.inherentImpact === '') return false;
  if (record.residualProb === '' || record.residualImpact === '') return false;
  if (!record.controls || record.controls.length === 0) return false;

  return record.controls.every(
    (ctrl) =>
      ctrl.klaimEfektivitas !== 'Belum Dinilai' &&
      isValidHttpsUrl(ctrl.buktiKlaim) &&
      ctrl.catatanKlaim.trim().length > 0 &&
      ctrl.tahun.trim().length > 0 &&
      ctrl.periode.trim().length > 0
  );
}

// Program & Kegiatan sesuai gambar Matriks Evaluasi Tahunan & Matriks Monitoring Triwulanan
export const MONEV_ACTIVITIES: MonevActivityItem[] = [
  {
    code: '1.1',
    name: 'Pembentukan Tim UPG',
    weight: 2.5,
    parentGroup: '1',
  },
  {
    code: '1.2',
    name: 'Penyusunan Pedoman Internal dan SOP',
    weight: 2.5,
    parentGroup: '1',
  },
  {
    code: '2.1.1',
    name: 'Sosialisasi internal kepada seluruh pegawai',
    weight: 5,
    parentGroup: '2',
    subGroup: '2.1',
  },
  {
    code: '2.1.2',
    name: 'Briefing PTSP',
    weight: 2.5,
    parentGroup: '2',
    subGroup: '2.1',
  },
  {
    code: '3.3',
    name: 'E-learning Peningkatan Pemahaman Gratifikasi',
    weight: 8,
    parentGroup: '3',
  },
  {
    code: '6.1',
    name: 'Laporan UPG secara berjenjang',
    weight: 5,
    parentGroup: '6',
  },
];

export const MONEV_PROGRAMS: MonevProgramGroup[] = [
  {
    code: '1',
    name: 'PERANGKAT PENGENDALIAN GRATIFIKASI',
    weight: 5,
    items: ['1.1', '1.2'],
  },
  {
    code: '2',
    name: 'SOSIALISASI PENGENDALIAN GRATIFIKASI',
    weight: 25,
    subGroup: {
      code: '2.1',
      name: 'Sosialisasi Internal',
      weight: 12.5,
      items: ['2.1.1', '2.1.2'],
    },
    items: ['2.1.1', '2.1.2'],
  },
  {
    code: '3',
    name: 'DISEMINASI PENGENDALIAN GRATIFIKASI',
    weight: 20,
    items: ['3.3'],
  },
  {
    code: '6',
    name: 'PELAPORAN GRATIFIKASI',
    weight: 10,
    items: ['6.1'],
  },
];

export const MONEV_STATUS_OPTIONS: MonevQuarterStatus[] = [
  'Belum Dimulai',
  'Dalam Proses',
  'Selesai',
  'Terkendala',
  '—',
];

export function createEmptyMonevStatuses(): Record<string, MonevQuarters> {
  const map: Record<string, MonevQuarters> = {};
  MONEV_ACTIVITIES.forEach((act) => {
    map[act.code] = [
      'Belum Dimulai',
      'Belum Dimulai',
      'Belum Dimulai',
      'Belum Dimulai',
    ];
  });
  return map;
}

export function createDefaultMonevRecord(
  year: string,
  satker: MasterSatker
): MonevSatkerRecord {
  return {
    key: `${year}::${satker.uniqueId}`,
    year,
    satkerUniqueId: satker.uniqueId,
    upgLevel: satker.upgLevel,
    kodeSatker: satker.kodeSatker,
    namaSatker: satker.namaSatker,
    statuses: createEmptyMonevStatuses(),
    updatedAt: '',
  };
}

export function createInitialAnnualEval(): AnnualEvalMap {
  const map: AnnualEvalMap = {};
  MONEV_ACTIVITIES.forEach((act) => {
    map[act.code] = {
      score: '',
      valid: 'Belum diisi',
      evidence: '',
      note: '',
    };
  });
  return map;
}

export function createDefaultAnnualEvalRecord(
  year: string,
  satker: MasterSatker
): AnnualEvalSatkerRecord {
  return {
    key: `${year}::${satker.uniqueId}`,
    year,
    satkerUniqueId: satker.uniqueId,
    upgLevel: satker.upgLevel,
    kodeSatker: satker.kodeSatker,
    namaSatker: satker.namaSatker,
    entries: createInitialAnnualEval(),
    updatedAt: '',
  };
}

export const INITIAL_PENGAWASAN_REGULER: PengawasanRegulerItem[] = [
  {
    id: 'pr-1',
    namaObrik: 'PENGADILAN NEGERI SAUMLAKI',
    tanggalPelaksanaanST: '17 Agustus 2026',
    status: 'Proses pemeriksaan',
    laporanPdf: 'LHP_PN_Saumlaki_2026.pdf',
    monitoringZI: '',
    kendaliMutu: '',
    tanggapanAuditee: '',
    lhpBab2: '',
  },
  {
    id: 'pr-2',
    namaObrik: 'PENGADILAN AGAMA TUBAN',
    tanggalPelaksanaanST: '10 Agustus 2026',
    status: 'Proses pemeriksaan',
    laporanPdf: 'LHP_PA_Tuban_2026.pdf',
    monitoringZI: '',
    kendaliMutu: '',
    tanggapanAuditee: '',
    lhpBab2: '',
  },
  {
    id: 'pr-3',
    namaObrik: 'PENGADILAN AGAMA SERANG',
    tanggalPelaksanaanST: '18 Mei 2026',
    status: 'Proses pemeriksaan',
    laporanPdf: 'LHP_PA_Serang_2026.pdf',
    monitoringZI: '',
    kendaliMutu: '',
    tanggapanAuditee: '',
    lhpBab2: '',
  },
];

export const INITIAL_AUDIT_KINERJA: AuditKinerjaItem[] = [
  {
    id: 'ak-1',
    idTeam: '1960',
    namaObrik: 'PENGADILAN AGAMA GARUT',
    tanggalPelaksanaan: '27 Juli 2026',
    status: 'Proses pemeriksaan',
    lhePdf: 'LHE_PA_Garut_1960.pdf',
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
  {
    id: 'ak-2',
    idTeam: '1852',
    namaObrik: 'PENGADILAN AGAMA KOTA TASIKMALAYA',
    tanggalPelaksanaan: '29 Juni 2026',
    status: 'Proses pemeriksaan',
    lhePdf: 'LHE_PA_Tasikmalaya_1852.pdf',
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
  {
    id: 'ak-3',
    idTeam: '1825',
    namaObrik: 'PENGADILAN AGAMA SERUI',
    tanggalPelaksanaan: '22 Juni 2026',
    status: 'Proses pemeriksaan',
    lhePdf: 'LHE_PA_Serui_1825.pdf',
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
  {
    id: 'ak-4',
    idTeam: '1421',
    namaObrik: 'PENGADILAN NEGERI WATANSOPPENG',
    tanggalPelaksanaan: '19 Mei 2025',
    status: 'Proses pemeriksaan',
    lhePdf: 'LHE_PN_Watansoppeng_1421.pdf',
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
  {
    id: 'ak-5',
    idTeam: '965',
    namaObrik: 'PENGADILAN NEGERI MUARA ENIM',
    tanggalPelaksanaan: '22 Oktober 2024',
    status: 'Proses pemeriksaan',
    lhePdf: 'LHE_PN_MuaraEnim_965.pdf',
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
  {
    id: 'ak-6',
    idTeam: '931',
    namaObrik: 'PENGADILAN NEGERI TOBELO',
    tanggalPelaksanaan: '17 September 2024',
    status: 'Proses pemeriksaan',
    lhePdf: null,
    kinerja: '',
    kendaliMutu: '',
    monitoringZI: '',
    hasil: '',
    notisi: '',
    laporan: '',
  },
];

export function exportMonevExcel(record: MonevSatkerRecord) {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const cellBg = (status: MonevQuarterStatus) => {
    if (status === 'Selesai') return '#e2efda';
    if (status === 'Dalam Proses') return '#fff2cc';
    if (status === 'Terkendala') return '#fde8e8';
    return '#ffffff';
  };

  let bodyRows = '';
  MONEV_PROGRAMS.forEach((prog) => {
    bodyRows += `
      <tr style="background:#e8f2fa;font-weight:bold;">
        <td>${escapeHtml(prog.code)}</td>
        <td colspan="5">${escapeHtml(prog.name)}</td>
      </tr>
    `;
    if (prog.subGroup) {
      bodyRows += `
        <tr style="background:#f5f9fd;font-weight:bold;">
          <td>${escapeHtml(prog.subGroup.code)}</td>
          <td colspan="5">${escapeHtml(prog.subGroup.name)}</td>
        </tr>
      `;
    }
    prog.items.forEach((code) => {
      const act = MONEV_ACTIVITIES.find((a) => a.code === code);
      if (!act) return;
      const qs = record.statuses[code] ?? [
        'Belum Dimulai',
        'Belum Dimulai',
        'Belum Dimulai',
        'Belum Dimulai',
      ];
      bodyRows += `
        <tr>
          <td>${escapeHtml(act.code)}</td>
          <td>${escapeHtml(act.name)}</td>
          ${qs
            .map(
              (q) =>
                `<td style="text-align:center;background:${cellBg(q)};">${escapeHtml(q)}</td>`
            )
            .join('')}
        </tr>
      `;
    });
  });

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head><meta charset="UTF-8" /></head>
  <body>
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">
      <tr>
        <th colspan="6" style="background:#1f4e78;color:#ffffff;font-size:14px;text-align:left;">
          MATRIKS MONITORING TRIWULANAN PROGRAM PENGENDALIAN GRATIFIKASI
        </th>
      </tr>
      <tr>
        <td><b>Tahun Pelaksanaan</b></td>
        <td colspan="5">${escapeHtml(record.year)}</td>
      </tr>
      <tr>
        <td><b>Nama UPG</b></td>
        <td colspan="5">${escapeHtml(record.upgLevel)}</td>
      </tr>
      <tr>
        <td><b>Nama Satker</b></td>
        <td colspan="5">${escapeHtml(record.namaSatker)}</td>
      </tr>
      <tr style="background:#0f6f73;color:#ffffff;font-weight:bold;">
        <th>No.</th>
        <th>Program/Kegiatan/Subkegiatan</th>
        <th>TW I</th>
        <th>TW II</th>
        <th>TW III</th>
        <th>TW IV</th>
      </tr>
      ${bodyRows}
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\ufeff' + html], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Monev_PPG_${record.year}_${record.namaSatker.replace(/\s+/g, '_')}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportAnnualMonevExcel(record: AnnualEvalSatkerRecord) {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  let bodyRows = '';
  MONEV_PROGRAMS.forEach((prog) => {
    bodyRows += `
      <tr style="background:#e8f2fa;font-weight:bold;">
        <td>${escapeHtml(prog.code)}</td>
        <td>${escapeHtml(prog.name)}</td>
        <td style="text-align:right;">${prog.weight}</td>
        <td>—</td>
        <td>—</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
    if (prog.subGroup) {
      bodyRows += `
        <tr style="background:#f5f9fd;font-weight:bold;">
          <td>${escapeHtml(prog.subGroup.code)}</td>
          <td>${escapeHtml(prog.subGroup.name)}</td>
          <td style="text-align:right;">${prog.subGroup.weight}</td>
          <td>—</td>
          <td>—</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `;
    }
    prog.items.forEach((code) => {
      const act = MONEV_ACTIVITIES.find((a) => a.code === code);
      if (!act) return;
      const e = record.entries[code];
      const sc = e?.score ?? '';
      const cap =
        sc === '' || !act.weight
          ? '—'
          : `${((Number(sc) / act.weight) * 100).toFixed(0)}%`;
      bodyRows += `
        <tr>
          <td>${escapeHtml(act.code)}</td>
          <td>${escapeHtml(act.name)}</td>
          <td style="text-align:right;">${act.weight ?? ''}</td>
          <td style="text-align:right;">${sc === '' ? '—' : sc}</td>
          <td style="text-align:right;">${cap}</td>
          <td>${escapeHtml(e?.valid ?? 'Belum diisi')}</td>
          <td>${escapeHtml(e?.evidence ?? '')}</td>
          <td>${escapeHtml(e?.note ?? '')}</td>
        </tr>
      `;
    });
  });

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head><meta charset="UTF-8" /></head>
  <body>
    <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">
      <tr>
        <th colspan="8" style="background:#1f4e78;color:#ffffff;font-size:14px;text-align:left;">
          MATRIKS EVALUASI TAHUNAN PROGRAM PENGENDALIAN GRATIFIKASI
        </th>
      </tr>
      <tr>
        <td><b>Tahun evaluasi</b></td>
        <td colspan="3">${escapeHtml(record.year)}</td>
        <td><b>Tingkat UPG</b></td>
        <td colspan="3">${escapeHtml(record.upgLevel)}</td>
      </tr>
      <tr>
        <td><b>Nama Satker</b></td>
        <td colspan="7">${escapeHtml(record.namaSatker)}</td>
      </tr>
      <tr style="background:#0f6f73;color:#ffffff;font-weight:bold;">
        <th>No.</th>
        <th>Program/Kegiatan/Subkegiatan</th>
        <th>Bobot (%)</th>
        <th>Nilai Perolehan</th>
        <th>Capaian</th>
        <th>Keberlakuan UPG</th>
        <th>Bukti Dukung</th>
        <th>Catatan/Verifikasi</th>
      </tr>
      ${bodyRows}
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\ufeff' + html], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Monev_Evaluasi_Tahunan_PPG_${record.year}_${record.namaSatker.replace(/\s+/g, '_')}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}
