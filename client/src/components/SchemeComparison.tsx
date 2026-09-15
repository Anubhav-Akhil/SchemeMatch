import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { Scale, Trash2, ExternalLink, Check, Plus, AlertCircle } from 'lucide-react';

export const SchemeComparison: React.FC = () => {
  const { comparedSchemes, toggleCompareScheme, clearComparison, matchResults, setActiveTab } = useProfile();
  const { t } = useLanguage();

  if (comparedSchemes.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', margin: '20px 0' }}>
        <Scale size={48} style={{ color: 'var(--primary-saffron)', margin: '0 auto 16px auto', display: 'block' }} />
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Schemes Selected for Comparison</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px auto' }}>
          Select 2 or 3 schemes from the Scheme Matcher to compare interest rates, subsidy percentages, collateral norms, and margin money side-by-side.
        </p>

        {/* Quick Add Suggestions from Top Matches */}
        {matchResults.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Suggested Schemes to Compare:</h4>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {matchResults.slice(0, 3).map(({ scheme }) => (
                <button
                  key={scheme.id}
                  className="btn-secondary"
                  onClick={() => toggleCompareScheme(scheme)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <Plus size={14} />
                  <span>{scheme.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '28px', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={24} style={{ color: 'var(--primary-saffron)' }} />
            <span>Scheme Comparison Matrix ({comparedSchemes.length}/3)</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Direct comparison of loan limits, interest rates, capital subsidies, and collateral terms.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={clearComparison} style={{ fontSize: '0.85rem' }}>
            <Trash2 size={16} />
            <span>Clear Comparison</span>
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('matcher')} style={{ fontSize: '0.85rem' }}>
            <span>Back to Matcher</span>
          </button>
        </div>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ minWidth: '180px' }}>Feature / Parameter</th>
              {comparedSchemes.map((scheme) => (
                <th key={scheme.id} style={{ minWidth: '240px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                    <div>
                      <div className="badge badge-saffron" style={{ marginBottom: '6px' }}>{scheme.apexBody}</div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{scheme.name}</h4>
                    </div>
                    <button
                      onClick={() => toggleCompareScheme(scheme)}
                      style={{ background: 'transparent', color: 'var(--accent-rose)', padding: '4px' }}
                      title="Remove scheme from comparison"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ministry & Apex Body</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <div>{s.ministry}</div>
                  <small style={{ color: 'var(--text-muted)' }}>{s.apexBody}</small>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Loan Scale (Min - Max)</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <strong style={{ color: 'var(--primary-saffron)', fontSize: '1rem' }}>
                    ₹{s.minLoanAmount.toLocaleString('en-IN')} - ₹{s.maxLoanAmount.toLocaleString('en-IN')}
                  </strong>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Government Capital Subsidy</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-growth)' }}>
                    Rural Special: {s.subsidyRate.specialRural ?? s.subsidyRate.generalRural ?? 0}%
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Urban Special: {s.subsidyRate.specialUrban ?? s.subsidyRate.generalUrban ?? 0}%
                  </div>
                  {s.subsidyRate.maxSubsidyAmount ? (
                    <small style={{ color: 'var(--text-secondary)' }}>
                      (Max: ₹{s.subsidyRate.maxSubsidyAmount.toLocaleString('en-IN')})
                    </small>
                  ) : null}
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Interest Rate & Subvention</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <strong style={{ color: 'var(--trust-indigo)' }}>{s.interestRatePerAnnum}</strong>
                  {s.interestSubventionPercent ? (
                    <div className="badge badge-emerald" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                      {s.interestSubventionPercent}% Govt Subvention
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Promoter Contribution (Margin Money)</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <strong style={{ color: 'var(--emerald-growth)' }}>
                    Special Category: {s.promoterContributionMinPercent.specialCategory}%
                  </strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    General: {s.promoterContributionMinPercent.general}%
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Collateral Security</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <span className="badge badge-emerald">{s.collateralRequirement}</span>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Tenure & Moratorium</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <div>{s.repaymentTenureYears} Years Repayment</div>
                  <small style={{ color: 'var(--text-muted)' }}>Moratorium: {s.moratoriumPeriodMonths} Months</small>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Nodal Processing Agency</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <div style={{ fontSize: '0.88rem' }}>{s.nodalAgency}</div>
                  <small style={{ color: 'var(--text-muted)' }}>Avg. {s.averageProcessingDays} Days</small>
                </td>
              ))}
            </tr>

            <tr>
              <td><strong>Official Portal Action</strong></td>
              {comparedSchemes.map((s) => (
                <td key={s.id}>
                  <a
                    href={s.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', width: '100%' }}
                  >
                    <span>Visit Portal</span>
                    <ExternalLink size={14} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
