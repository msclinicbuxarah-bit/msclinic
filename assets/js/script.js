'use strict';
document.documentElement.classList.add('js');

/* ====== CONFIGURATION ======
   Clinic WhatsApp number: country code + number, digits only. */
const CLINIC_WHATSAPP_NUMBER = "918013618314";
const waUrl = text => `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// WhatsApp CTA buttons
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = waUrl(a.dataset.msg || 'Hello, I would like to contact the clinic.');
});
document.getElementById('yr').textContent = new Date().getFullYear();

// ===== Doctors: edit this list only =====
// dow = days of week available (0 = Sunday ... 6 = Saturday) · cat = filter group · photo = 'img/doctors/name.webp' or ''
const ALL = [0, 1, 2, 3, 4, 5, 6];
const DOCTORS = [
  { name: 'Dr. Nimisha Misra', cat: 'Gynaecology',
    qual: 'MBBS (Hons) (WBUHS), MS (Obstetrics and Gynaecology) · Gold Medalist',
    specialty: 'Obstetrics & Gynaecology',
    details: ['From S.S.K.M. Hospital', 'Attached with IPGMER and SSKM Hospital'],
    reg: '83496 (WBMC)', days: 'Tuesday', time: '7:30 PM', dow: [2], photo: '' },

  { name: 'Dr. Saubhagya Chowdhury', cat: 'Dermatology',
    qual: 'MBBS (Hons), MD (Dermatology) RGME&R, Kol',
    specialty: 'Consultant Dermatologist',
    details: ['From S.S.K.M. Hospital'],
    reg: '48389', days: 'Friday', time: '8:00 PM', dow: [5], photo: '' },

  { name: 'Dr. Rajdeep Shaw', cat: 'Physician',
    qual: 'MBBS (R.G. Kar Medical College & Hospital)',
    specialty: 'General Physician',
    details: ['Ex-House Physician, Dept. of Emergency Medicine, RGKMCH',
              'Ex-Medicine Consultant at H.S.P. · German Foundation NGO, Dispensary'],
    reg: '83694 (WBMC)', days: 'Everyday, by appointment', time: '', dow: ALL, photo: '' },

  { name: 'Dr. Pratyay Pal', cat: 'Orthopedics',
    qual: 'MBBS, DNB (Orthopedics), MNAMS',
    specialty: 'Orthopedic Surgeon',
    details: ['AO Advanced Trauma Management, Arthroplasty & Arthroscopy surgeon',
              'Attached with Apollo Multispeciality Hospital, Kolkata',
              'Former SR, NRS Medical College, Kolkata'],
    reg: '', days: 'Monday & Thursday', time: '7:00 PM', dow: [1, 4], photo: '' },

  { name: 'Dr. K. Kar', cat: 'Pediatrics',
    qual: 'MBBS, MD (Pediatrics)',
    specialty: 'Pediatrician & Neonatologist',
    details: [],
    reg: '65862', days: 'Everyday, by appointment', time: '', dow: ALL, photo: '' },

  { name: 'Dr. Vineet Kumar Singh', cat: 'Physiotherapy',
    qual: 'B.P.T. (Kol), C.M.S. & E.D. (IRMA)',
    specialty: 'Physiotherapy',
    details: [],
    reg: '1630 WBUHS', days: 'Everyday', time: '9:00 PM / In any emergency', dow: ALL, photo: '' },

  { name: 'Prof. Dr. A. K. Saha', cat: 'Physician',
    qual: 'M.B.B.S. (Cal.), M.D. (Nagpur University)',
    specialty: 'Consultant Physician · Diabetes & Thyroid Specialist',
    details: ['Attached at National Medical College & Hospital, Kolkata-14',
              'CCEBDM · CCMTD · ACMDC · CCCA (COPD & Asthma) · CCCS (CVS & Strokes)'],
    reg: '', days: 'Everyday, by appointment', time: '7:30 PM', dow: ALL, photo: '' },

  { name: 'Dr. Himadri Sekhar Bera', cat: 'Physician',
    qual: 'MBBS, MD (Medicine)',
    specialty: 'Physician (Medicine)',
    details: [],
    reg: '79299 (WBMC)', days: 'Monday', time: '4:00 PM', dow: [1], photo: '' },

  { name: 'Dr. Sudakshina Panja', cat: 'Gynaecology',
    qual: 'MBBS, MS (G&O), DNB (G&O), MRCOG-1, MNAMS',
    specialty: 'Obstetrician & Gynaecologist',
    details: ['Laparoscopic gynaecology surgeon and fertility specialist'],
    reg: 'WBMC 71089', days: 'By appointment', time: '', dow: [], photo: '' },

  { name: 'Dr. Aritra Roy', cat: 'Dermatology',
    qual: 'M.B.B.S., M.D. (Dermatology)',
    specialty: 'Dermatologist & Cosmetologist',
    details: ['Skin, Hair, Nail and Sexual Diseases',
              'Attached with NRS Medical College, Kolkata'],
    reg: 'WBMC 78925', days: 'Thursday', time: '7:00 PM', dow: [4], photo: '' }
];

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};
const when = d => [d.days, d.time].filter(Boolean).join(' · ');
const initials = n => n.replace(/^(Prof\.\s*)?Dr\.?\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
const today = new Date().getDay();
const isToday = d => d.dow.includes(today);

// Hero: doctors available today
document.getElementById('today-count').textContent = DOCTORS.filter(isToday).length;

// Form references
const form = document.getElementById('form');
const serviceEl = document.getElementById('service');
const doctorWrap = document.getElementById('doctor-wrap');
const doctorEl = document.getElementById('doctor');
const docHint = document.getElementById('doc-hint');

// Doctor picker options inside the form
doctorEl.append(new Option('Select a doctor', ''));
DOCTORS.forEach((d, n) => doctorEl.append(new Option(`${d.name} — ${d.specialty}`, String(n))));

const syncDoctor = () => {
  const show = serviceEl.value === 'Doctor appointment';
  doctorWrap.hidden = !show;
  if (!show) { doctorEl.value = ''; docHint.textContent = ''; setErr('doctor', ''); }
};
serviceEl.addEventListener('change', syncDoctor);
doctorEl.addEventListener('change', () => {
  const d = DOCTORS[doctorEl.value];
  docHint.textContent = d ? `🕒 ${when(d)}` : '';
  if (d) setErr('doctor', '');
});

// Doctor cards
const docList = document.getElementById('doctor-list');
const cards = DOCTORS.map((d, n) => {
  const card = el('article', 'card doc rv');
  card.dataset.cat = d.cat;
  if (isToday(d)) card.append(el('span', 'today', 'Available today'));
  if (d.photo) {
    const img = el('img', 'avatar photo');
    img.src = d.photo; img.alt = d.name; img.width = 92; img.height = 92; img.loading = 'lazy';
    card.append(img);
  } else {
    const av = el('div', 'avatar', initials(d.name));
    av.setAttribute('aria-hidden', 'true');
    card.append(av);
  }
  card.append(el('h3', '', d.name), el('p', 'spec', d.specialty), el('p', 'muted', d.qual));
  d.details.forEach(t => card.append(el('p', 'muted small', t)));
  if (d.reg) card.append(el('p', 'muted small', `Reg. No.: ${d.reg}`));
  card.append(el('p', 'when', `🕒 ${when(d)}`));

  // Button jumps to the form with this doctor preselected
  const btn = el('a', 'btn btn-main sm', 'Book an Appointment');
  btn.href = '#contact';
  btn.addEventListener('click', () => {
    serviceEl.value = 'Doctor appointment';
    syncDoctor();
    doctorEl.value = String(n);
    doctorEl.dispatchEvent(new Event('change'));
    setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 600);
  });
  card.append(btn);
  docList.append(card);
  return card;
});

// Specialty filter
const filters = document.getElementById('doc-filters');
['All', ...new Set(DOCTORS.map(d => d.cat))].forEach((c, n) => {
  const b = el('button', 'chip', c);
  b.type = 'button';
  b.setAttribute('aria-pressed', String(n === 0));
  b.addEventListener('click', () => {
    filters.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach(card => { card.hidden = !(c === 'All' || card.dataset.cat === c); });
  });
  filters.append(b);
});

// ===== Contact form =====
const status = document.getElementById('status');
const dateEl = document.getElementById('date');
dateEl.min = new Date().toISOString().split('T')[0];

function setErr(id, msg) {
  const field = document.getElementById(id);
  document.getElementById('e-' + id).textContent = msg;
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const mobile = form.elements.mobile.value.replace(/[\s-]/g, '');
  const service = serviceEl.value;
  const needDoc = service === 'Doctor appointment';
  const doc = needDoc ? DOCTORS[doctorEl.value] : null;
  const ok = [
    setErr('name', name.length >= 2 ? '' : 'Please enter the patient name.'),
    // Indian mobile: optional +91/91/0 prefix, then 10 digits starting 6-9
    setErr('mobile', /^(?:\+?91|0)?[6-9]\d{9}$/.test(mobile) ? '' : 'Enter a valid 10-digit Indian mobile number.'),
    setErr('service', service ? '' : 'Please select a service.'),
    needDoc ? setErr('doctor', doc ? '' : 'Please choose a doctor.') : true
  ].every(Boolean);
  if (!ok) { status.textContent = 'Please correct the highlighted fields.'; return; }

  const lines = ['Hello, I would like to make an enquiry.', '',
    `Patient name: ${name}`, `Contact number: ${mobile}`, `Service: ${service}`];
  if (doc) lines.push(`Doctor: ${doc.name} (${doc.specialty})`, `Doctor's schedule: ${when(doc)}`);
  if (dateEl.value) lines.push(`Preferred date: ${dateEl.value}`);
  const msg = form.elements.msg.value.trim();
  if (msg) lines.push(`Message: ${msg}`);

  const url = waUrl(lines.join('\n'));
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  status.textContent = '';
  const note = document.createElement('span');
  note.textContent = w
    ? 'WhatsApp is opening with your message prefilled. Please press Send in WhatsApp to submit your enquiry. '
    : 'We could not open WhatsApp automatically. ';
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = 'Open WhatsApp manually';
  status.append(note, link);
  // Nothing is stored: no localStorage/sessionStorage/cookies are used.
});

// ===== Scroll reveal =====
const rv = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .12 });
  rv.forEach(n => io.observe(n));
} else rv.forEach(n => n.classList.add('in'));