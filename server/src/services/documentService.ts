import { UserProfile, DocumentVerificationItem, DocumentReadinessReport } from '../types';

export class DocumentService {
  private masterDocuments: DocumentVerificationItem[] = [
    {
      id: 'aadhaar-card',
      name: 'Aadhaar Card (Identity & Domicile Proof)',
      hindiName: 'आधार कार्ड (पहचान एवं निवास प्रमाण)',
      description: 'Official proof of identity linked to beneficiary mobile number and bank account for DBT.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: 'Available via UIDAI website (m-Aadhaar) or nearest CSC / Post Office Aadhaar Seva Kendra.',
      issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
      onlinePortalUrl: 'https://myaadhaar.uidai.gov.in',
      estimatedDaysToAcquire: 1
    },
    {
      id: 'caste-certificate',
      name: 'Caste / Community Certificate',
      hindiName: 'जाति प्रमाण पत्र (एससी / एसटी / ओबीसी)',
      description: 'Required to unlock 25%-35% special capital subsidy and concessional credit under MoSJE schemes.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: 'Apply online through your State e-District portal (e.g. edistrict.up.gov.in, serviceonline.bihar.gov.in) or visit your local Tehsil / SDM office.',
      issuingAuthority: 'Revenue Department (Tehsildar / Sub-Divisional Magistrate)',
      onlinePortalUrl: 'https://serviceonline.gov.in',
      estimatedDaysToAcquire: 7
    },
    {
      id: 'income-certificate',
      name: 'Annual Household Income Certificate',
      hindiName: 'आय प्रमाण पत्र (पारिवारिक आय प्रमाण)',
      description: 'Mandatory for MoSJE apex corporations (NSFDC/NBCFDC/VISVAS) with income ceiling of ₹3 Lakh.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: 'Issued by local Revenue Authority or Gram Panchayat / Nagar Palika based on self-declaration and patwari report.',
      issuingAuthority: 'Revenue Authority / Taluka Tehsildar',
      onlinePortalUrl: 'https://serviceonline.gov.in',
      estimatedDaysToAcquire: 5
    },
    {
      id: 'udyam-registration',
      name: 'Udyam MSME Registration Certificate',
      hindiName: 'उद्यम पंजीकरण प्रमाण पत्र',
      description: 'Official recognition as a Micro Enterprise. Unlocks collateral-free credit, priority sector status, and tender exemptions.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: '100% Free, paperless, and instant online using Aadhaar & PAN on the official Government portal.',
      issuingAuthority: 'Ministry of Micro, Small and Medium Enterprises',
      onlinePortalUrl: 'https://udyamregistration.gov.in',
      estimatedDaysToAcquire: 1
    },
    {
      id: 'project-report-dpr',
      name: 'Detailed Project Report (DPR) & Financial Model',
      hindiName: 'विस्तृत परियोजना रिपोर्ट (डीपीआर)',
      description: 'Bank-formatted business plan with machinery breakdown, working capital calculation, and 3-year cash flows.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: 'Generate instantly for free using SchemeMatch DPR Generator tool or consult your local DIC officer.',
      issuingAuthority: 'Self / Chartered Accountant / DIC / SchemeMatch',
      onlinePortalUrl: '#dpr-generator',
      estimatedDaysToAcquire: 1
    },
    {
      id: 'bank-statement',
      name: 'Bank Passbook / 6 Months Account Statement',
      hindiName: 'बैंक पासबुक / पिछले 6 माह का विवरण',
      description: 'Verifies active banking habit, cash flows, and Aadhaar seeding for DBT margin money subsidy credit.',
      importance: 'Mandatory',
      status: 'Missing',
      howToGet: 'Download e-statement via mobile banking app or get updated passbook printed at your local bank branch.',
      issuingAuthority: 'Scheduled Commercial Bank / Regional Rural Bank / Post Office',
      onlinePortalUrl: 'https://www.onlinesbi.sbi',
      estimatedDaysToAcquire: 1
    },
    {
      id: 'machinery-quotation',
      name: 'Equipment / Machinery Quotation (Proforma Invoice)',
      hindiName: 'मशीनरी / उपकरण कोटेशन (प्रोफार्मा चालान)',
      description: 'Official price estimate with GST breakdown from authorized vendors for bank loan disbursement.',
      importance: 'Recommended',
      status: 'Missing',
      howToGet: 'Obtain quotation on official letterhead with GSTIN from registered machinery distributors or hardware merchants.',
      issuingAuthority: 'Authorized Equipment Vendors / Machinery Dealers',
      onlinePortalUrl: 'https://gem.gov.in',
      estimatedDaysToAcquire: 3
    },
    {
      id: 'premises-lease-rent',
      name: 'Business Premises Proof (Rent Agreement / Electricity Bill)',
      hindiName: 'कार्यस्थल प्रमाण (किरायानामा / बिजली बिल)',
      description: 'Validates commercial or workshop location where the enterprise operates.',
      importance: 'Recommended',
      status: 'Missing',
      howToGet: 'Executed rent agreement on stamp paper or recent electricity/property tax bill of the premises.',
      issuingAuthority: 'Sub-Registrar / Landlord / Electricity Board',
      estimatedDaysToAcquire: 3
    },
    {
      id: 'skill-certificate',
      name: 'Skill / EDP Training Certificate (PM-DAKSH / ITI / RSETI)',
      hindiName: 'कौशल / उद्यमिता प्रशिक्षण प्रमाण पत्र',
      description: 'Provides priority vetting during Task Force Committee appraisal and waiver of collateral.',
      importance: 'Bonus',
      status: 'Missing',
      howToGet: 'Enroll in free 10-day EDP training via RSETI (Rural Self Employment Training Institute) or PM-DAKSH portal.',
      issuingAuthority: 'RSETI / NSDC / KVIC / State Livelihood Mission',
      onlinePortalUrl: 'https://pmdaksh.dosje.gov.in',
      estimatedDaysToAcquire: 10
    }
  ];

  public analyzeReadiness(
    profile: UserProfile,
    uploadedDocIds: string[] = []
  ): DocumentReadinessReport {
    // Clone master documents
    const documents: DocumentVerificationItem[] = this.masterDocuments.map((doc) => {
      const isUploaded = uploadedDocIds.includes(doc.id);
      let status: 'Uploaded' | 'Missing' | 'Verified' | 'ActionNeeded' = 'Missing';

      // Check profile flags
      if (doc.id === 'aadhaar-card') {
        status = 'Verified'; // baseline
      } else if (doc.id === 'caste-certificate') {
        if (profile.category === 'General') {
          return null as any; // not needed for General
        }
        status = profile.hasCasteCertificate || isUploaded ? 'Verified' : 'ActionNeeded';
      } else if (doc.id === 'udyam-registration') {
        status = profile.hasExistingUdyam || isUploaded ? 'Verified' : 'ActionNeeded';
      } else if (doc.id === 'project-report-dpr') {
        status = profile.hasProjectReport || isUploaded ? 'Verified' : 'ActionNeeded';
      } else if (doc.id === 'bank-statement') {
        status = profile.hasBankStatement6Months || isUploaded ? 'Verified' : 'ActionNeeded';
      } else if (doc.id === 'premises-lease-rent') {
        status = profile.hasLandOrRentDeed || isUploaded ? 'Verified' : 'Missing';
      } else if (doc.id === 'skill-certificate') {
        status = profile.hasSkillTrainingCertificate || isUploaded ? 'Verified' : 'Missing';
      } else if (isUploaded) {
        status = 'Verified';
      }

      return {
        ...doc,
        status
      };
    }).filter(Boolean);

    // Add Divyangjan UDID if applicable
    if (profile.isDifferentlyAbled) {
      documents.unshift({
        id: 'udid-card',
        name: 'UDID Card / Disability Certificate (>=40%)',
        hindiName: 'यूडीआईडी दिव्यांगता प्रमाण पत्र (४०% या अधिक)',
        description: 'Benchmark disability proof for NDFDC loan concessional interest rate and women 1% rebate.',
        importance: 'Mandatory',
        status: uploadedDocIds.includes('udid-card') ? 'Verified' : 'ActionNeeded',
        howToGet: 'Apply online through the Swavlamban Card portal with medical board examination.',
        issuingAuthority: 'Department of Empowerment of Persons with Disabilities',
        onlinePortalUrl: 'https://www.swavlambancard.gov.in',
        estimatedDaysToAcquire: 14
      });
    }

    // Add Street Vending Certificate if applicable
    if (profile.sector === 'StreetVending') {
      documents.unshift({
        id: 'vending-id-card',
        name: 'Certificate of Vending (CoV) / TVC Letter of Recommendation',
        hindiName: 'स्ट्रीट वेंडिंग प्रमाण पत्र / टाउन वेंडिंग कमेटी पत्र',
        description: 'Mandatory verification for PM SVANidhi loans up to ₹50,000 with 7% interest subsidy.',
        importance: 'Mandatory',
        status: uploadedDocIds.includes('vending-id-card') ? 'Verified' : 'ActionNeeded',
        howToGet: 'Issued by your local Municipal Corporation / Municipality Town Vending Committee (TVC).',
        issuingAuthority: 'Urban Local Body (ULB) / Municipality',
        onlinePortalUrl: 'https://pmsvanidhi.mohua.gov.in',
        estimatedDaysToAcquire: 5
      });
    }

    // Scoring weights
    let earnedWeight = 0;
    let totalWeight = 0;
    const criticalGaps: string[] = [];
    const actionPlan: string[] = [];

    documents.forEach((doc) => {
      const weight = doc.importance === 'Mandatory' ? 25 : doc.importance === 'Recommended' ? 10 : 5;
      totalWeight += weight;

      if (doc.status === 'Verified' || doc.status === 'Uploaded') {
        earnedWeight += weight;
      } else if (doc.importance === 'Mandatory') {
        criticalGaps.push(`${doc.name}: ${doc.description}`);
        actionPlan.push(`Step: Acquire ${doc.name} via ${doc.issuingAuthority} (${doc.howToGet})`);
      }
    });

    const overallScore = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
    let readinessLevel: 'Bank Ready' | 'Near Ready' | 'Documentation In Progress' | 'Immediate Action Needed' = 'Immediate Action Needed';

    if (overallScore >= 85) readinessLevel = 'Bank Ready';
    else if (overallScore >= 65) readinessLevel = 'Near Ready';
    else if (overallScore >= 40) readinessLevel = 'Documentation In Progress';

    const verifiedCount = documents.filter((d) => d.status === 'Verified' || d.status === 'Uploaded').length;

    return {
      overallScore,
      readinessLevel,
      verifiedCount,
      totalCount: documents.length,
      documents,
      criticalGaps,
      actionPlan
    };
  }
}
