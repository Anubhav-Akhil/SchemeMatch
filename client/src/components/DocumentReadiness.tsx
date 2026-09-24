import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { DocumentReadinessReport, DocumentVerificationItem } from '../types';
import { FileCheck2, Upload, AlertCircle, CheckCircle2, ExternalLink, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const DocumentReadiness: React.FC = () => {
  const { profile, uploadedDocIds, toggleDocumentUpload, setActiveTab } = useProfile();
  const { t } = useLanguage();

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
    setOcrStatus(`Simulating OCR Scanner on ${docName}... Extracted Name: "${profile.fullName}", Category: "${profile.category}" (Verified Valid).`);
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
            <span className="badge badge-emerald">AI Document Scanner</span>
            <span className="badge badge-indigo">Pre-Appraisal Verification</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={24} style={{ color: 'var(--primary-saffron)' }} />
            <span>Document Readiness & Gap Resolver</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verify your documentation health before bank submission to eliminate delays and unlock maximum government subsidy.
          </p>
        </div>

        {report && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-surface-subtle)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Readiness Score</span>
              <strong style={{ fontSize: '1.5rem', color: report.overallScore >= 75 ? 'var(--emerald-growth)' : 'var(--accent-amber)' }}>
                {report.overallScore}%
              </strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Status</span>
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
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Upload Documents for AI Verification</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Drag & drop Aadhaar, Caste Certificate, Bank Passbook, or Udyam PDF / Image (Simulated OCR)
            </p>
            <span className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              Simulate Upload: Udyam Certificate
            </span>
          </div>

          {/* Critical Gaps Warning Box */}
          {report && report.criticalGaps.length > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={18} />
                <span>Critical Documents Missing ({report.criticalGaps.length})</span>
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
                <strong style={{ fontSize: '0.88rem', display: 'block' }}>Missing Detailed Project Report (DPR)?</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generate a bank-acceptable DPR for free in 60 seconds.</span>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('dpr')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                <span>Build DPR</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Full Document Checklist with Status and Resolution Links */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
            Checklist & Step-by-Step Acquisition Guides:
          </h3>

          {report && report.documents.map((doc: DocumentVerificationItem) => {
            const isVerified = doc.status === 'Verified' || doc.status === 'Uploaded';
            return (
              <div key={doc.id} className="doc-item-row">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{doc.name}</strong>
                    <span className={`badge ${doc.importance === 'Mandatory' ? 'badge-saffron' : 'badge-indigo'}`} style={{ fontSize: '0.65rem' }}>
                      {doc.importance}
                    </span>
                    <span className={`badge ${isVerified ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.68rem' }}>
                      {isVerified ? 'Verified' : 'Action Needed'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {doc.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>How to get:</strong> {doc.howToGet} ({doc.issuingAuthority})
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
                        <span>Uploaded</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Mark Uploaded</span>
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
                      <span>Official Portal</span>
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
