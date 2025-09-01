/**
 * Hitung waktu absolut di posisi saat ini berdasarkan jarak odo, kecepatan, dan waktu start sub trayek.
 * @param {number} odoTrip - Jarak odo trip dalam kilometer
 * @param {number} kecepatan - Kecepatan (km/jam)
 * @param {string} waktuStart - Waktu mulai sub trayek format 'HH:mm'
 * @returns {string} - Waktu hasil dalam format 'HH:mm:ss'
 */
export function hitungWaktuAbsolut(odoTrip: number, kecepatan: number, waktuStart: string): string {
    // Hitung waktu tempuh (menit)
    const waktuTempuhMenit = (odoTrip * 60) / kecepatan;
    const menit = Math.floor(waktuTempuhMenit);
    const detik = Math.round((waktuTempuhMenit - menit) * 60);

    // Pecah waktu start
    const [jamStart, menitStart] = waktuStart.split(':').map(Number);

    // Tambahkan menit dan detik ke waktu start
    let totalMenit = jamStart * 60 + menitStart + menit;
    let jam = Math.floor(totalMenit / 60);
    let menitAkhir = totalMenit % 60;
    let detikAkhir = detik;

    // Jika detik >= 60, tambah ke menit
    if (detikAkhir >= 60) {
        menitAkhir += Math.floor(detikAkhir / 60);
        detikAkhir = detikAkhir % 60;
    }

    // Jika menit >= 60, tambah ke jam
    if (menitAkhir >= 60) {
        jam += Math.floor(menitAkhir / 60);
        menitAkhir = menitAkhir % 60;
    }

    // Format output dua digit
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(jam)}:${pad(menitAkhir)}:${pad(detikAkhir)}`;
}
