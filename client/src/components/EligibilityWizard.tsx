import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile, SocialCategory, Gender, LocationType, SectorType, EducationLevel } from '../types';
import { UserCheck, Sliders, FileCheck, RefreshCw, CheckCircle2, Sparkles, Wand2, ArrowRight, IndianRupee, Award, AlertCircle, Loader2, ChevronRight, Briefcase, User } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface MissingFieldItem {
  key: string;
  label: string;
  step: 'personal' | 'business';
  reason: string;
}

interface ExtractionGuidance {
  trade?: string;
  sector?: string;
  confidence: number;
  missingFields: MissingFieldItem[];
}

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
  const [guidance, setGuidance] = useState<ExtractionGuidance | null>(null);
  const [showAiBox, setShowAiBox] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (validationError) {
      const isComplete = Boolean(
        profile.category &&
        profile.locationType &&
        (profile.tradeType || profile.sector) &&
        profile.requiredLoanAmount && Number(profile.requiredLoanAmount) > 0
      );
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
    setGuidance(null);
    setValidationError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/extract-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess })
      });

      if (res.ok) {
        const extracted = await res.json();
        
        const extractedTrade = extracted.tradeType !== undefined && extracted.tradeType !== null && String(extracted.tradeType).trim() !== ''
          ? String(extracted.tradeType).trim()
          : '';
        const extractedSector = extracted.sector !== undefined && extracted.sector !== null && String(extracted.sector).trim() !== ''
          ? String(extracted.sector).trim()
          : '';

        setProfile((prev) => {
          // STRICT EXTRACTION POLICY:
          // Only populate attributes explicitly found in text.
          // Unmentioned fields (category, locationType, state, income) are NOT filled automatically!
          const tradeToSet = extractedTrade || prev.tradeType;
          const sectorToSet = (extractedSector || prev.sector || (extractedTrade ? 'Textiles' : 'Services')) as SectorType;

          const updated: UserProfile = {
            ...prev,
            fullName: extracted.fullName !== undefined && extracted.fullName !== null && String(extracted.fullName).trim() !== ''
              ? extracted.fullName
              : prev.fullName,
            age: extracted.age !== undefined && extracted.age !== null ? extracted.age : prev.age,
            gender: extracted.gender !== undefined && extracted.gender !== null ? extracted.gender : prev.gender,
            category: extracted.category !== undefined && extracted.category !== null ? extracted.category : prev.category,
            locationType: extracted.locationType !== undefined && extracted.locationType !== null ? extracted.locationType : prev.locationType,
            state: extracted.state !== undefined && extracted.state !== null ? extracted.state : prev.state,
            sector: sectorToSet,
            tradeType: tradeToSet,
            businessName: tradeToSet
              ? `${extracted.fullName || prev.fullName || 'My'} ${tradeToSet} Enterprise`
              : prev.businessName,
            requiredLoanAmount: extracted.requiredLoanAmount !== undefined && extracted.requiredLoanAmount !== null
              ? extracted.requiredLoanAmount
              : prev.requiredLoanAmount,
            totalProjectCost: extracted.totalProjectCost !== undefined && extracted.totalProjectCost !== null
              ? extracted.totalProjectCost
              : (extracted.requiredLoanAmount ? Math.round(extracted.requiredLoanAmount * 1.15) : prev.totalProjectCost),
            promoterContributionAvailable: extracted.promoterContributionAvailable !== undefined && extracted.promoterContributionAvailable !== null
              ? extracted.promoterContributionAvailable
              : (extracted.requiredLoanAmount ? Math.round(extracted.requiredLoanAmount * 0.05) : prev.promoterContributionAvailable),
            annualFamilyIncome: extracted.annualFamilyIncome !== undefined && extracted.annualFamilyIncome !== null
              ? extracted.annualFamilyIncome
              : prev.annualFamilyIncome,
            isDifferentlyAbled: extracted.isDifferentlyAbled !== undefined && extracted.isDifferentlyAbled !== null
              ? extracted.isDifferentlyAbled
              : prev.isDifferentlyAbled
          };

          // NOTE: DO NOT call runMatching(updated) here!
          // Scheme recommendations must only be calculated after the user completes the profile and clicks Calculate.
          return updated;
        });

        // Compute missing required fields to guide user to complete before recommendation
        const missing: MissingFieldItem[] = [];
        const finalCategory = extracted.category || profile.category;
        const finalLocation = extracted.locationType || profile.locationType;
        const finalAge = extracted.age || profile.age;
        const finalGender = extracted.gender || profile.gender;
        const finalLoan = extracted.requiredLoanAmount || profile.requiredLoanAmount;

        if (!finalCategory) {
          missing.push({
            key: 'category',
            label: 'Social Category',
            step: 'personal',
            reason: 'Unlocks up to 35% MoSJE / PMEGP special subsidies (SC / ST / OBC / Safai Karamchari / Minority)'
          });
        }
        if (!finalLocation) {
          missing.push({
            key: 'location',
            label: 'Location Domicile',
            step: 'personal',
            reason: 'Select Rural for 35% subsidy or Urban for 25% subsidy under PMEGP'
          });
        }
        if (!finalAge || !finalGender) {
          missing.push({
            key: 'age_gender',
            label: 'Age & Gender',
            step: 'personal',
            reason: 'Verified criteria for youth (18+) and women entrepreneur benefit quotas'
          });
        }
        if (!finalLoan || Number(finalLoan) <= 0) {
          missing.push({
            key: 'loan',
            label: 'Required Loan Amount',
            step: 'business',
            reason: 'Needed to calculate loan limits and capital grant percentage (Mudra, PMEGP, etc.)'
          });
        }

        const confidence = extracted.confidenceScore || 92;
        const tradeName = extractedTrade || (extractedSector ? `${extractedSector} Enterprise` : 'Trade');
        const sectorName = extractedSector || 'Textiles';

        setGuidance({
          trade: tradeName,
          sector: sectorName,
          confidence,
          missingFields: missing
        });

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

    const missingFields: string[] = [];
    if (!profile.tradeType && !profile.sector) {
      missingFields.push('Business Trade or Sector (in Step 2: Business)');
    }
    if (!profile.category) {
      missingFields.push('Social Category (in Step 1: Identity) — needed for MoSJE / PMEGP special subsidies (up to 35%)');
    }
    if (!profile.locationType) {
      missingFields.push('Location Domicile: Rural or Urban (in Step 1: Identity) — needed for rural vs urban subsidy rates');
    }
    if (!profile.requiredLoanAmount || Number(profile.requiredLoanAmount) <= 0) {
      missingFields.push('Required Loan Amount (in Step 2: Business) — needed to match loan limits & subsidies');
    }

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
    <div className="wizard-card glass-panel">
      <div className="wizard-header">
        <h3>
          <Sliders size={20} style={{ color: 'var(--primary-saffron)' }} />
          <span>{t.wizard.title}</span>
        </h3>
        <p>{t.wizard.subtitle}</p>
      </div>

      {/* AI Quick Profile Extraction Bar */}
      <div className="wizard-ai-box" style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wand2 size={16} style={{ color: '#6366F1' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Natural-Language Profile Extractor
            </span>
            <span style={{ fontSize: '0.65rem', background: '#6366F1', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              AI ENGINE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="e.g. 30-yr man in rural UP doing tailoring business, needs 1.5L loan"
            value={aiInputText}
            onChange={(e) => setAiInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiExtraction(); } }}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '0.84rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={isExtracting}
            onClick={() => handleAiExtraction()}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            {isExtracting ? (
              <>
                <Loader2 size={14} className="spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Extract</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try:</span>
          <button
            type="button"
            onClick={() => handleAiExtraction('Sandeep Kumar, 30, man in rural UP doing tailoring business, needs 1.5L loan')}
            style={{
              fontSize: '0.68rem',
              padding: '2px 8px',
              borderRadius: '99px',
              border: '1px dashed var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            🧵 Tailoring Enterprise (1.5L)
          </button>
          <button
            type="button"
            onClick={() => handleAiExtraction('Ramesh, 28, OBC weaver in Varanasi, needs 10L loan for looms')}
            style={{
              fontSize: '0.68rem',
              padding: '2px 8px',
              borderRadius: '99px',
              border: '1px dashed var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            🧵 OBC Weaver (UP, 10L)
          </button>
          <button
            type="button"
            onClick={() => handleAiExtraction('Deepak, 42, Safai Karamchari dependent, needs 3L for sanitation equipment')}
            style={{
              fontSize: '0.68rem',
              padding: '2px 8px',
              borderRadius: '99px',
              border: '1px dashed var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            🧹 Sanitation (3L)
          </button>
        </div>

        {extractionNotice && !guidance && (
          <div style={{
            marginTop: '8px',
            fontSize: '0.74rem',
            color: '#059669',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={13} />
            <span>{extractionNotice}</span>
          </div>
        )}

        {/* AI Extraction Guidance Card - Tells user what was filled in business and prompts to complete remaining fields */}
        {guidance && (
          <div style={{
            marginTop: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  Business Column Filled: <strong style={{ color: '#059669' }}>{guidance.trade}</strong> ({guidance.sector})
                </span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '99px'
              }}>
                ✨ {guidance.confidence}% Entity Confidence
              </span>
            </div>

            {guidance.missingFields.length > 0 && (
              <div style={{
                background: 'var(--bg-surface)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  fontWeight: 700,
                  color: 'var(--primary-saffron, #EA580C)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={14} style={{ color: 'var(--primary-saffron, #EA580C)' }} />
                  <span>Please complete the remaining profile fields below before calculating schemes:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '6px' }}>
                  {guidance.missingFields.map((field) => (
                    <div
                      key={field.key}
                      onClick={() => setActiveStep(field.step)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px dashed var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.76rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-saffron, #EA580C)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{field.label}:</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{field.reason}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary-saffron, #EA580C)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        Go to {field.step === 'personal' ? 'Step 1' : 'Step 2'} →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <button
                type="button"
                onClick={() => setActiveStep('personal')}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  background: activeStep === 'personal' ? 'var(--primary-saffron)' : 'var(--bg-surface-elevated)',
                  color: activeStep === 'personal' ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                1. Complete Identity Details (Category, Age, Location)
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('business')}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  background: activeStep === 'business' ? 'var(--primary-saffron)' : 'var(--bg-surface-elevated)',
                  color: activeStep === 'business' ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                2. View Business Column ({guidance.trade})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mini Stepper Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => setActiveStep('personal')}
          style={{
            flex: 1,
            padding: '9px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            background: activeStep === 'personal' ? 'var(--primary-saffron)' : 'var(--bg-surface-subtle)',
            color: activeStep === 'personal' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>1. Identity</span>
          {profile.category && profile.locationType ? (
            <span style={{ fontSize: '0.62rem', background: '#10B981', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>✓</span>
          ) : (
            <span style={{
              fontSize: '0.62rem',
              background: activeStep === 'personal' ? 'rgba(255,255,255,0.25)' : 'rgba(234, 88, 12, 0.14)',
              color: activeStep === 'personal' ? '#fff' : 'var(--primary-saffron, #EA580C)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              Needs Info
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('business')}
          style={{
            flex: 1,
            padding: '9px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            background: activeStep === 'business' ? 'var(--primary-saffron)' : 'var(--bg-surface-subtle)',
            color: activeStep === 'business' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>2. Business</span>
          {profile.tradeType ? (
            <span style={{
              fontSize: '0.62rem',
              background: activeStep === 'business' ? 'rgba(255,255,255,0.25)' : 'rgba(16, 185, 129, 0.15)',
              color: activeStep === 'business' ? '#fff' : '#059669',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              ✓ {profile.tradeType}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('docs')}
          style={{
            flex: 1,
            padding: '9px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            background: activeStep === 'docs' ? 'var(--primary-saffron)' : 'var(--bg-surface-subtle)',
            color: activeStep === 'docs' ? '#FFFFFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          3. Documents
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
          className="btn-primary"
          style={{ width: '100%', marginTop: '12px' }}
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
            marginTop: '12px',
            padding: '12px 14px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
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
              <strong style={{ display: 'block', marginBottom: '2px' }}>Profile Details Required</strong>
              <span style={{ whiteSpace: 'pre-line' }}>{validationError}</span>
            </div>
          </div>
        )}

        {/* Instant Calculation Results & Subsidy Preview */}
        {hasCalculated && matchResults.length > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '14px 16px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={18} style={{ color: '#059669' }} />
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  🎉 {matchResults.length} Eligible Schemes Calculated!
                </span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#059669',
                background: 'rgba(5, 150, 105, 0.12)',
                padding: '3px 10px',
                borderRadius: '99px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IndianRupee size={13} />
                <span>Up to ₹{(totalPotentialSubsidy / 100000).toFixed(2)}L Capital Subsidy Available</span>
              </div>
            </div>

            {/* Top Recommended Preview Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {matchResults.slice(0, 2).map((m) => (
                <div
                  key={m.scheme.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.scheme.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {m.estimatedSubsidyAmount > 0
                        ? `₹${m.estimatedSubsidyAmount.toLocaleString('en-IN')} Grant / Subsidy`
                        : 'Concessional Interest Credit'} · Match Score: <strong>{m.matchScore}%</strong>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: '#10B981',
                    color: '#fff',
                    padding: '2px 8px',
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
              onClick={() => setActiveTab('matcher')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <span>View All {matchResults.length} Recommended Schemes & Subsidies</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
