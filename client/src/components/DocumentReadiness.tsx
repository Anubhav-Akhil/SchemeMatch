import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { DocumentReadinessReport, DocumentVerificationItem } from '../types';
import { FileCheck2, Upload, AlertCircle, CheckCircle2, ExternalLink, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

const DOC_LABELS: Record<Language, Record<string, string>> = {
  en: {
    badgeAi: 'AI Document Scanner',
    badgePre: 'Pre-Appraisal Verification',
    title: 'Document Readiness & Gap Resolver',
    subtitle: 'Verify your documentation health before bank submission to eliminate delays and unlock maximum government subsidy.',
    readinessScore: 'Readiness Score',
    status: 'Status',
    dropzoneTitle: 'Upload Documents for AI Verification',
    dropzoneDesc: 'Drag & drop Aadhaar, Caste Certificate, Bank Passbook, or Udyam PDF / Image (Simulated OCR)',
    dropzoneBtn: 'Simulate Upload: Udyam Certificate',
    ocrSimulating: 'Simulating OCR Scanner on',
    ocrExtracted: 'Extracted Name:',
    ocrCategory: 'Category:',
    ocrValid: '(Verified Valid).',
    critTitle: 'Critical Documents Missing',
    dprQuestion: 'Missing Detailed Project Report (DPR)?',
    dprSubtitle: 'Generate a bank-acceptable DPR for free in 60 seconds.',
    dprBtn: 'Build DPR',
    checklistTitle: 'Checklist & Step-by-Step Acquisition Guides:',
    badgeMandatory: 'Mandatory',
    badgeRecommended: 'Recommended',
    badgeVerified: 'Verified',
    badgeActionNeeded: 'Action Needed',
    howToGet: 'How to get:',
    btnUploaded: 'Uploaded',
    btnMarkUploaded: 'Mark Uploaded',
    officialPortal: 'Official Portal'
  },
  hi: {
    badgeAi: 'एआई दस्तावेज़ स्कैनर',
    badgePre: 'पूर्व-मूल्यांकन सत्यापन',
    title: 'दस्तावेज़ तत्परता और अंतर समाधानकर्ता',
    subtitle: 'विलंब को समाप्त करने और अधिकतम सरकारी सब्सिडी अनलॉक करने के लिए बैंक में जमा करने से पहले अपने दस्तावेज़ों के स्वास्थ्य की पुष्टि करें।',
    readinessScore: 'तत्परता स्कोर',
    status: 'स्थिति',
    dropzoneTitle: 'एआई सत्यापन हेतु दस्तावेज़ अपलोड करें',
    dropzoneDesc: 'आधार, जाति प्रमाण पत्र, बैंक पासबुक या उद्यम पीडीएफ / छवि (सिम्युलेटेड ओसीआर) खींचें और छोड़ें',
    dropzoneBtn: 'अपलोड सिम्युलेट करें: उद्यम प्रमाण पत्र',
    ocrSimulating: 'ओसीआर स्कैनर द्वारा जांच जारी:',
    ocrExtracted: 'निकाला गया नाम:',
    ocrCategory: 'श्रेणी:',
    ocrValid: '(वैध सत्यापित)।',
    critTitle: 'महत्वपूर्ण दस्तावेज़ अनुपलब्ध',
    dprQuestion: 'विस्तृत परियोजना रिपोर्ट (DPR) नहीं है?',
    dprSubtitle: '60 सेकंड में निःशुल्क बैंक-स्वीकार्य डीपीआर तैयार करें।',
    dprBtn: 'DPR बनाएं',
    checklistTitle: 'दस्तावेज़ चेकलिस्ट और चरण-दर-चरण प्राप्ति मार्गदर्शिका:',
    badgeMandatory: 'अनिवार्य',
    badgeRecommended: 'अनुशंसित',
    badgeVerified: 'सत्यापित',
    badgeActionNeeded: 'कार्रवाई आवश्यक',
    howToGet: 'कैसे प्राप्त करें:',
    btnUploaded: 'अपलोड किया गया',
    btnMarkUploaded: 'अपलोड के रूप में चिह्नित करें',
    officialPortal: 'आधिकारिक पोर्टल'
  },
  pa: {
    badgeAi: 'AI ਦਸਤਾਵੇਜ਼ ਸਕੈਨਰ',
    badgePre: 'ਪੂਰਵ-ਮੁਲਾਂਕਣ ਤਸਦੀਕ',
    title: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ ਅਤੇ ਘਾਟ ਹੱਲਕਰਤਾ',
    subtitle: 'ਦੇਰੀ ਨੂੰ ਖਤਮ ਕਰਨ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸਥਿਤੀ ਦੀ ਜਾਂਚ ਕਰੋ।',
    readinessScore: 'ਤਿਆਰੀ ਸਕੋਰ',
    status: 'ਸਥਿਤੀ',
    dropzoneTitle: 'AI ਤਸਦੀਕ ਲਈ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ',
    dropzoneDesc: 'ਆਧਾਰ, ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ, ਬੈਂਕ ਪਾਸਬੁੱਕ, ਜਾਂ ਉਦਯਮ PDF / ਤਸਵੀਰ (ਸਿਮੂਲੇਟਿਡ OCR) ਖਿੱਚੋ ਅਤੇ ਸੁੱਟੋ',
    dropzoneBtn: 'ਸਿਮੂਲੇਟ ਅੱਪਲੋਡ: ਉਦਯਮ ਸਰਟੀਫਿਕੇਟ',
    ocrSimulating: 'OCR ਸਕੈਨਰ ਦੁਆਰਾ ਜਾਂਚ ਜਾਰੀ:',
    ocrExtracted: 'ਕੱਢਿਆ ਗਿਆ ਨਾਮ:',
    ocrCategory: 'ਸ਼੍ਰੇਣੀ:',
    ocrValid: '(ਸਫਲਤਾਪੂਰਵਕ ਪ੍ਰਮਾਣਿਤ)।',
    critTitle: 'ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਗਾਇਬ ਹਨ',
    dprQuestion: 'ਵੇਰਵੇ ਸਹਿਤ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ (DPR) ਗਾਇਬ ਹੈ?',
    dprSubtitle: '60 ਸਕਿੰਟਾਂ ਵਿੱਚ ਮੁਫਤ ਬੈਂਕ-ਮਨਜ਼ੂਰ DPR ਤਿਆਰ ਕਰੋ।',
    dprBtn: 'DPR ਤਿਆਰ ਕਰੋ',
    checklistTitle: 'ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਅਤੇ ਕਦਮ-ਦਰ-ਕਦਮ ਪ੍ਰਾਪਤੀ ਗਾਈਡ:',
    badgeMandatory: 'ਲਾਜ਼ਮੀ',
    badgeRecommended: 'ਸਿਫ਼ਾਰਸ਼ੀ',
    badgeVerified: 'ਤਸਦੀਕਸ਼ੁਦਾ',
    badgeActionNeeded: 'ਕਾਰਵਾਈ ਦੀ ਲੋੜ',
    howToGet: 'ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ:',
    btnUploaded: 'ਅੱਪਲੋਡ ਕੀਤਾ ਗਿਆ',
    btnMarkUploaded: 'ਅੱਪਲੋਡ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ',
    officialPortal: 'ਸਰਕਾਰੀ ਪੋਰਟਲ'
  },
  te: {
    badgeAi: 'AI డాక్యుమెంట్ స్కానర్',
    badgePre: 'ప్రీ-అప్రైజల్ ధృవీకరణ',
    title: 'పత్రాల సన్నద్ధత & పరిష్కార సాధనం',
    subtitle: 'ఆలస్యాన్ని నివారించడానికి మరియు గరిష్ట ప్రభుత్వ సబ్సిడీని పొందడానికి బ్యాంకుకు సమర్పించే ముందు మీ పత్రాల ఆరోగ్యాన్ని ధృవీకరించండి.',
    readinessScore: 'సన్నద్ధత స్కోర్',
    status: 'స్థితి',
    dropzoneTitle: 'AI ధృవీకరణ కోసం పత్రాలను అప్‌లోడ్ చేయండి',
    dropzoneDesc: 'ఆధార్, కుల ధృవీకరణ పత్రం, బ్యాంక్ పాస్‌బుక్ లేదా ఉద్యమ్ PDF / చిత్రం (సిమ్యులేటెడ్ OCR)',
    dropzoneBtn: 'అప్‌లోడ్ అనుకరించండి: ఉద్యమ్ సర్టిఫికేట్',
    ocrSimulating: 'OCR స్కానర్ ద్వారా పరిశీలన:',
    ocrExtracted: 'సేకరించిన పేరు:',
    ocrCategory: 'వర్గం:',
    ocrValid: '(చెల్లుబాటు ధృవీకరించబడింది).',
    critTitle: 'ముఖ్యమైన పత్రాలు లేవు',
    dprQuestion: 'ప్రాజెక్ట్ నివేదిక (DPR) లేదా?',
    dprSubtitle: '60 సెకన్లలో ఉచితంగా బ్యాంకు ఆమోదించే DPR ని రూపొందించండి.',
    dprBtn: 'DPR రూపొందించండి',
    checklistTitle: 'పత్రాల చెక్‌లిస్ట్ & దశలవారీ సేకరణ మార్గదర్శకాలు:',
    badgeMandatory: 'తప్పనిసరి',
    badgeRecommended: 'సిఫార్సు చేయబడింది',
    badgeVerified: 'ధృవీకరించబడింది',
    badgeActionNeeded: 'చర్య అవసరం',
    howToGet: 'ఎలా పొందాలి:',
    btnUploaded: 'అప్‌లోడ్ చేయబడింది',
    btnMarkUploaded: 'అప్‌లోడ్ చేసినట్లు గుర్తించండి',
    officialPortal: 'అధికారిక పోర్టల్'
  },
  mr: {
    badgeAi: 'AI कागदपत्र स्कॅनर',
    badgePre: 'पूर्व-मूल्यांकन पडताळणी',
    title: 'कागदपत्र सज्जता आणि त्रुटी निवारक',
    subtitle: 'विलंब टाळण्यासाठी आणि जास्तीत जास्त शासकीय अनुदान मिळवण्यासाठी बँकेत अर्ज करण्यापूर्वी आपल्या कागदपत्रांची पडताळणी करा.',
    readinessScore: 'सज्जता गुण (Score)',
    status: 'स्थिती',
    dropzoneTitle: 'AI पडताळणीसाठी कागदपत्रे अपलोड करा',
    dropzoneDesc: 'आधार, जातीचा दाखला, बँक पासबुक किंवा उद्यम PDF / प्रतिमा (सिम्युलेटेड OCR)',
    dropzoneBtn: 'अपलोड सिम्युलेट करा: उद्यम प्रमाणपत्र',
    ocrSimulating: 'OCR स्कॅनरद्वारे तपासणी सुरू:',
    ocrExtracted: 'नाव:',
    ocrCategory: 'प्रवर्ग:',
    ocrValid: '(वैध पडताळले).',
    critTitle: 'महत्त्वाची कागदपत्रे उपलब्ध नाहीत',
    dprQuestion: 'सविस्तर प्रकल्प अहवाल (DPR) नाही का?',
    dprSubtitle: '60 सेकंदात बँकेला स्वीकार्य मोफत DPR तयार करा.',
    dprBtn: 'DPR तयार करा',
    checklistTitle: 'कागदपत्र चेकलिस्ट आणि टप्प्याटप्प्याने मिळवण्याची मार्गदर्शिका:',
    badgeMandatory: 'अनिवार्य',
    badgeRecommended: 'शिफारस केलेले',
    badgeVerified: 'पडताळलेले',
    badgeActionNeeded: 'कृती आवश्यक',
    howToGet: 'कसे मिळवावे:',
    btnUploaded: 'अपलोड केले',
    btnMarkUploaded: 'अपलोड झाल्याचे चिन्हांकित करा',
    officialPortal: 'अधिकृत पोर्टल'
  },
  bn: {
    badgeAi: 'এআই নথি স্ক্যানার',
    badgePre: 'প্রাক-মূল্যায়ন যাচাইকরণ',
    title: 'নথিপত্রের প্রস্তুতি ও ঘাটতি সমাধানকারী',
    subtitle: 'বিলম্ব দূর করতে এবং সর্বোচ্চ সরকারি ভর্তুকি পেতে ব্যাংকে জমা দেওয়ার আগে আপনার নথিপত্রের যথার্থতা যাচাই করুন।',
    readinessScore: 'প্রস্তুতি স্কোর',
    status: 'অবস্থা',
    dropzoneTitle: 'এআই যাচাইয়ের জন্য নথি আপলোড করুন',
    dropzoneDesc: 'আধার, জাতি শংসাপত্র, ব্যাংক পাসবুক বা উদ্যম পিডিএফ / ছবি (সিমুলেটেড OCR)',
    dropzoneBtn: 'আপলোড অনুকরণ করুন: উদ্যম শংসাপত্র',
    ocrSimulating: 'OCR স্ক্যানারের মাধ্যমে যাচাই করা হচ্ছে:',
    ocrExtracted: 'উদ্ধৃত নাম:',
    ocrCategory: 'বিভাগ:',
    ocrValid: '(বৈধভাবে যাচাইকৃত)।',
    critTitle: 'গুরুত্বপূর্ণ নথি অনুপস্থিত',
    dprQuestion: 'বিস্তারিত প্রকল্প প্রতিবেদন (DPR) নেই?',
    dprSubtitle: '৬০ সেকেন্ডে বিনামূল্যে ব্যাংক-গ্রহণযোগ্য ডিপিআর তৈরি করুন।',
    dprBtn: 'DPR তৈরি করুন',
    checklistTitle: 'নথিপত্র চেকলিস্ট ও ধাপে ধাপে প্রাপ্তির নির্দেশিকা:',
    badgeMandatory: 'বাধ্যতামূলক',
    badgeRecommended: 'প্রস্তাবিত',
    badgeVerified: 'যাচাইকৃত',
    badgeActionNeeded: 'পদক্ষেপ প্রয়োজন',
    howToGet: 'কীভাবে পাবেন:',
    btnUploaded: 'আপলোড সম্পন্ন',
    btnMarkUploaded: 'আপলোড চিহ্নিত করুন',
    officialPortal: 'অফিসিয়াল পোর্টাল'
  }
};

export const DocumentReadiness: React.FC = () => {
  const { profile, uploadedDocIds, toggleDocumentUpload, setActiveTab } = useProfile();
  const { language } = useLanguage();
  const t = (key: string) => DOC_LABELS[language]?.[key] || DOC_LABELS.en[key] || key;

  const [report, setReport] = useState<DocumentReadinessReport | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);

  const fetchDocumentAnalysis = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          uploadedDocIds
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error('Error analyzing documents:', err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchDocumentAnalysis();
  }, [profile, uploadedDocIds]);

  const handleSimulatedDrop = (docId: string, docName: string) => {
    setOcrStatus(`${t('ocrSimulating')} ${docName}... ${t('ocrExtracted')} "${profile.fullName}", ${t('ocrCategory')} "${profile.category}" ${t('ocrValid')}`);
    setTimeout(() => {
      toggleDocumentUpload(docId);
      setOcrStatus(null);
    }, 1200);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', margin: '20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span className="badge badge-emerald">{t('badgeAi')}</span>
            <span className="badge badge-indigo">{t('badgePre')}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={24} style={{ color: 'var(--primary-saffron)' }} />
            <span>{t('title')}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {t('subtitle')}
          </p>
        </div>

        {report && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-surface-subtle)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{t('readinessScore')}</span>
              <strong style={{ fontSize: '1.5rem', color: report.overallScore >= 75 ? 'var(--emerald-growth)' : 'var(--accent-amber)' }}>
                {report.overallScore}%
              </strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{t('status')}</span>
              <span className={`badge ${report.overallScore >= 75 ? 'badge-emerald' : 'badge-saffron'}`}>
                {report.readinessLevel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* OCR Simulation Alert */}
      {ocrStatus && (
        <div style={{ padding: '12px 16px', background: 'var(--primary-saffron-glow)', border: '1px solid var(--primary-saffron)', borderRadius: 'var(--radius-sm)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
          <RefreshCw size={16} className="spin-animation" style={{ color: 'var(--primary-saffron)' }} />
          <span>{ocrStatus}</span>
        </div>
      )}

      {/* Main Grid: Upload Dropzone & Document Checklist */}
      <div className="doc-scanner-grid">
        {/* Left Column: Dropzone Simulator & Critical Gaps */}
        <div>
          <div
            className="upload-dropzone"
            onClick={() => handleSimulatedDrop('udyam-registration', 'Udyam Registration')}
            title="Click to simulate uploading a document"
          >
            <Upload size={36} style={{ color: 'var(--primary-saffron)', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{t('dropzoneTitle')}</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              {t('dropzoneDesc')}
            </p>
            <span className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              {t('dropzoneBtn')}
            </span>
          </div>

          {/* Critical Gaps Warning Box */}
          {report && report.criticalGaps.length > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={18} />
                <span>{t('critTitle')} ({report.criticalGaps.length})</span>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.criticalGaps.map((gap, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 1-Click DPR Reminder */}
          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', display: 'block' }}>{t('dprQuestion')}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('dprSubtitle')}</span>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('dpr')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                <span>{t('dprBtn')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Full Document Checklist with Status and Resolution Links */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
            {t('checklistTitle')}
          </h3>

          {report && report.documents.map((doc: DocumentVerificationItem) => {
            const isVerified = doc.status === 'Verified' || doc.status === 'Uploaded';
            return (
              <div key={doc.id} className="doc-item-row">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{doc.name}</strong>
                    <span className={`badge ${doc.importance === 'Mandatory' ? 'badge-saffron' : 'badge-indigo'}`} style={{ fontSize: '0.65rem' }}>
                      {doc.importance === 'Mandatory' ? t('badgeMandatory') : t('badgeRecommended')}
                    </span>
                    <span className={`badge ${isVerified ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.68rem' }}>
                      {isVerified ? t('badgeVerified') : t('badgeActionNeeded')}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {doc.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>{t('howToGet')}</strong> {doc.howToGet} ({doc.issuingAuthority})
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                  <button
                    className={isVerified ? 'btn-success' : 'btn-secondary'}
                    onClick={() => toggleDocumentUpload(doc.id)}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>{t('btnUploaded')}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>{t('btnMarkUploaded')}</span>
                      </>
                    )}
                  </button>

                  {doc.onlinePortalUrl && (
                    <a
                      href={doc.onlinePortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary-saffron)' }}
                    >
                      <span>{t('officialPortal')}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentReadiness;
