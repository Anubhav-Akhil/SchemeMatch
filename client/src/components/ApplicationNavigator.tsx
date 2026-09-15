import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { Compass, CheckCircle2, Building, PhoneCall, ExternalLink, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const ApplicationNavigator: React.FC = () => {
  const { profile, setActiveTab } = useProfile();
  const { t } = useLanguage();

  const roadmapStages = [
    {
      step: 1,
      title: 'Documentation & Bank-Ready DPR Formulation',
      hindiTitle: 'दस्तावेज तैयारी एवं विस्तृत परियोजना रिपोर्ट (डीपीआर)',
      description: 'Prepare Aadhaar, Caste Certificate, 6-month bank statements, machinery quotations with GSTIN, and the Detailed Project Report.',
      tip: 'Use SchemeMatch AI to generate your bank-formatted financial model in 60 seconds with 3-year cash flows.',
      actionLabel: 'Check Document Checklist',
      actionTab: 'documents' as const,
      status: 'Current'
    },
    {
      step: 2,
      title: 'Online Portal / SCA Submission',
      hindiTitle: 'ऑनलाइन पोर्टल अथवा राज्य चैनलाइजिंग एजेंसी में आवेदन',
      description: 'Submit your formal application on the designated government portal (e.g. kviconline.gov.in for PMEGP, standupmitra.in for Stand-Up India, or State SC/ST Development Corp for NSFDC).',
      tip: 'Ensure mobile number is Aadhaar-seeded for instant OTP authentication and tracking ID generation.',
      actionLabel: 'View Scheme Portals',
      actionTab: 'matcher' as const,
      status: 'Upcoming'
    },
    {
      step: 3,
      title: 'District Task Force (DTFC) / DIC Vetting',
      hindiTitle: 'जिला स्तरीय टास्क फोर्स समिति द्वारा सत्यापन',
      description: 'The General Manager of your District Industries Centre (DIC) and Task Force Committee reviews your project viability and forwards the application to your preferred bank branch.',
      tip: 'Special category entrepreneurs (SC/ST/OBC/Women) receive priority fast-track forwarding.',
      actionLabel: null,
      status: 'Upcoming'
    },
    {
      step: 4,
      title: 'Bank Branch Appraisal & Credit Sanction',
      hindiTitle: 'बैंक शाखा मूल्यांकन एवं ऋण स्वीकृति पत्र (Sanction Letter)',
      description: 'The appraising bank branch manager examines the DPR, DSCR viability (>1.5), and issues a Formal Sanction Letter under CGTMSE collateral-free guarantee cover.',
      tip: 'Promoter margin money is only 5% for marginalized borrowers under PMEGP & NSFDC.',
      actionLabel: null,
      status: 'Upcoming'
    },
    {
      step: 5,
      title: 'Entrepreneurship Development Programme (EDP) Training',
      hindiTitle: 'उद्यमिता विकास प्रशिक्षण (ईडीपी)',
      description: 'Mandatory 10-day EDP training conducted either online via KVIC e-portal or physically at your nearest Rural Self Employment Training Institute (RSETI).',
      tip: 'Stipend and training certificates are provided free of cost.',
      actionLabel: null,
      status: 'Upcoming'
    },
    {
      step: 6,
      title: 'Loan Disbursement & Margin Money Subsidy DBT Release',
      hindiTitle: 'ऋण वितरण एवं सरकारी सब्सिडी (मार्जिन मनी) की मुक्ति',
      description: 'The bank disburses the term loan directly to the machinery vendor. The 25% to 35% government capital subsidy is credited to a Term Deposit Receipt (TDR) account for 3 years without interest.',
      tip: 'After 3 years of successful operation and physical verification, the subsidy is fully adjusted against the loan balance!',
      actionLabel: null,
      status: 'Upcoming'
    }
  ];

  const helplines = [
    {
      name: 'Khadi & Village Industries Commission (PMEGP)',
      phone: '1800 180 6763 / 022-2671 9465',
      website: 'https://www.kviconline.gov.in',
      tag: 'MoMSME'
    },
    {
      name: 'National Scheduled Castes Finance & Dev Corp (NSFDC)',
      phone: '1800 11 0580 / 011-2205 4391',
      website: 'https://nsfdc.nic.in',
      tag: 'MoSJE'
    },
    {
      name: 'National Backward Classes Finance & Dev Corp (NBCFDC)',
      phone: '1800 102 3399 / 011-4585 4400',
      website: 'https://nbcfdc.gov.in',
      tag: 'MoSJE'
    },
    {
      name: 'National Safai Karamcharis Finance & Dev Corp (NSKFDC)',
      phone: '1800 11 8282 / 011-2334 0691',
      website: 'https://nskfdc.nic.in',
      tag: 'MoSJE'
    },
    {
      name: 'Stand-Up India / SIDBI Helpdesk',
      phone: '1800 180 1111',
      website: 'https://www.standupmitra.in',
      tag: 'SIDBI'
    },
    {
      name: 'PM SVANidhi / Street Vendor Helpline',
      phone: '1800 11 1979',
      website: 'https://pmsvanidhi.mohua.gov.in',
      tag: 'MoHUA'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '28px', margin: '20px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
          <span className="badge badge-indigo">End-to-End Execution Guide</span>
          <span className="badge badge-emerald">6-Stage Milestone Roadmap</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={24} style={{ color: 'var(--primary-saffron)' }} />
          <span>Application Navigator & Government Touchpoints</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          A clear, jargon-free roadmap guiding you through online portal submission, DIC task-force approval, bank sanction, and subsidy release.
        </p>
      </div>

      {/* 6-Step Visual Timeline */}
      <div className="roadmap-timeline">
        {roadmapStages.map((stage) => (
          <div key={stage.step} className="roadmap-step-card glass-panel">
            <div className="step-number-circle">
              {stage.step}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  {stage.title}
                </h3>
                <span className={`badge ${stage.status === 'Current' ? 'badge-saffron' : 'badge-indigo'}`}>
                  {stage.status}
                </span>
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                {stage.hindiTitle}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {stage.description}
              </p>

              <div style={{ padding: '8px 12px', background: 'rgba(255, 111, 0, 0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#C2410C', fontWeight: 500, marginBottom: '12px' }}>
                💡 <strong>Pro-Tip:</strong> {stage.tip}
              </div>

              {stage.actionLabel && (
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab(stage.actionTab)}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <span>{stage.actionLabel}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* National Helplines Directory */}
      <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={20} style={{ color: 'var(--primary-saffron)' }} />
          <span>Official Ministry & Apex Corporation Helplines</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {helplines.map((hl, idx) => (
            <div key={idx} style={{ padding: '14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-saffron" style={{ fontSize: '0.68rem' }}>{hl.tag}</span>
                <a href={hl.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Website</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>{hl.name}</strong>
              <div style={{ color: 'var(--trust-indigo)', fontWeight: 600, fontSize: '0.85rem' }}>
                📞 {hl.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
