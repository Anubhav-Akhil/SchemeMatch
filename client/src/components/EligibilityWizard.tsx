import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile, SocialCategory, Gender, LocationType, SectorType, EducationLevel } from '../types';
import { UserCheck, Sliders, FileCheck, RefreshCw, CheckCircle2, Sparkles, Wand2, ArrowRight, IndianRupee, Award, AlertCircle, Loader2, ChevronRight, Briefcase, User, ShieldCheck, Terminal, Compass, Layers } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface MissingFieldItem {
  label: string;
  step: 'personal' | 'business';
}

const getMissingRequiredFields = (profile: UserProfile): MissingFieldItem[] => {
  const missing: MissingFieldItem[] = [];
  if (!profile.category) missing.push({ label: 'Social Category', step: 'personal' });
  if (!profile.locationType) missing.push({ label: 'Location Domicile', step: 'personal' });
  if (!profile.age || Number(profile.age) <= 0) missing.push({ label: 'Age', step: 'personal' });
  if (!profile.gender) missing.push({ label: 'Gender', step: 'personal' });
  if (!profile.tradeType && !profile.sector) missing.push({ label: 'Business Trade or Sector', step: 'business' });
  if (!profile.requiredLoanAmount || Number(profile.requiredLoanAmount) <= 0) missing.push({ label: 'Required Loan Amount', step: 'business' });
  return missing;
};

export const EligibilityWizard: React.FC = () => {
  const {
    profile,
    setProfile,
    updateProfileField,
    runMatching,
    isLoadingMatches,
    hasCalculated,
    matchResults,
    totalPotentialSubsidy,
    setActiveTab
  } = useProfile();
  const { t } = useLanguage();

  const [activeStep, setActiveStep] = useState<'personal' | 'business' | 'docs'>('personal');
  const [aiInputText, setAiInputText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [showAiBox, setShowAiBox] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (validationError) {
      const isComplete = getMissingRequiredFields(profile).length === 0;
      if (isComplete) {
        setValidationError(null);
      }
    }
  }, [profile, validationError]);

  const handleAiExtraction = async (samplePrompt?: string) => {
    const textToProcess = samplePrompt || aiInputText;
    if (!textToProcess.trim()) return;

    setIsExtracting(true);
    setExtractionNotice(null);
    setValidationError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/extract-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess })
      });

      if (res.ok) {
        const extracted = await res.json();
        const updated: UserProfile = { ...profile };
        const extractIfPresent = <K extends keyof UserProfile>(key: K) => {
          const value = extracted[key];
          if (value !== undefined && value !== null && String(value).trim() !== '') {
            updated[key] = value as UserProfile[K];
          }
        };
        (['fullName', 'age', 'gender', 'category', 'locationType', 'state', 'sector', 'tradeType',
          'requiredLoanAmount', 'totalProjectCost', 'promoterContributionAvailable', 'annualFamilyIncome',
          'isDifferentlyAbled'] as Array<keyof UserProfile>).forEach(extractIfPresent);

        // Apply only values returned by extraction. Matching is a separate user action.
        setProfile(updated);
        const missing = getMissingRequiredFields(updated);
        setExtractionNotice(missing.length > 0
          ? `Extracted details. Please fill the remaining required fields: ${missing.map((field) => field.label).join(', ')}.`
          : 'Required details are complete. Click Calculate Eligible Schemes & Subsidies when you are ready.');

        if (samplePrompt) setAiInputText(samplePrompt);
      }
    } catch (err) {
      console.error('AI extraction error:', err);
      setExtractionNotice('AI service connection error. Please try again or fill form manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = getMissingRequiredFields(profile).map(
      (field) => `${field.label} (in Step ${field.step === 'personal' ? '1: Identity' : '2: Business'})`
    );

    if (missingFields.length > 0) {
      setValidationError(
        `Please complete the following required details before calculating scheme recommendations:\n• ${missingFields.join('\n• ')}`
      );
      if (!profile.category || !profile.locationType) {
        setActiveStep('personal');
      } else {
        setActiveStep('business');
      }
      return;
    }

    setValidationError(null);
    await runMatching(profile);
    // Directly navigate user to the Scheme Recommender so they immediately see the matched schemes and subsidies
    setActiveTab('matcher');
  };

  return (
    <div className="tactile-card-3d" style={{ padding: '24px 28px', margin: '12px 0 24px 0' }}>
      {/* Institutional Terminal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              <ShieldCheck size={12} />
              <span>OFFICIAL MSME & LENDING TAXONOMY</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              v2026.4
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #EA580C 0%, #F59E0B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 8px rgba(234, 88, 12, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}>
              <Sliders size={18} />
            </div>
            <span>{t.wizard.title}</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            {t.wizard.subtitle}
          </p>
        </div>

        {/* Holographic Verification Pod */}
        <div className="hologram-seal-3d" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              SIDBI / RBI COMPLIANT
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              Pre-Appraisal Engine
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Natural-Language Profile Parser Deck */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.03) 0%, rgba(15, 23, 42, 0.01) 100%)',
        border: '1px solid var(--border-subtle)',
        borderTop: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.02)',
        borderRadius: '14px',
        padding: '16px 18px',
        marginBottom: '22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={15} style={{ color: 'var(--primary-saffron)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
              Natural-Language Profile Extraction Console
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(79, 70, 229, 0.1)',
              color: '#4F46E5',
              padding: '2px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              border: '1px solid rgba(79, 70, 229, 0.2)'
            }}>
              NLP PARSER
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Instant auto-population
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. 30-yr man in rural UP doing tailoring enterprise, requires 1.5L bank credit"
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiExtraction(); } }}
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '0.86rem',
                borderRadius: '9px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.04)',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            />
          </div>
          <button
            type="button"
            className="tactile-btn-primary-3d"
            disabled={isExtracting}
            onClick={() => handleAiExtraction()}
            style={{
              padding: '10px 18px',
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            {isExtracting ? (
              <>
                <Loader2 size={15} className="spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <Wand2 size={15} />
                <span>Extract Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try Preset:</span>
          <button
            type="button"
            className="tactile-btn-secondary-3d"
            onClick={() => handleAiExtraction('Sandeep Kumar, 30, man in rural UP doing tailoring business, needs 1.5L loan')}
            style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '7px' }}
          >
            🧵 Rural Tailoring (1.5L)
          </button>
          <button
            type="button"
            className="tactile-btn-secondary-3d"
            onClick={() => handleAiExtraction('Ramesh, 28, OBC weaver in Varanasi, needs 10L loan for looms')}
            style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '7px' }}
          >
            🧶 Varanasi Handloom (10L)
          </button>
          <button
            type="button"
            className="tactile-btn-secondary-3d"
            onClick={() => handleAiExtraction('Deepak, 42, Safai Karamchari dependent, needs 3L for sanitation equipment')}
            style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '7px' }}
          >
            🧹 Sanitation Logistics (3L)
          </button>
        </div>

        {extractionNotice && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: getMissingRequiredFields(profile).length > 0 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: getMissingRequiredFields(profile).length > 0 ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.76rem',
            color: getMissingRequiredFields(profile).length > 0 ? '#D97706' : '#059669',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={14} />
            <span>{extractionNotice}</span>
          </div>
        )}
      </div>

      {/* 3D Segmented Step Selector */}
      <div className="tactile-segment-group" style={{ marginBottom: '22px' }}>
        <button
          type="button"
          onClick={() => setActiveStep('personal')}
          className={`tactile-segment-btn ${activeStep === 'personal' ? 'active' : ''}`}
        >
          <User size={14} />
          <span>1. Identity & Domicile</span>
          {profile.category && profile.locationType ? (
            <span style={{ fontSize: '0.62rem', background: '#10B981', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>✓ Verified</span>
          ) : (
            <span style={{
              fontSize: '0.62rem',
              background: activeStep === 'personal' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(0,0,0,0.06)',
              color: activeStep === 'personal' ? 'var(--primary-saffron)' : 'var(--text-muted)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              Required
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveStep('business')}
          className={`tactile-segment-btn ${activeStep === 'business' ? 'active' : ''}`}
        >
          <Briefcase size={14} />
          <span>2. Enterprise & Capital</span>
          {profile.tradeType || profile.sector ? (
            <span style={{
              fontSize: '0.62rem',
              background: '#10B981',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 800
            }}>
              ✓ Specified
            </span>
          ) : (
            <span style={{
              fontSize: '0.62rem',
              background: 'rgba(0,0,0,0.06)',
              color: 'var(--text-muted)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              Required
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveStep('docs')}
          className={`tactile-segment-btn ${activeStep === 'docs' ? 'active' : ''}`}
        >
          <FileCheck size={14} />
          <span>3. Dossier & Verification</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal & Demographics */}
        {activeStep === 'personal' && (
          <div>
            <div className="form-group">
              <label htmlFor="wizard-full-name">{t.wizard.nameLabel}</label>
              <input
                id="wizard-full-name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={profile.fullName || ''}
                onChange={(e) => updateProfileField('fullName', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="wizard-category">{t.wizard.categoryLabel}</label>
                <select
                  id="wizard-category"
                  value={profile.category || ''}
                  onChange={(e) => updateProfileField('category', e.target.value as SocialCategory)}
                  style={{
                    width: '100%',
                    borderColor: !profile.category ? '#F59E0B' : undefined
                  }}
                >
                  <option value="">-- Select Category (Not specified in text) --</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="SafaiKaramchari">Safai Karamchari Dependent</option>
                  <option value="DNT">De-Notified / Nomadic Tribe (DNT)</option>
                  <option value="Minority">Minority Community</option>
                  <option value="General">General Category</option>
                </select>
                {!profile.category && (
                  <small style={{ color: '#D97706', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                    *Not specified in description. Select to unlock MoSJE special subsidies (up to 35%).
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="wizard-gender">{t.wizard.genderLabel}</label>
                <select
                  id="wizard-gender"
                  value={profile.gender || ''}
                  onChange={(e) => updateProfileField('gender', e.target.value as Gender)}
                  style={{ width: '100%' }}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="wizard-age">{t.wizard.ageLabel}</label>
                <input
                  id="wizard-age"
                  type="number"
                  min="18"
                  max="75"
                  value={profile.age || ''}
                  onChange={(e) => updateProfileField('age', parseInt(e.target.value, 10) || 18)}
                  placeholder="e.g. 30"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="wizard-location">{t.wizard.locationLabel}</label>
                <select
                  id="wizard-location"
                  value={profile.locationType || ''}
                  onChange={(e) => updateProfileField('locationType', e.target.value as LocationType)}
                  style={{
                    width: '100%',
                    borderColor: !profile.locationType ? '#F59E0B' : undefined
                  }}
                >
                  <option value="">-- Select Location (Not specified in text) --</option>
                  <option value="Rural">Rural (ग्रामीण - 35% PMEGP)</option>
                  <option value="Urban">Urban (शहरी - 25% PMEGP)</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                </select>
                {!profile.locationType && (
                  <small style={{ color: '#D97706', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                    *Not specified in description. Defaults to open/all locations.
                  </small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="wizard-state">State / UT (राज्य)</label>
                <input
                  id="wizard-state"
                  type="text"
                  placeholder="e.g. Uttar Pradesh, Bihar, Maharashtra"
                  value={profile.state || ''}
                  onChange={(e) => updateProfileField('state', e.target.value)}
                  style={{
                    width: '100%',
                    borderColor: !profile.state ? '#F59E0B' : undefined
                  }}
                />
                {!profile.state && (
                  <small style={{ color: '#D97706', fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                    *Not specified in description.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="wizard-income">{t.wizard.incomeLabel}</label>
                <input
                  id="wizard-income"
                  type="number"
                  step="10000"
                  value={profile.annualFamilyIncome || ''}
                  onChange={(e) => updateProfileField('annualFamilyIncome', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 150000 (Optional)"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label" style={{ marginTop: '6px' }}>
                <input
                  type="checkbox"
                  checked={profile.isDifferentlyAbled}
                  onChange={(e) => updateProfileField('isDifferentlyAbled', e.target.checked)}
                />
                <span>Differently-Abled (Divyangjan / PwD)</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Business & Capital Needs */}
        {activeStep === 'business' && (
          <div>
            <div className="form-group">
              <label htmlFor="wizard-sector">{t.wizard.sectorLabel}</label>
              <select
                id="wizard-sector"
                value={profile.sector || ''}
                onChange={(e) => updateProfileField('sector', e.target.value as SectorType)}
                style={{ width: '100%' }}
              >
                <option value="">-- Select Sector --</option>
                <option value="Textiles">Textiles / Tailoring / Apparel</option>
                <option value="ArtisanHandicraft">Artisan / Handloom & Handicrafts</option>
                <option value="Manufacturing">Manufacturing / Workshop Unit</option>
                <option value="Services">Services / Repair / Digital</option>
                <option value="StreetVending">Street Vending / Food Stall</option>
                <option value="AgroAllied">Agro-Allied / Food Processing</option>
                <option value="Sanitation">Sanitation / Cleaning Logistics</option>
                <option value="Trading">Trading / Small Retail</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="wizard-trade-type">Trade / Activity Name</label>
              <input
                id="wizard-trade-type"
                type="text"
                value={profile.tradeType || ''}
                onChange={(e) => updateProfileField('tradeType', e.target.value)}
                placeholder="e.g. Silk Weaving, Chaat Cart, Tailoring"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="wizard-loan-amount">{t.wizard.loanLabel}</label>
                <input
                  id="wizard-loan-amount"
                  type="number"
                  step="10000"
                  value={profile.requiredLoanAmount || ''}
                  onChange={(e) => updateProfileField('requiredLoanAmount', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 150000"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="wizard-total-project-cost">{t.wizard.projectCostLabel}</label>
                <input
                  id="wizard-total-project-cost"
                  type="number"
                  step="10000"
                  value={profile.totalProjectCost || ''}
                  onChange={(e) => updateProfileField('totalProjectCost', parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 200000"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="wizard-margin-amount">{t.wizard.marginLabel}</label>
              <input
                id="wizard-margin-amount"
                type="number"
                step="5000"
                value={profile.promoterContributionAvailable || ''}
                onChange={(e) => updateProfileField('promoterContributionAvailable', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g. 10000"
                style={{ width: '100%' }}
              />
              <small style={{ color: 'var(--emerald-growth)', fontSize: '0.75rem', fontWeight: 600 }}>
                *Special category requires only 5% promoter margin!
              </small>
            </div>
          </div>
        )}

        {/* Step 3: Existing Documents */}
        {activeStep === 'docs' && (
          <div>
            <div className="form-group">
              <label>Select Documents You Currently Hold:</label>
              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasCasteCertificate}
                    onChange={(e) => updateProfileField('hasCasteCertificate', e.target.checked)}
                  />
                  <span>Caste / Category Certificate</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasExistingUdyam}
                    onChange={(e) => updateProfileField('hasExistingUdyam', e.target.checked)}
                  />
                  <span>Udyam MSME Registration</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasBankStatement6Months}
                    onChange={(e) => updateProfileField('hasBankStatement6Months', e.target.checked)}
                  />
                  <span>6 Months Bank Statement / Passbook</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasLandOrRentDeed}
                    onChange={(e) => updateProfileField('hasLandOrRentDeed', e.target.checked)}
                  />
                  <span>Shop Rent Deed / Workplace Proof</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasSkillTrainingCertificate}
                    onChange={(e) => updateProfileField('hasSkillTrainingCertificate', e.target.checked)}
                  />
                  <span>Skill / Trade Training Certificate</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.hasProjectReport}
                    onChange={(e) => updateProfileField('hasProjectReport', e.target.checked)}
                  />
                  <span>Detailed Project Report (DPR)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Matching Button */}
        <button
          type="submit"
          className="tactile-btn-primary-3d"
          style={{ width: '100%', marginTop: '16px', padding: '13px 20px', fontSize: '0.94rem', justifyContent: 'center' }}
          disabled={isLoadingMatches}
        >
          {isLoadingMatches ? (
            <>
              <RefreshCw size={18} className="spin-animation" />
              <span>{t.wizard.calculatingText}</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>{t.wizard.matchButton}</span>
            </>
          )}
        </button>

        {/* Validation Warning when clicking without filling profile */}
        {validationError && (
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#DC2626',
            fontSize: '0.84rem',
            lineHeight: 1.5
          }}>
            <AlertCircle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px', fontWeight: 700 }}>Profile Details Required</strong>
              <span style={{ whiteSpace: 'pre-line' }}>{validationError}</span>
            </div>
          </div>
        )}

        {/* Instant Calculation Results & Subsidy Preview */}
        {hasCalculated && matchResults.length > 0 && getMissingRequiredFields(profile).length === 0 && (
          <div className="tactile-stat-pod-3d" style={{
            marginTop: '18px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: '#059669' }} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {matchResults.length} Eligible Scheme Recommendations Available
                </span>
              </div>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#059669',
                background: 'rgba(5, 150, 105, 0.12)',
                padding: '4px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                <IndianRupee size={13} />
                <span>Up to ₹{(totalPotentialSubsidy / 100000).toFixed(2)}L Capital Subsidy Available</span>
              </div>
            </div>

            {/* Top Recommended Preview Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matchResults.slice(0, 2).map((m) => (
                <div
                  key={m.scheme.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '9px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                      {m.scheme.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {m.estimatedSubsidyAmount > 0
                        ? `₹${m.estimatedSubsidyAmount.toLocaleString('en-IN')} Grant / Subsidy`
                        : 'Concessional Interest Credit'} · Match Score: <strong style={{ color: 'var(--text-primary)' }}>{m.matchScore}%</strong>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    background: '#10B981',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    RECOMMENDED
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Recommender Nav Button */}
            <button
              type="button"
              className="tactile-btn-primary-3d"
              onClick={() => setActiveTab('matcher')}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px 16px',
                fontSize: '0.86rem'
              }}
            >
              <span>View All {matchResults.length} Recommended Schemes & Subsidies</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
