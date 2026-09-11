import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  HeartPulse,
  Thermometer,
  Calendar,
  Pill,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { CaseTakingSession, ConsultationRecord, PrescriptionItem } from '../../types';

interface TodaysConsultationTabProps {
  session: CaseTakingSession;
  onSaveConsultation: (consultation: ConsultationRecord) => void;
  doctorName?: string;
}

export const TodaysConsultationTab: React.FC<TodaysConsultationTabProps> = ({
  session,
  onSaveConsultation,
  doctorName = 'Dr. Rajesh Sharma, MD, DNB (Internal Medicine)',
}) => {
  // Check if there is already a consultation for today in the record
  const existingToday = (session.consultations || []).find(
    (c) => c.date === '2026-08-29' || c.date === new Date().toISOString().split('T')[0]
  );

  const [date, setDate] = useState(existingToday?.date || '2026-08-29');
  const [time, setTime] = useState(existingToday?.time || '10:30 AM');
  const [treatingDoctor, setTreatingDoctor] = useState(existingToday?.doctorName || doctorName);
  const [chiefComplaint, setChiefComplaint] = useState(
    existingToday?.chiefComplaint || session.summary.chiefComplaint || ''
  );
  const [clinicalHistory, setClinicalHistory] = useState(
    existingToday?.clinicalHistory || session.summary.historyOfPresentIllness?.chronologicalNarrative || ''
  );
  const [currentSymptoms, setCurrentSymptoms] = useState(
    existingToday?.currentSymptoms ||
      session.summary.historyOfPresentIllness?.associatedSymptoms?.join(', ') ||
      ''
  );
  const [physicalExam, setPhysicalExam] = useState(
    existingToday?.physicalExamination ||
      'General: Conscious, oriented to time, place, and person. No pallor, icterus, cyanosis, or lymphadenopathy.\nCVS: S1 S2 heard. No murmurs.\nRS: Bilateral vesicular breath sounds heard.\nAbdomen: Soft, non-tender, no organomegaly.'
  );

  // Vitals
  const [vitals, setVitals] = useState({
    bloodPressure: existingToday?.vitals?.bloodPressure || '130/85 mmHg',
    pulse: existingToday?.vitals?.pulse || '76 bpm',
    spo2: existingToday?.vitals?.spo2 || '98%',
    temperature: existingToday?.vitals?.temperature || '98.4 F',
    weight: existingToday?.vitals?.weight || '72 kg',
    respiratoryRate: existingToday?.vitals?.respiratoryRate || '16/min',
    bloodSugar: existingToday?.vitals?.bloodSugar || '138 mg/dL',
  });

  const [relevantFindings, setRelevantFindings] = useState(
    existingToday?.relevantFindings ||
      'ECG: Normal sinus rhythm, no acute ischemic ST-T changes. Baseline renal & hepatic function reviewed.'
  );

  const [assessment, setAssessment] = useState(
    existingToday?.assessment ||
      session.summary.doctorAssessment ||
      (session.summary.provisionalDifferentialDiagnosis && session.summary.provisionalDifferentialDiagnosis.length > 0
        ? session.summary.provisionalDifferentialDiagnosis[0].condition
        : '')
  );

  const [treatmentAdvice, setTreatmentAdvice] = useState(
    existingToday?.treatmentAdvice ||
      '1. Strict medication compliance.\n2. Low salt & low saturated fat diet.\n3. Adequate hydration; avoid strenuous unmonitored physical exertion.\n4. Maintain daily blood pressure and fasting glucose log.'
  );

  // Prescriptions
  const initialPrescriptions: PrescriptionItem[] = existingToday?.prescriptions ||
    (session.summary.doctorPrescriptionPlan && session.summary.doctorPrescriptionPlan.length > 0
      ? session.summary.doctorPrescriptionPlan.map((p, idx) => ({
          id: `rx-${Date.now()}-${idx}`,
          medicineName: p.medicine,
          dosage: p.dosage,
          frequency: p.timing,
          duration: '30 days',
          instructions: p.instructions,
        }))
      : [
          {
            id: `rx-1`,
            medicineName: 'Tab. Telmisartan',
            dosage: '40mg',
            frequency: 'Once daily morning',
            duration: '30 days',
            instructions: 'Take post-breakfast',
          },
          {
            id: `rx-2`,
            medicineName: 'Tab. Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with lunch and dinner',
          },
        ]);

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(initialPrescriptions);
  const [followUpInstructions, setFollowUpInstructions] = useState(
    existingToday?.followUpInstructions ||
      'Review in Outpatient Clinic with fasting blood sugar and renal panel report in 14 days or immediately if warning signs develop.'
  );
  const [followUpDays, setFollowUpDays] = useState<number>(existingToday?.followUpDays || 14);
  const [additionalNotes, setAdditionalNotes] = useState(
    existingToday?.additionalNotes || 'Patient and family educated on warning signs and emergency helpline number.'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handlers for prescriptions
  const handleAddMedicine = () => {
    const newRx: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '14 days',
      instructions: 'Take after meals',
    };
    setPrescriptions([...prescriptions, newRx]);
  };

  const handleUpdateMedicine = (id: string, field: keyof PrescriptionItem, val: string) => {
    setPrescriptions(
      prescriptions.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveMedicine = (id: string) => {
    setPrescriptions(prescriptions.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    const consultationRecord: ConsultationRecord = {
      id: existingToday?.id || `cons-${Date.now()}`,
      patientId: session.patient.id,
      doctorId: 'doc-current',
      doctorName: treatingDoctor,
      date,
      time,
      chiefComplaint,
      clinicalHistory,
      currentSymptoms,
      physicalExamination: physicalExam,
      vitals,
      relevantFindings,
      assessment,
      treatmentAdvice,
      prescriptions,
      followUpInstructions,
      followUpDays,
      additionalNotes,
      status: 'completed',
    };

    onSaveConsultation(consultationRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  const handleCopyFromAi = () => {
    if (session.summary.chiefComplaint && !chiefComplaint) {
      setChiefComplaint(session.summary.chiefComplaint);
    }
    if (session.summary.historyOfPresentIllness?.chronologicalNarrative) {
      setClinicalHistory(session.summary.historyOfPresentIllness.chronologicalNarrative);
    }
    if (session.summary.doctorAssessment && !assessment) {
      setAssessment(session.summary.doctorAssessment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Consultation Header & Save Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Today's Clinical Consultation Encounter</h2>
              <p className="text-xs text-slate-500">
                Official Electronic Health Record Entry • Verified Doctor Interface
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleCopyFromAi}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            title="Pre-fill empty fields from AI voice intake summary"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Sync with Voice Intake</span>
          </button>

          <button
            id="save-consultation-btn"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Consultation to Record</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Consultation Successfully Saved to Patient EHR!</p>
              <p className="text-[11px] text-emerald-700">
                The consultation notes, updated vitals, and prescriptions have been committed to the patient history and medical timeline.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-100 px-2.5 py-1 rounded-md">
            Status: Completed
          </span>
        </div>
      )}

      {/* Grid: Meta Details (Date, Doctor, Time) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Consultation Date
          </label>
          <input
            id="consult-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Consultation Time
          </label>
          <input
            id="consult-time-input"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:30 AM"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Attending Physician
          </label>
          <input
            id="consult-doctor-input"
            type="text"
            value={treatingDoctor}
            onChange={(e) => setTreatingDoctor(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* VITALS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <HeartPulse className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-sm text-slate-900">Today's Physical Vitals</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">BP (mmHg)</span>
            <input
              type="text"
              value={vitals.bloodPressure}
              onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
              placeholder="120/80"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Pulse (bpm)</span>
            <input
              type="text"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              placeholder="72"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">SpO2 (%)</span>
            <input
              type="text"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              placeholder="98%"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Temp (°F)</span>
            <input
              type="text"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              placeholder="98.4 F"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Weight (kg)</span>
            <input
              type="text"
              value={vitals.weight}
              onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
              placeholder="70 kg"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Resp Rate</span>
            <input
              type="text"
              value={vitals.respiratoryRate}
              onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
              placeholder="16/min"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Blood Sugar</span>
            <input
              type="text"
              value={vitals.bloodSugar}
              onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
              placeholder="120 mg/dL"
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 mt-1"
            />
          </div>
        </div>
      </div>

      {/* CLINICAL COMPLAINT & HISTORY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chief Complaint & Current Symptoms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Chief Complaint (Current Encounter)
            </label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Abdominal pain for 2 days, radiating to epigastrium"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Current Symptoms & Progression
            </label>
            <textarea
              rows={3}
              value={currentSymptoms}
              onChange={(e) => setCurrentSymptoms(e.target.value)}
              placeholder="Detailed symptom description, onset, duration, character..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Clinical History / HPI Narrative
            </label>
            <textarea
              rows={4}
              value={clinicalHistory}
              onChange={(e) => setClinicalHistory(e.target.value)}
              placeholder="Detailed narrative of illness..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>

        {/* Physical Examination & Relevant Findings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Physical Examination Notes
            </label>
            <textarea
              rows={5}
              value={physicalExam}
              onChange={(e) => setPhysicalExam(e.target.value)}
              placeholder="Systemic examination: General, CVS, Respiratory, Abdomen, CNS..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Relevant Bedside Findings & Investigations
            </label>
            <textarea
              rows={4}
              value={relevantFindings}
              onChange={(e) => setRelevantFindings(e.target.value)}
              placeholder="ECG, point-of-care ultrasound, auscultation, urgent lab review..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* DOCTOR'S ASSESSMENT & CLINICAL IMPRESSION */}
      <div className="bg-white rounded-2xl border-2 border-teal-600/40 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              Rx
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Doctor's Clinical Assessment & Impression
              </h3>
              <p className="text-[11px] text-slate-500">
                Physician's definitive clinical judgment and diagnostic impression
              </p>
            </div>
          </div>
        </div>

        <textarea
          id="doctor-assessment-input"
          rows={3}
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          placeholder="Enter authoritative clinical assessment, provisional diagnosis, and disease severity..."
          className="w-full px-3.5 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
        />

        {/* Treatment & Non-Pharmacological Advice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Treatment & Non-Pharmacological Advice
          </label>
          <textarea
            rows={3}
            value={treatmentAdvice}
            onChange={(e) => setTreatmentAdvice(e.target.value)}
            placeholder="Diet modifications, exercise restrictions, precautions, lifestyle advice..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* PRESCRIPTIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Prescription & Medication Plan ({prescriptions.length} items)
            </h3>
          </div>

          <button
            id="add-medicine-btn"
            onClick={handleAddMedicine}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Medicine</span>
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-4 text-center border border-dashed rounded-xl">
            No medications currently prescribed. Click "+ Add Medicine" to prescribe drugs.
          </p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 items-center"
              >
                {/* Index */}
                <div className="md:col-span-1 flex items-center justify-center font-bold text-xs text-slate-400">
                  #{index + 1}
                </div>

                {/* Medicine Name */}
                <div className="md:col-span-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block md:hidden">Medicine Name</span>
                  <input
                    type="text"
                    value={item.medicineName}
                    onChange={(e) => handleUpdateMedicine(item.id, 'medicineName', e.target.value)}
                    placeholder="e.g. Tab. Telmisartan"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>

                {/* Dosage */}
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block md:hidden">Dosage</span>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => handleUpdateMedicine(item.id, 'dosage', e.target.value)}
                    placeholder="e.g. 40mg"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>

                {/* Frequency */}
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block md:hidden">Frequency</span>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => handleUpdateMedicine(item.id, 'frequency', e.target.value)}
                    placeholder="e.g. Once daily"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>

                {/* Duration / Instructions */}
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block md:hidden">Instructions</span>
                  <input
                    type="text"
                    value={item.instructions}
                    onChange={(e) => handleUpdateMedicine(item.id, 'instructions', e.target.value)}
                    placeholder="e.g. Post-breakfast, 30 days"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>

                {/* Delete button */}
                <div className="md:col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveMedicine(item.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOLLOW-UP & ADDITIONAL NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Follow-Up Schedule & Instructions
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-semibold">Review after:</span>
            <input
              type="number"
              value={followUpDays}
              onChange={(e) => setFollowUpDays(parseInt(e.target.value) || 0)}
              className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-center"
            />
            <span className="text-xs text-slate-600">days</span>
          </div>

          <textarea
            rows={3}
            value={followUpInstructions}
            onChange={(e) => setFollowUpInstructions(e.target.value)}
            placeholder="Follow-up instructions, investigations to repeat prior to visit..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Additional Clinical Notes / Red Flag Warnings
          </label>
          <textarea
            rows={4}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Special warnings given to patient or family, emergency guidance..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            Signing as: <strong className="text-white">{treatingDoctor}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Commit & Save Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
