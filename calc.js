// Sub Trayek/Odo Time Calculator
(function(){
  const $ = id => document.getElementById(id);

  // Input elements
  const subDistInput = $('subDist');
  const subTimeInput = $('subTimeMin');
  const subSpeedInput = $('subSpeedKmh');
  const subStartTimeInput = $('subStartTime');
  const subComputeBtn = $('subComputeBtn');
  const subResultEl = $('subResult');

  function pad2(n){ return String(n).padStart(2,'0'); }

  function parseStartTime(str) {
    // Accept HH:mm or HH:mm:ss
    if(!str) return null;
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(str.trim());
    if(!m) return null;
    const h = Number(m[1]), min=Number(m[2]), s=m[3]?Number(m[3]):0;
    if(h<0||h>23||min<0||min>59||s<0||s>59) return null;
    return { h, min, s };
  }

  function formatArrival(start, durSec) {
    // start: {h,min,s}, durSec: number
    let d = new Date();
    d.setHours(start.h, start.min, start.s || 0, 0);
    d = new Date(d.getTime() + Math.round(durSec*1000));
    return pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds());
  }

  function mmssFromMinutes(mins) {
    const m = Math.floor(mins);
    const s = Math.round((mins - m) * 60);
    return pad2(m) + ":" + pad2(s);
  }

  function fmt(n, d=2) { return Number(n).toFixed(d); }

  function compute() {
    // 1. Ambil input
    const distance_km = parseFloat(subDistInput.value);
    const speed_kmh = parseFloat(subSpeedInput.value);
    const subTimeMin = parseFloat(subTimeInput.value);
    const start_time_str = subStartTimeInput.value.trim();

    // Validasi minimal jarak dan start_time
    if(!Number.isFinite(distance_km) || distance_km <= 0) {
      show('Masukkan Jarak Sub (>0).', 'sub-warn'); return;
    }
    const start_time = parseStartTime(start_time_str);
    if(!start_time) {
      show('Masukkan Waktu Mulai Sub format HH:mm atau HH:mm:ss.', 'sub-warn'); return;
    }

    let v_kmh = speed_kmh;
    let computedFromDT = false;

    // Jika speed kosong, coba hitung dari waktu sub
    if((!Number.isFinite(v_kmh) || v_kmh<=0) && Number.isFinite(subTimeMin) && subTimeMin>0) {
      v_kmh = distance_km / (subTimeMin/60);
      computedFromDT = true;
    }

    if(!Number.isFinite(v_kmh) || v_kmh<=0) {
      show('Masukkan Kecepatan Sub (>0) atau lengkapi Jarak & Waktu Sub.', 'sub-warn'); return;
    }

    // Durasi tempuh (menit)
    const travel_minutes_decimal = distance_km * 60 / v_kmh;
    const travel_time_mm_ss = mmssFromMinutes(travel_minutes_decimal);

    // Arrival time (jam resmi)
    const arrival_time = formatArrival(start_time, travel_minutes_decimal * 60);

    // Steps/rumus
    let formula = "minutes = distance_km × 60 / speed_kmh";
    let note_seconds = "seconds = fractional_minutes × 60";
    let warn = '';

    if(computedFromDT && Number.isFinite(speed_kmh) && speed_kmh>0) {
      const vFromDT = distance_km/(subTimeMin/60);
      const diffPct = Math.abs(vFromDT - speed_kmh)/vFromDT*100;
      if(diffPct>1) {
        warn = `<div class="sub-warn">Peringatan: v dari D/T = ${fmt(vFromDT,2)} km/jam ≠ input v = ${fmt(speed_kmh,2)} km/jam (${fmt(diffPct,2)}%). Dipakai: hasil D/T.</div>`;
      } else {
        warn = `<div class="sub-ok">Konsisten: v dari D/T ≈ input v.</div>`;
      }
    }

    // Tampilkan hasil
    show(`
      <b>Durasi tempuh:</b> ${travel_time_mm_ss} (${fmt(travel_minutes_decimal,2)} menit)<br>
      <b>Waktu tiba (resmi):</b> ${arrival_time}<br>
      <span class="formula"><b>Rumus:</b> ${formula}<br>
      minutes_exact: ${fmt(travel_minutes_decimal,6)}, seconds_exact: ${fmt((travel_minutes_decimal%1)*60,3)}<br>
      ${note_seconds}</span>
      ${warn}
    `, 'sub-ok');
  }

  function show(html, cls){
    subResultEl.innerHTML = html;
    subResultEl.style.display = '';
    subResultEl.className = 'sub-result ' + (cls||'');
  }

  subComputeBtn.addEventListener('click', compute);

  // Enter key on any sub input = hitung
  [subDistInput, subTimeInput, subSpeedInput, subStartTimeInput].forEach(inp=>{
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter') compute(); });
  });

})();
