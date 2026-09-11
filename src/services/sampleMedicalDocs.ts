// Helper to generate visual SVG document representations for medical files and scans
export function createPrescriptionSvg(data: {
  hospitalName: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  rxId: string;
  diagnosis: string;
  allergies?: string;
  medicines: Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>;
}): string {
  const medicineRows = data.medicines
    .map(
      (m, i) => `
    <g transform="translate(40, ${380 + i * 55})">
      <circle cx="10" cy="15" r="4" fill="#2563EB"/>
      <text x="25" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="bold" fill="#0F172A">${i + 1}. ${m.name}</text>
      <text x="25" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#475569">Dosage: ${m.dosage} | ${m.frequency} | ${m.duration}</text>
      <text x="25" y="47" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-style="italic" fill="#64748B">Note: ${m.instructions}</text>
      <line x1="0" y1="52" x2="670" y2="52" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3"/>
    </g>`
    )
    .join('');

  const allergyNotice = data.allergies
    ? `<rect x="40" y="295" width="670" height="35" rx="6" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1.5"/>
       <text x="55" y="318" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#BE123C">⚠️ ALLERGY ALERT: ${data.allergies}</text>`
    : '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 950" width="100%" height="100%">
  <!-- Paper Background with subtle shadow -->
  <rect width="750" height="950" fill="#FFFFFF" rx="8"/>
  <rect x="0" y="0" width="750" height="950" fill="none" stroke="#CBD5E1" stroke-width="2"/>

  <!-- Hospital Header -->
  <rect x="0" y="0" width="750" height="130" fill="#F8FAFC"/>
  <path d="M 0 130 L 750 130" stroke="#2563EB" stroke-width="4"/>
  
  <circle cx="75" cy="65" r="30" fill="#2563EB"/>
  <path d="M 75 45 L 75 85 M 55 65 L 95 65" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>

  <text x="125" y="55" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="800" fill="#0F172A">${data.hospitalName}</text>
  <text x="125" y="78" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="600" fill="#2563EB">${data.doctorName} • ${data.specialty}</text>
  <text x="125" y="98" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#64748B">Reg No: MCI-IND-2014-9872 | NABH Accredited Digital OPD Centre</text>

  <!-- Patient Meta Info Bar -->
  <rect x="40" y="150" width="670" height="85" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
  <text x="60" y="178" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#334155">Patient Name: <tspan font-weight="800" fill="#0F172A">${data.patientName}</tspan></text>
  <text x="60" y="200" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Age / Gender: ${data.age} Yrs / ${data.gender}</text>
  <text x="60" y="220" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Prescription ID: ${data.rxId}</text>

  <text x="450" y="178" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Date: <tspan font-weight="bold" fill="#0F172A">${data.date}</tspan></text>
  <text x="450" y="200" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">OPD Clinic: Room 3B</text>
  <text x="450" y="220" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Valid: 30 Days</text>

  <!-- Clinical Diagnosis Box -->
  <rect x="40" y="245" width="670" height="40" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
  <text x="55" y="270" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#1E40AF">Clinical Impression: ${data.diagnosis}</text>

  ${allergyNotice}

  <!-- Rx symbol -->
  <g transform="translate(40, 340)">
    <text x="0" y="32" font-family="Georgia, serif" font-size="42" font-weight="bold" font-style="italic" fill="#2563EB">℞</text>
    <text x="50" y="24" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="bold" fill="#0F172A">Medical Prescription &amp; Posology</text>
  </g>

  <!-- Medicine rows -->
  ${medicineRows}

  <!-- Doctor Stamp and Signature -->
  <g transform="translate(480, 800)">
    <line x1="0" y1="50" x2="220" y2="50" stroke="#0F172A" stroke-width="1"/>
    <!-- Stamp circle -->
    <circle cx="110" cy="20" r="45" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.6"/>
    <text x="110" y="15" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" font-weight="bold" fill="#2563EB" opacity="0.7">CLINICAL OPD</text>
    <text x="110" y="28" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" fill="#2563EB" opacity="0.7">VERIFIED</text>
    
    <text x="110" y="68" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${data.doctorName}</text>
    <text x="110" y="84" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#64748B">${data.specialty}</text>
  </g>

  <!-- Footer Watermark -->
  <rect x="0" y="900" width="750" height="50" fill="#F8FAFC"/>
  <line x1="0" y1="900" x2="750" y2="900" stroke="#E2E8F0" stroke-width="1"/>
  <text x="40" y="930" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#94A3B8">Swasthya AI Integrated Digital Prescription • Verified Health Record (ABDM Compatible)</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function createLabReportSvg(data: {
  labName: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  sampleId: string;
  testTitle: string;
  results: Array<{ test: string; result: string; unit: string; range: string; status: 'normal' | 'high' | 'low' | 'critical' }>;
  impression: string;
  pathologist: string;
}): string {
  const resultRows = data.results
    .map((r, i) => {
      const isBad = r.status === 'high' || r.status === 'critical' || r.status === 'low';
      const badgeBg = r.status === 'critical' ? '#FFE4E6' : r.status === 'high' || r.status === 'low' ? '#FEF3C7' : '#DCFCE7';
      const badgeText = r.status === 'critical' ? '#BE123C' : r.status === 'high' || r.status === 'low' ? '#B45309' : '#15803D';
      return `
      <g transform="translate(40, ${320 + i * 38})">
        <rect x="0" y="0" width="670" height="32" rx="4" fill="${i % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}"/>
        <text x="15" y="21" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="${isBad ? 'bold' : 'normal'}" fill="#0F172A">${r.test}</text>
        <text x="270" y="21" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="${isBad ? '#DC2626' : '#0F172A'}">${r.result}</text>
        <text x="390" y="21" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">${r.unit}</text>
        <text x="490" y="21" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">${r.range}</text>
        <rect x="600" y="6" width="60" height="20" rx="10" fill="${badgeBg}"/>
        <text x="630" y="20" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="bold" fill="${badgeText}">${r.status.toUpperCase()}</text>
      </g>`;
    })
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 920" width="100%" height="100%">
  <rect width="750" height="920" fill="#FFFFFF" rx="8"/>
  <rect x="0" y="0" width="750" height="920" fill="none" stroke="#CBD5E1" stroke-width="2"/>

  <!-- Lab Header -->
  <rect x="0" y="0" width="750" height="120" fill="#0F172A"/>
  <circle cx="70" cy="60" r="28" fill="#38BDF8"/>
  <!-- Beaker/Flask icon -->
  <path d="M 62 48 L 78 48 L 74 60 L 84 75 C 85 77 84 80 81 80 L 59 80 C 56 80 55 77 56 75 L 66 60 Z" fill="#FFFFFF"/>

  <text x="115" y="52" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">${data.labName}</text>
  <text x="115" y="74" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#38BDF8">CLINICAL PATHOLOGY &amp; DIAGNOSTIC INVESTIGATION REPORT</text>
  <text x="115" y="94" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#94A3B8">ISO 15189 Certified • NABL Accredited Automated Hematology &amp; Biochemistry</text>

  <!-- Patient meta -->
  <rect x="40" y="140" width="670" height="85" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <text x="60" y="168" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#334155">Patient Name: <tspan font-weight="800" fill="#0F172A">${data.patientName}</tspan></text>
  <text x="60" y="190" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Age/Gender: ${data.age} Y / ${data.gender}</text>
  <text x="60" y="210" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Sample ID: ${data.sampleId}</text>

  <text x="450" y="168" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Collection: <tspan font-weight="bold" fill="#0F172A">${data.date}</tspan></text>
  <text x="450" y="190" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Status: <tspan font-weight="bold" fill="#16A34A">Final Verified</tspan></text>
  <text x="450" y="210" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Ref By: OPD Consultation</text>

  <!-- Section Title -->
  <rect x="40" y="240" width="670" height="35" rx="4" fill="#E2E8F0"/>
  <text x="55" y="263" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="#0F172A">${data.testTitle.toUpperCase()}</text>

  <!-- Table Header -->
  <g transform="translate(40, 290)">
    <text x="15" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">INVESTIGATION PARAMETER</text>
    <text x="270" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">MEASURED VALUE</text>
    <text x="390" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">UNITS</text>
    <text x="490" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">REFERENCE RANGE</text>
    <text x="600" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B">FLAG</text>
    <line x1="0" y1="24" x2="670" y2="24" stroke="#CBD5E1" stroke-width="1.5"/>
  </g>

  <!-- Table Rows -->
  ${resultRows}

  <!-- Impression Box -->
  <rect x="40" y="680" width="670" height="85" rx="6" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5"/>
  <text x="55" y="705" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="800" fill="#991B1B">CLINICAL IMPRESSION / PATHOLOGIST NOTE:</text>
  <text x="55" y="730" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#7F1D1D" width="640">${data.impression}</text>

  <!-- Signatures -->
  <g transform="translate(500, 800)">
    <line x1="0" y1="40" x2="200" y2="40" stroke="#475569" stroke-width="1"/>
    <text x="100" y="58" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">${data.pathologist}</text>
    <text x="100" y="74" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" fill="#64748B">Consultant Pathologist, MD</text>
  </g>

  <rect x="0" y="880" width="750" height="40" fill="#F8FAFC"/>
  <text x="40" y="905" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" fill="#94A3B8">This is an authorized electronic laboratory record. Biological reference intervals validated per CLSI standards.</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function createRadiologyScanSvg(data: {
  facilityName: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  studyType: string;
  findings: string;
  impression: string;
  radiologist: string;
}): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 920" width="100%" height="100%">
  <rect width="750" height="920" fill="#1E293B" rx="8"/>
  <rect x="0" y="0" width="750" height="920" fill="none" stroke="#475569" stroke-width="2"/>

  <!-- Radiology Header -->
  <rect x="0" y="0" width="750" height="110" fill="#0F172A"/>
  <circle cx="65" cy="55" r="26" fill="#6366F1"/>
  <!-- Radiation / scan icon -->
  <circle cx="65" cy="55" r="7" fill="#FFFFFF"/>
  <path d="M 65 35 L 65 42 M 65 68 L 65 75 M 45 55 L 52 55 M 78 55 L 85 55" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>

  <text x="110" y="48" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">${data.facilityName}</text>
  <text x="110" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#818CF8">DEPARTMENT OF DIAGNOSTIC RADIOLOGY &amp; IMAGING</text>
  <text x="110" y="88" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#94A3B8">High-Resolution Digital Radiography (DR) • PACS Archival System</text>

  <!-- Patient meta strip -->
  <rect x="40" y="130" width="670" height="75" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1"/>
  <text x="60" y="156" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#94A3B8">Patient: <tspan font-weight="bold" fill="#F8FAFC">${data.patientName}</tspan></text>
  <text x="60" y="178" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#94A3B8">Demographics: ${data.age} Y / ${data.gender}</text>
  <text x="440" y="156" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#94A3B8">Exam Date: <tspan font-weight="bold" fill="#F8FAFC">${data.date}</tspan></text>
  <text x="440" y="178" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#94A3B8">Study: <tspan font-weight="bold" fill="#38BDF8">${data.studyType}</tspan></text>

  <!-- Visual Radiographic Plate Canvas -->
  <rect x="40" y="225" width="670" height="310" rx="8" fill="#000000" stroke="#475569" stroke-width="1"/>
  
  <!-- Simulated Radiographic Grid & Anatomical Silhouette -->
  <g opacity="0.8">
    <ellipse cx="375" cy="380" rx="160" ry="110" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <!-- Rib cage / bony landmarks simulation -->
    <path d="M 280 340 Q 375 350 470 340" stroke="#64748B" stroke-width="8" fill="none" opacity="0.7"/>
    <path d="M 270 370 Q 375 385 480 370" stroke="#64748B" stroke-width="9" fill="none" opacity="0.7"/>
    <path d="M 265 405 Q 375 420 485 405" stroke="#64748B" stroke-width="9" fill="none" opacity="0.7"/>
    <path d="M 275 440 Q 375 455 475 440" stroke="#64748B" stroke-width="8" fill="none" opacity="0.7"/>
    <!-- Spine column -->
    <line x1="375" y1="310" x2="375" y2="480" stroke="#CBD5E1" stroke-width="14" stroke-dasharray="16,6" opacity="0.8"/>
    <!-- Heart silhouette -->
    <ellipse cx="350" cy="410" rx="55" ry="45" fill="#1E293B" opacity="0.85"/>
    
    <!-- Pathology Highlight Area -->
    <circle cx="430" cy="390" r="32" fill="#F59E0B" opacity="0.3"/>
    <circle cx="430" cy="390" r="32" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="430" y="360" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#FCD34D">Abnormality Flag</text>
  </g>

  <!-- Technical Overlay text on plate -->
  <text x="60" y="255" font-family="monospace" font-size="11" fill="#38BDF8">kVp: 120 | mAs: 4.5 | SID: 180cm</text>
  <text x="60" y="272" font-family="monospace" font-size="11" fill="#94A3B8">POSITION: PA ERECT | VIEW: STANDARD</text>
  <text x="630" y="255" text-anchor="end" font-family="monospace" font-size="14" font-weight="bold" fill="#EF4444">R</text>

  <!-- Findings section -->
  <rect x="40" y="555" width="670" height="120" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1"/>
  <text x="60" y="580" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#38BDF8">RADIOLOGICAL OBSERVATIONS &amp; FINDINGS:</text>
  <text x="60" y="605" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#CBD5E1" width="630">${data.findings}</text>

  <!-- Impression section -->
  <rect x="40" y="690" width="670" height="90" rx="6" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
  <text x="60" y="715" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#A5B4FC">IMPRESSION / DIAGNOSIS:</text>
  <text x="60" y="740" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">${data.impression}</text>

  <!-- Signoff -->
  <g transform="translate(500, 810)">
    <line x1="0" y1="35" x2="200" y2="35" stroke="#64748B" stroke-width="1"/>
    <text x="100" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">${data.radiologist}</text>
    <text x="100" y="68" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" fill="#94A3B8">Consultant Radiologist, DMRD, DNB</text>
  </g>

  <text x="40" y="890" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" fill="#64748B">Digitally signed diagnostic imaging report. Stored on Swasthya Hospital PACS Network.</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function createDischargeSummarySvg(data: {
  hospitalName: string;
  patientName: string;
  age: number;
  gender: string;
  admissionDate: string;
  dischargeDate: string;
  ipNo: string;
  finalDiagnosis: string;
  procedureDone: string;
  dischargeCourse: string;
  dischargeMeds: string[];
  treatingConsultant: string;
}): string {
  const meds = data.dischargeMeds
    .map((m, i) => `<text x="65" y="${640 + i * 22}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#1E293B">• ${m}</text>`)
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 960" width="100%" height="100%">
  <rect width="750" height="960" fill="#FFFFFF" rx="8"/>
  <rect x="0" y="0" width="750" height="960" fill="none" stroke="#CBD5E1" stroke-width="2"/>

  <!-- Header -->
  <rect x="0" y="0" width="750" height="125" fill="#F8FAFC"/>
  <path d="M 0 125 L 750 125" stroke="#059669" stroke-width="4"/>

  <circle cx="70" cy="62" r="28" fill="#059669"/>
  <!-- Hospital cross building -->
  <path d="M 58 48 H 82 V 76 H 58 Z" fill="#FFFFFF"/>
  <path d="M 70 54 V 70 M 62 62 H 78" stroke="#059669" stroke-width="3"/>

  <text x="115" y="52" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="800" fill="#0F172A">${data.hospitalName}</text>
  <text x="115" y="74" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#059669">DEPARTMENT OF CARDIOLOGY &amp; INPATIENT MEDICINE</text>
  <text x="115" y="94" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#64748B">NABH &amp; JCI Accredited Super Speciality Hospital • Inpatient Care Division</text>

  <!-- Document Title Banner -->
  <rect x="40" y="145" width="670" height="35" rx="4" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1"/>
  <text x="375" y="168" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="#065F46">FORMAL CLINICAL DISCHARGE SUMMARY</text>

  <!-- Demographics Matrix -->
  <rect x="40" y="195" width="670" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
  <text x="60" y="222" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Patient Name: <tspan font-weight="bold" fill="#0F172A">${data.patientName}</tspan></text>
  <text x="60" y="247" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Age / Gender: ${data.age} Y / ${data.gender}</text>
  <text x="60" y="272" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">IP Number: ${data.ipNo}</text>

  <text x="420" y="222" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Date of Admission: <tspan font-weight="bold" fill="#0F172A">${data.admissionDate}</tspan></text>
  <text x="420" y="247" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Date of Discharge: <tspan font-weight="bold" fill="#0F172A">${data.dischargeDate}</tspan></text>
  <text x="420" y="272" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#64748B">Consultant: <tspan font-weight="bold" fill="#059669">${data.treatingConsultant}</tspan></text>

  <!-- Final Diagnosis -->
  <rect x="40" y="310" width="670" height="50" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
  <text x="55" y="332" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#1E40AF">FINAL CLINICAL DIAGNOSIS:</text>
  <text x="55" y="348" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="800" fill="#1E3A8A">${data.finalDiagnosis}</text>

  <!-- Procedure Performed -->
  <rect x="40" y="375" width="670" height="50" rx="6" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1"/>
  <text x="55" y="397" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="bold" fill="#15803D">PROCEDURE / INTERVENTION PERFORMED:</text>
  <text x="55" y="413" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="800" fill="#14532D">${data.procedureDone}</text>

  <!-- Clinical Course in Hospital -->
  <g transform="translate(40, 445)">
    <text x="0" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">SUMMARY OF CLINICAL COURSE IN HOSPITAL:</text>
    <rect x="0" y="25" width="670" height="110" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="15" y="50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#334155" width="640">${data.dischargeCourse}</text>
  </g>

  <!-- Discharge Medications -->
  <g transform="translate(40, 600)">
    <text x="0" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">DISCHARGE MEDICATIONS &amp; REGIMEN:</text>
    <rect x="0" y="25" width="670" height="150" rx="6" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1"/>
    ${meds}
  </g>

  <!-- Follow-up and Signoff -->
  <g transform="translate(40, 790)">
    <text x="0" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">FOLLOW-UP &amp; EMERGENCY INSTRUCTIONS:</text>
    <text x="0" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#475569">Review in Cardiology OPD after 2 weeks with repeat lipid profile and ECG. Strict compliance to dual antiplatelets.</text>
  </g>

  <g transform="translate(480, 860)">
    <line x1="0" y1="35" x2="220" y2="35" stroke="#0F172A" stroke-width="1"/>
    <text x="110" y="52" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${data.treatingConsultant}</text>
    <text x="110" y="68" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="#64748B">Chief Cardiologist &amp; HOD</text>
  </g>

  <rect x="0" y="930" width="750" height="30" fill="#F8FAFC"/>
  <text x="40" y="948" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" fill="#94A3B8">Official Medico-Legal Discharge Record • Fortis Healthcare Group Electronic Medical Record System</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
