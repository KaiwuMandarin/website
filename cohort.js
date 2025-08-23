document.addEventListener('DOMContentLoaded', function () {
  // Settings
  const LOCALE = 'id-ID';        // 'en-US' if you want English month names
  const MIN_LEAD_DAYS = 12;      // cohort must be at least +12 days away
  const START_HOUR_LOCAL = '09:00:00+07:00'; // 09:00 WIB

  // Helpers
  function formatDate(d){ return d.toLocaleDateString(LOCALE,{year:'numeric',month:'long',day:'numeric'}); }
  function toIsoDate(d){ const z=new Date(d); z.setHours(0,0,0,0); return z.toISOString().slice(0,10); }
  function getNextCohortDate(){
    const t=new Date(); let c=new Date(); c.setDate(t.getDate()+MIN_LEAD_DAYS);
    while (c.getDay()!==1) c.setDate(c.getDate()+1); // 1 = Monday
    return c;
  }
  function getTargetTimestamp(){
    const iso = toIsoDate(getNextCohortDate());
    return new Date(`${iso}T${START_HOUR_LOCAL}`).getTime(); // force WIB
  }
  function pad2(n){ return String(n).padStart(2,'0'); }

  // Render cohort date
  const cohortDate = getNextCohortDate();
  const dateEl = document.getElementById('cohort-date');
  if (dateEl) dateEl.textContent = formatDate(cohortDate);

  // Constant spots = 5 (ensure it even if HTML got changed)
  const spotsEl = document.getElementById('spots-left');
  if (spotsEl) spotsEl.textContent = '5';

  // Countdown
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');

  if (dEl && hEl && mEl && sEl) {
    let target = getTargetTimestamp();
    function tick() {
      const now = Date.now();
      let diff = target - now;
      if (diff <= 0) { target = getTargetTimestamp(); diff = target - now; }
      const dayMs=86400000, hrMs=3600000, minMs=60000;
      const days=Math.floor(diff/dayMs);
      const hours=Math.floor((diff%dayMs)/hrMs);
      const mins=Math.floor((diff%hrMs)/minMs);
      const secs=Math.floor((diff%minMs)/1000);
      dEl.textContent = pad2(days);
      hEl.textContent = pad2(hours);
      mEl.textContent = pad2(mins);
      sEl.textContent = pad2(secs);
    }
    tick(); setInterval(tick, 1000);
  }
});
