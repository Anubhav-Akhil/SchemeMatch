import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Award, 
  Search, 
  Filter, 
  Send,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface ChannelPartner {
  id: string;
  name: string;
  type: 'SCA' | 'PSB' | 'RRB' | 'NBFC-MFI';
  typeFullName: string;
  state: string;
  district: string;
  branchName: string;
  nodalOfficer: string;
  phone: string;
  email: string;
  address: string;
  supportedSchemes: string[];
  approvalRate: number; // e.g. 89%
  avgSanctionDays: number; // e.g. 12 days
  isOnlineRoutingSupported: boolean;
  priorityForCategory: string[]; // ['SC', 'ST', 'Women']
}

const SAMPLE_PARTNERS: ChannelPartner[] = [
  {
    id: 'up-scfdc-vns',
    name: 'Uttar Pradesh SC Finance & Development Corp. (UPSCFDC)',
    type: 'SCA',
    typeFullName: 'State Channelising Agency',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    branchName: 'District Vikas Bhawan Branch, Kachehri',
    nodalOfficer: 'Shri R. K. Gautam (District Manager)',
    phone: '+91 542 2508192',
    email: 'dm-varanasi@upscfdc.gov.in',
    address: 'Room 204, 2nd Floor, Vikas Bhawan, Kachehri, Varanasi - 221002',
    supportedSchemes: ['NSFDC Term Loan', 'Mahila Samriddhi Yojana', 'Laghu Vyavsay Yojana', 'Special Central Assistance'],
    approvalRate: 94,
    avgSanctionDays: 14,
    isOnlineRoutingSupported: true,
    priorityForCategory: ['SC', 'SafaiKaramchari']
  },
  {
    id: 'sbi-vns-main',
    name: 'State Bank of India (SBI)',
    type: 'PSB',
    typeFullName: 'Public Sector Bank',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    branchName: 'SME City Credit Center, Cantt',
    nodalOfficer: 'Ms. Priyadarshini Rao (Chief Manager - MSME)',
    phone: '+91 542 2221045',
    email: 'smeccc.varanasi@sbi.co.in',
    address: 'SBI Building, Mall Road, Cantt, Varanasi - 221002',
    supportedSchemes: ['PMEGP', 'Stand-Up India', 'PM MUDRA (Shishu/Kishor/Tarun)', 'CGTMSE'],
    approvalRate: 88,
    avgSanctionDays: 12,
    isOnlineRoutingSupported: true,
    priorityForCategory: ['SC', 'ST', 'Women', 'General']
  },
  {
    id: 'baroda-up-bank',
    name: 'Baroda UP Bank (Sponsored by Bank of Baroda)',
    type: 'RRB',
    typeFullName: 'Regional Rural Bank',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    branchName: 'Regional Office & Rural Lending Desk',
    nodalOfficer: 'Shri Amit Srivastava (Agri & Micro Lending Head)',
    phone: '+91 542 2503341',
    email: 'rovaranasi@barodauprrb.co.in',
    address: 'B-38/1-K, Mahmoorganj Road, Varanasi - 221010',
    supportedSchemes: ['PMEGP Rural', 'Kisan Credit Card (Agro/Handicraft)', 'MUDRA Tarun', 'NSKFDC Scheme'],
    approvalRate: 91,
    avgSanctionDays: 9,
    isOnlineRoutingSupported: true,
    priorityForCategory: ['SC', 'ST', 'OBC', 'Artisan']
  },
  {
    id: 'pnb-vns-hub',
    name: 'Punjab National Bank (PNB)',
    type: 'PSB',
    typeFullName: 'Public Sector Bank',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    branchName: 'MSME Circle Sastra Center, Sigra',
    nodalOfficer: 'Shri Alok Kumar Verma (Circle Head)',
    phone: '+91 542 2226710',
    email: 'co.varanasi@pnb.co.in',
    address: 'Sigra Chauraha, Vidyapeeth Road, Varanasi - 221002',
    supportedSchemes: ['PMEGP', 'Stand-Up India', 'PM SVANidhi', 'NSFDC Credit Line'],
    approvalRate: 85,
    avgSanctionDays: 15,
    isOnlineRoutingSupported: true,
    priorityForCategory: ['SC', 'ST', 'OBC', 'Women']
  },
  {
    id: 'nabard-mfi-grameen',
    name: 'Annapurna Microfinance (SIDBI & NABARD Partner MFI)',
    type: 'NBFC-MFI',
    typeFullName: 'Concessional Micro-Finance Institution',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    branchName: 'Chitaipur Artisan Hub Branch',
    nodalOfficer: 'Smt. Kavita Sharma (Cluster Head)',
    phone: '+91 94152 87311',
    email: 'varanasi.cluster@ampl.net.in',
    address: 'Plot 14, Sunderpur Near BHU Gate, Varanasi - 221005',
    supportedSchemes: ['PM SVANidhi', 'Artisan Micro-Credit', 'Self-Help Group (SHG) Bank Linkage'],
    approvalRate: 96,
    avgSanctionDays: 4,
    isOnlineRoutingSupported: true,
    priorityForCategory: ['Women', 'Artisan', 'SC']
  }
];

export const ChannelPartnerRouter: React.FC = () => {
  const { profile } = useProfile();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [routedPartnerId, setRoutedPartnerId] = useState<string | null>(null);

  // Filter logic
  const filteredPartners = SAMPLE_PARTNERS.filter((partner) => {
    if (selectedType !== 'all' && partner.type !== selectedType) return false;
    if (selectedSchemeFilter !== 'all') {
      const hasScheme = partner.supportedSchemes.some(s => s.toLowerCase().includes(selectedSchemeFilter.toLowerCase()));
      if (!hasScheme) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = partner.name.toLowerCase().includes(q);
      const matchBranch = partner.branchName.toLowerCase().includes(q);
      const matchScheme = partner.supportedSchemes.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchBranch && !matchScheme) return false;
    }
    return true;
  });

  const handleRouteApplication = (partnerId: string) => {
    setRoutedPartnerId(partnerId);
  };

  return (
    <div className="partner-router-container" style={{ padding: '8px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={12} />
                Feature 8 of 10
              </span>
              <span className="badge badge-emerald">Direct Branch Handoff</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Intelligent Channel Partner Router
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
              Connects your pre-verified application directly to authorized State Channelising Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs based on your district, category, and target credit scheme.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-surface-elevated)', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <MapPin size={18} style={{ color: '#4F46E5' }} />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Current Jurisdiction</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{profile.district || 'Varanasi'}, {profile.state || 'Uttar Pradesh'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'SCA', label: 'SCAs (Govt Corp)' },
            { id: 'PSB', label: 'Public Sector Banks' },
            { id: 'RRB', label: 'Regional Rural Banks' },
            { id: 'NBFC-MFI', label: 'Micro-Finance (MFIs)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: selectedType === tab.id ? 600 : 500,
                border: selectedType === tab.id ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                background: selectedType === tab.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                color: selectedType === tab.id ? '#4F46E5' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Scheme Dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search branch or nodal officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            />
          </div>

          <select
            value={selectedSchemeFilter}
            onChange={(e) => setSelectedSchemeFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: '0.82rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)'
            }}
          >
            <option value="all">All Supported Schemes</option>
            <option value="PMEGP">PMEGP</option>
            <option value="Stand-Up">Stand-Up India</option>
            <option value="NSFDC">NSFDC</option>
            <option value="MUDRA">PM MUDRA</option>
          </select>
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPartners.map((partner) => {
          const isRouted = routedPartnerId === partner.id;
          return (
            <div
              key={partner.id}
              className="glass-panel"
              style={{
                padding: '22px 26px',
                borderRadius: '14px',
                background: 'var(--bg-surface)',
                border: isRouted ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div 
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: partner.type === 'SCA' ? 'rgba(79, 70, 229, 0.1)' : partner.type === 'PSB' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: partner.type === 'SCA' ? '#4F46E5' : partner.type === 'PSB' ? '#059669' : '#D97706',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Building2 size={24} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {partner.name}
                      </h3>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                        {partner.type} ({partner.typeFullName})
                      </span>
                    </div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      📍 {partner.branchName} • {partner.district}, {partner.state}
                    </span>
                  </div>
                </div>

                {/* Score Pills */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', background: 'var(--bg-surface-elevated)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Approval Rate</span>
                    <strong style={{ fontSize: '1.05rem', color: '#059669' }}>{partner.approvalRate}%</strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--bg-surface-elevated)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Avg Sanction</span>
                    <strong style={{ fontSize: '1.05rem', color: '#4F46E5' }}>{partner.avgSanctionDays} Days</strong>
                  </div>
                </div>
              </div>

              {/* Supported Schemes Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Serviced Schemes:</span>
                {partner.supportedSchemes.map((s, idx) => (
                  <span key={idx} className="badge badge-subtle" style={{ fontSize: '0.74rem' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Bottom Row: Nodal Officer Contact Details & Primary Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <strong>Officer:</strong> {partner.nodalOfficer}
                  </span>
                  <a href={`tel:${partner.phone}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                    <Phone size={13} style={{ color: '#4F46E5' }} />
                    <span>{partner.phone}</span>
                  </a>
                  <a href={`mailto:${partner.email}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                    <Mail size={13} style={{ color: '#059669' }} />
                    <span>{partner.email}</span>
                  </a>
                </div>

                {isRouted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.86rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} />
                    <span>Dossier Routed Successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRouteApplication(partner.id)}
                    className="btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.84rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={14} />
                    <span>Route My Pre-Verified Application</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelPartnerRouter;
