import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { DprRequest, DprFinancialModel } from '../types';
import { FileSpreadsheet, Printer, RefreshCw, CheckCircle2, TrendingUp, ShieldCheck, DollarSign, Calculator } from 'lucide-react';

export const DprGeneratorView: React.FC = () => {
  const { profile } = useProfile();
  const { t } = useLanguage();

  const [dprInput, setDprInput] = useState<DprRequest>({
    businessName: profile.businessName || `${profile.fullName}'s Micro Enterprise`,
    sector: profile.sector,
    tradeType: profile.tradeType || 'General Micro Activity',
    locationType: profile.locationType,
    category: profile.category,
    gender: profile.gender,
    machineryAndEquipmentCost: Math.round(profile.totalProjectCost * 0.6) || 150000,
    workspaceOrCivilCost: Math.round(profile.totalProjectCost * 0.1) || 25000,
    workingCapitalNeeds: Math.round(profile.totalProjectCost * 0.25) || 60000,
    contingencyBuffer: Math.round(profile.totalProjectCost * 0.05) || 15000,
    expectedMonthlyRevenue: Math.round(profile.totalProjectCost * 0.35) || 80000,
    expectedMonthlyOperatingCost: Math.round(profile.totalProjectCost * 0.22) || 50000
  });

  const [financialModel, setFinancialModel] = useState<DprFinancialModel | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Sync when profile changes
  useEffect(() => {
    setDprInput((prev) => ({
      ...prev,
      businessName: profile.businessName || `${profile.fullName}'s Micro Enterprise`,
      sector: profile.sector,
      tradeType: profile.tradeType || 'General Micro Activity',
      locationType: profile.locationType,
      category: profile.category,
      gender: profile.gender,
      machineryAndEquipmentCost: Math.round(profile.totalProjectCost * 0.6) || 150000,
      workspaceOrCivilCost: Math.round(profile.totalProjectCost * 0.1) || 25000,
      workingCapitalNeeds: Math.round(profile.totalProjectCost * 0.25) || 60000
    }));
  }, [profile]);

  const generateDpr = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/dpr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dprInput)
      });
      if (res.ok) {
        const data = await res.json();
        setFinancialModel(data.model);
      }
    } catch (err) {
      console.error('Error generating DPR:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateDpr();
  }, [profile.totalProjectCost, profile.category, profile.locationType]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel dpr-container">
      {/* Header Banner */}
      <div className="dpr-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-saffron">Bank Appraisal Format</span>
            <span className="badge badge-emerald">KVIC & MoSJE Standard</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={24} style={{ color: 'var(--primary-saffron)' }} />
            <span>Bank-Ready Detailed Project Report (DPR)</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Automated capital allocation, subsidy claim computation, debt-service coverage (DSCR), and 3-year cash flows.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }} className="no-print">
          <button className="btn-secondary" onClick={generateDpr} disabled={isGenerating}>
            <RefreshCw size={16} className={isGenerating ? 'spin-animation' : ''} />
            <span>Recalculate Projections</span>
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Official DPR / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Input Adjuster (Hidden during print) */}
      <div className="no-print" style={{ background: 'var(--bg-surface-subtle)', padding: '18px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calculator size={18} style={{ color: 'var(--primary-saffron)' }} />
          <span>Adjust Project Cost Breakdown (Live Financial Modeling):</span>
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="dpr-machinery" style={{ fontSize: '0.78rem' }}>Plant & Machinery (₹)</label>
            <input
              id="dpr-machinery"
              type="number"
              step="10000"
              value={dprInput.machineryAndEquipmentCost}
              onChange={(e) => setDprInput({ ...dprInput, machineryAndEquipmentCost: parseInt(e.target.value, 10) || 0 })}
              style={{ width: '100%', padding: '8px 10px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="dpr-workspace" style={{ fontSize: '0.78rem' }}>Workspace & Shed (₹)</label>
            <input
              id="dpr-workspace"
              type="number"
              step="5000"
              value={dprInput.workspaceOrCivilCost}
              onChange={(e) => setDprInput({ ...dprInput, workspaceOrCivilCost: parseInt(e.target.value, 10) || 0 })}
              style={{ width: '100%', padding: '8px 10px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="dpr-working-capital" style={{ fontSize: '0.78rem' }}>Working Capital (₹)</label>
            <input
              id="dpr-working-capital"
              type="number"
              step="10000"
              value={dprInput.workingCapitalNeeds}
              onChange={(e) => setDprInput({ ...dprInput, workingCapitalNeeds: parseInt(e.target.value, 10) || 0 })}
              style={{ width: '100%', padding: '8px 10px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="dpr-monthly-sales" style={{ fontSize: '0.78rem' }}>Est. Monthly Sales (₹)</label>
            <input
              id="dpr-monthly-sales"
              type="number"
              step="10000"
              value={dprInput.expectedMonthlyRevenue}
              onChange={(e) => setDprInput({ ...dprInput, expectedMonthlyRevenue: parseInt(e.target.value, 10) || 0 })}
              style={{ width: '100%', padding: '8px 10px' }}
            />
          </div>
        </div>
      </div>

      {financialModel && (
        <>
          {/* Printable Official Bank Document Header */}
          <div style={{ border: '2px solid #000000', padding: '16px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000' }}>
              Micro-Enterprise Project Appraisal & DPR Report
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#333333', marginTop: '4px' }}>
              Applicant: <strong>{profile.fullName}</strong> • Category: <strong>{profile.category}</strong> • Domicile: <strong>{profile.locationType} ({profile.state})</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#555555' }}>
              Enterprise: <strong>{financialModel.summary.businessName}</strong> ({financialModel.summary.tradeType})
            </div>
          </div>

          {/* Key DPR Summary Cards */}
          <div className="dpr-grid-summary">
            <div className="dpr-stat-card">
              <h5>Total Project Cost</h5>
              <h3>₹{financialModel.summary.totalProjectCost.toLocaleString('en-IN')}</h3>
              <small style={{ color: 'var(--text-muted)' }}>
                CapEx: ₹{financialModel.summary.capitalExpenditure.toLocaleString('en-IN')} | Working Cap: ₹{financialModel.summary.workingCapital.toLocaleString('en-IN')}
              </small>
            </div>

            <div className="dpr-stat-card">
              <h5>Government Subsidy Claim ({financialModel.summary.subsidyPercent}%)</h5>
              <h3 style={{ color: 'var(--emerald-growth)' }}>
                ₹{financialModel.summary.subsidyEligible.toLocaleString('en-IN')}
              </h3>
              <small style={{ color: 'var(--emerald-growth)', fontWeight: 600 }}>
                Eligible under {profile.category} {profile.locationType} Priority Quota
              </small>
            </div>

            <div className="dpr-stat-card">
              <h5>Promoter Margin Money ({financialModel.summary.promoterContributionPercent}%)</h5>
              <h3 style={{ color: 'var(--trust-indigo)' }}>
                ₹{financialModel.summary.promoterContribution.toLocaleString('en-IN')}
              </h3>
              <small style={{ color: 'var(--text-muted)' }}>
                Total Bank Credit: ₹{financialModel.summary.totalBankLoan.toLocaleString('en-IN')}
              </small>
            </div>
          </div>

          {/* Financing Structure Table */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>1. Means of Finance Pattern</h4>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Source of Funds</th>
                    <th>Percentage (%)</th>
                    <th>Amount (INR)</th>
                    <th>Terms & Regulatory Norms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Promoter's Contribution (Margin)</strong></td>
                    <td>{financialModel.summary.promoterContributionPercent}%</td>
                    <td><strong>₹{financialModel.summary.promoterContribution.toLocaleString('en-IN')}</strong></td>
                    <td>Concessional 5% margin for SC/ST/OBC/Women under PMEGP & NSFDC</td>
                  </tr>
                  <tr>
                    <td><strong>Government Capital Subsidy (Margin Money)</strong></td>
                    <td>{financialModel.summary.subsidyPercent}%</td>
                    <td><strong style={{ color: 'var(--emerald-growth)' }}>₹{financialModel.summary.subsidyEligible.toLocaleString('en-IN')}</strong></td>
                    <td>Back-ended subsidy kept in TDR account for 3 years without interest</td>
                  </tr>
                  <tr>
                    <td><strong>Bank Term Loan (Plant & Machinery)</strong></td>
                    <td>{Math.round((financialModel.summary.termLoanRequired / financialModel.summary.totalProjectCost) * 100)}%</td>
                    <td>₹{financialModel.summary.termLoanRequired.toLocaleString('en-IN')}</td>
                    <td>Tenure: {financialModel.repaymentSchedule.tenureYears} Yrs, Rate: {financialModel.repaymentSchedule.interestRatePercent}% p.a.</td>
                  </tr>
                  <tr>
                    <td><strong>Bank Working Capital (Cash Credit)</strong></td>
                    <td>{Math.round((financialModel.summary.workingCapitalLoanRequired / financialModel.summary.totalProjectCost) * 100)}%</td>
                    <td>₹{financialModel.summary.workingCapitalLoanRequired.toLocaleString('en-IN')}</td>
                    <td>Hypothecation of stocks and receivables</td>
                  </tr>
                  <tr style={{ background: 'var(--bg-surface-elevated)' }}>
                    <td><strong>TOTAL PROJECT FINANCING</strong></td>
                    <td><strong>100%</strong></td>
                    <td><strong style={{ color: 'var(--primary-saffron)', fontSize: '1.1rem' }}>₹{financialModel.summary.totalProjectCost.toLocaleString('en-IN')}</strong></td>
                    <td><strong>Monthly Term Loan EMI: ₹{financialModel.repaymentSchedule.monthlyEmi.toLocaleString('en-IN')}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3-Year Financial Projections Table */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>2. Three-Year Projected Profitability & DSCR</h4>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Financial Metric (INR)</th>
                    <th>Year 1 (70% Capacity)</th>
                    <th>Year 2 (82% Capacity)</th>
                    <th>Year 3 (92% Capacity)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Projected Gross Sales Turnover</strong></td>
                    <td>₹{financialModel.projectionsThreeYears[0].projectedSales.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].projectedSales.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].projectedSales.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>Cost of Raw Materials / Spares</td>
                    <td>₹{financialModel.projectionsThreeYears[0].costOfMaterials.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].costOfMaterials.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].costOfMaterials.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>Direct Wages & Labor</td>
                    <td>₹{financialModel.projectionsThreeYears[0].directWages.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].directWages.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].directWages.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>Power, Utilities, Workspace Rent</td>
                    <td>₹{financialModel.projectionsThreeYears[0].utilitiesAndRent.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].utilitiesAndRent.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].utilitiesAndRent.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ background: 'var(--bg-surface-subtle)' }}>
                    <td><strong>Gross Operating Profit</strong></td>
                    <td><strong>₹{financialModel.projectionsThreeYears[0].grossProfit.toLocaleString('en-IN')}</strong></td>
                    <td><strong>₹{financialModel.projectionsThreeYears[1].grossProfit.toLocaleString('en-IN')}</strong></td>
                    <td><strong>₹{financialModel.projectionsThreeYears[2].grossProfit.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  <tr>
                    <td>Depreciation on Machinery (15% WDV)</td>
                    <td>₹{financialModel.projectionsThreeYears[0].depreciation.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].depreciation.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].depreciation.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>Interest on Bank Loan</td>
                    <td>₹{financialModel.projectionsThreeYears[0].interestExpense.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[1].interestExpense.toLocaleString('en-IN')}</td>
                    <td>₹{financialModel.projectionsThreeYears[2].interestExpense.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ background: 'rgba(5, 150, 105, 0.08)' }}>
                    <td><strong style={{ color: 'var(--emerald-growth)' }}>Net Profit After Tax (NPAT)</strong></td>
                    <td><strong style={{ color: 'var(--emerald-growth)' }}>₹{financialModel.projectionsThreeYears[0].netProfitAfterTax.toLocaleString('en-IN')}</strong></td>
                    <td><strong style={{ color: 'var(--emerald-growth)' }}>₹{financialModel.projectionsThreeYears[1].netProfitAfterTax.toLocaleString('en-IN')}</strong></td>
                    <td><strong style={{ color: 'var(--emerald-growth)' }}>₹{financialModel.projectionsThreeYears[2].netProfitAfterTax.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Debt Service Coverage Ratio (DSCR)</strong></td>
                    <td><strong>{financialModel.projectionsThreeYears[0].dscr}</strong></td>
                    <td><strong>{financialModel.projectionsThreeYears[1].dscr}</strong></td>
                    <td><strong>{financialModel.projectionsThreeYears[2].dscr}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bank Viability Verdict Card */}
          <div style={{ padding: '20px', background: 'rgba(5, 150, 105, 0.08)', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--emerald-growth-light)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>Bank Appraisal Status</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--emerald-growth)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={22} />
                  <span>{financialModel.viabilityMetrics.bankViabilityVerdict}</span>
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Average DSCR of <strong>{financialModel.viabilityMetrics.averageDscr}</strong> exceeds the minimum banking benchmark (1.50). First-year Break-Even is healthy at <strong>{financialModel.viabilityMetrics.breakEvenPercentage}%</strong> of sales.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', textAlign: 'center' }}>
                <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Average DSCR</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--emerald-growth)' }}>{financialModel.viabilityMetrics.averageDscr}</strong>
                </div>
                <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Payback Period</span>
                  <strong style={{ fontSize: '1.25rem' }}>{financialModel.viabilityMetrics.paybackPeriodYears} Yrs</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Block for Print */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '30px', borderTop: '1px dashed var(--border-prominent)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000000', width: '220px', height: '40px', marginBottom: '8px' }}></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Signature of Entrepreneur</p>
              <small style={{ color: 'var(--text-muted)' }}>({profile.fullName})</small>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000000', width: '220px', height: '40px', marginBottom: '8px' }}></div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Appraising Branch Manager</p>
              <small style={{ color: 'var(--text-muted)' }}>Scheduled Commercial Bank / RRB</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
