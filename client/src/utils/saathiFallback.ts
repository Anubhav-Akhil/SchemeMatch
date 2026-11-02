import { ChatMessage, ChatFeatureMode, UserProfile } from '../types';

export const generateSaathiFallback = (
  query: string,
  profile?: Partial<UserProfile>,
  preferredMode?: ChatFeatureMode
): ChatMessage => {
  const q = query.toLowerCase().trim();

  const isProfileFilled = Boolean(
    profile && (
      (profile.category && String(profile.category).trim()) ||
      (profile.sector && String(profile.sector).trim()) ||
      (profile.tradeType && String(profile.tradeType).trim()) ||
      (profile.requiredLoanAmount && Number(profile.requiredLoanAmount) > 0)
    )
  );

  let mode: ChatFeatureMode = preferredMode || 'general';
  if (mode === 'general') {
    if (q.includes('where to apply') || q.includes('partner') || q.includes('bank') || q.includes('branch') || q.includes('कहाँ') || q.includes('ਕਿੱਥੇ')) {
      mode = 'partners';
    } else if (q.includes('document') || q.includes('paper') || q.includes('दस्तावेज') || q.includes('ਕਾਗਜ਼ਾਤ')) {
      mode = 'documents';
    } else if (q.includes('emi') || q.includes('किस्त') || q.includes('installment') || q.includes('ਕਿਸ਼ਤ')) {
      mode = 'emi';
    } else if (q.includes('scheme') || q.includes('find') || q.includes('योजना') || q.includes('ਸਕੀਮ')) {
      mode = 'recommendation';
    }
  }

  const category = profile?.category || 'SC';
  const location = profile?.locationType || 'Rural';
  const loanAmt = profile?.requiredLoanAmount || 500000;
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  switch (mode) {
    case 'partners': {
      if (!isProfileFilled) {
        return {
          id: `saathi-${Date.now()}`,
          sender: 'assistant',
          text: `Government schemes and subsidies are primarily routed through 3 authorized channels:
1. **Public Sector Commercial Banks (PSBs)** (e.g. SBI, PNB, Bank of Baroda): Accept direct applications for **Mudra Loans (up to ₹10 Lakhs)** and **Stand-Up India (up to ₹1 Crore)**.
2. **District Industries Centre (DIC) & KVIC**: Nodal processing agency for **PMEGP (with up to 35% capital subsidy)** and **PM Vishwakarma**. You can also apply online 24/7 on the official **JanSamarth Portal (jansamarth.in)** and **PMEGP e-Portal**.
3. **State Channelizing Agencies (SCAs)**: Located at District Vikas Bhawan / Collectorate, providing subsidized credit (4%–6% concessional interest) from central corporations (NSFDC, NBCFDC, NSKFDC) for SC, ST, OBC, Safai Karamchari & Minority entrepreneurs.

To pinpoint your exact nearest branch, district nodal officer, and specific scheme portal:
Could you please share:
1. **Your State & District / City**: (e.g., Lucknow, UP or Ludhiana, Punjab)
2. **Your Business or Trade**: (e.g., tailoring, dairy farming, grocery shop, food stall, manufacturing)
3. **Your Social Category**: (SC / ST / OBC / Minority / General / Women entrepreneur)?`,
          hindiText: `सरकारी योजनाओं और सब्सिडी के लिए आवेदन मुख्य रूप से 3 अधिकृत माध्यमों से किए जाते हैं:
1. **सरकारी वाणिज्यिक बैंक (PSBs)** (जैसे SBI, PNB, बैंक ऑफ बड़ौदा): **मुद्रा ऋण (₹10 लाख तक)** और **स्टैंड-अप इंडिया (₹1 करोड़ तक)** के लिए।
2. **जिला उद्योग केंद्र (DIC) व खादी बोर्ड (KVIC)**: **PMEGP (35% तक सरकारी सब्सिडी)** और **पीएम विश्वकर्मा** के लिए नोडल केंद्र। आप आधिकारिक **जनसमर्थ पोर्टल (jansamarth.in)** पर भी 24x7 ऑनलाइन आवेदन कर सकते हैं।
3. **राज्य चैनलाइजिंग एजेंसियां (SCAs)**: विकास भवन/कलेक्ट्रेट में स्थित, जो SC, ST, OBC, सफाई कर्मचारियों व अल्पसंख्यकों के लिए 4%-6% रियायती ब्याज दर पर ऋण देती हैं।

आपके व्यवसाय के लिए सबसे नज़दीकी बैंक शाखा, नोडल अधिकारी व आवेदन पोर्टल बताने के लिए, कृपया 3 बातें बताएं:
1. **आपका राज्य और जिला/शहर**
2. **आपका कार्य या व्यवसाय** (जैसे सिलाई, किराना, डेयरी, फ़ूड स्टॉल)
3. **आपकी सामाजिक श्रेणी** (SC / ST / OBC / अल्पसंख्यक / सामान्य / महिला उद्यमी)?`,
          punjabiText: `ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਲਈ ਅਰਜ਼ੀਆਂ ਮੁੱਖ ਤੌਰ 'ਤੇ 3 ਅਧਿਕਾਰਤ ਤਰੀਕਿਆਂ ਰਾਹੀਂ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ:
1. **ਸਰਕਾਰੀ ਵਪਾਰਕ ਬੈਂਕ (PSBs)** (ਜਿਵੇਂ SBI, PNB): **ਮੁਦਰਾ ਕਰਜ਼ੇ (₹10 ਲੱਖ ਤੱਕ)** ਅਤੇ **ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ (₹1 ਕਰੋੜ ਤੱਕ)** ਲਈ।
2. **ਜ਼ਿਲ੍ਹਾ ਉਦਯੋਗ ਕੇਂਦਰ (DIC) ਤੇ KVIC**: **PMEGP (35% ਤੱਕ ਸਬਸਿਡੀ)** ਅਤੇ **PM ਵਿਸ਼ਵਕਰਮਾ** ਲਈ ਨੋਡਲ ਦਫ਼ਤਰ। ਤੁਸੀਂ **JanSamarth ਪੋਰਟਲ (jansamarth.in)** 'ਤੇ ਵੀ ਆਨਲਾਈਨ ਅਪਲਾਈ ਕਰ ਸਕਦੇ ਹੋ।
3. **ਸਟੇਟ ਚੈਨਲਾਈਜ਼ਿੰਗ ਏਜੰਸੀਆਂ (SCAs)**: ਜ਼ਿਲ੍ਹਾ ਵਿਕਾਸ ਭਵਨ ਵਿਖੇ ਸਥਿਤ, ਜੋ SC/ST/OBC ਲਈ 4%-6% ਸਸਤੇ ਵਿਆਜ 'ਤੇ ਕਰਜ਼ਾ ਦਿੰਦੀਆਂ ਹਨ।

ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਲਈ ਸਹੀ ਨਜ਼ਦੀਕੀ ਬੈਂਕ ਅਤੇ ਅਧਿਕਾਰੀ ਲੱਭਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ:
1. **ਤੁਹਾਡਾ ਰਾਜ ਅਤੇ ਜ਼ਿਲ੍ਹਾ**
2. **ਤੁਹਾਡਾ ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ**
3. **ਤੁਹਾਡੀ ਸ਼੍ਰੇਣੀ** (SC / ST / OBC / ਮਹਿਲਾ / ਜਨਰਲ)?`,
          timestamp: timeStr,
          featureMode: 'partners',
          partnerCard: {
            nearestPartners: [
              {
                name: 'State Channelizing Agency (SCA) District Office',
                type: 'Apex Channelizing Agency (SCA)',
                distanceKm: 3.4,
                address: 'Vikas Bhawan, Near Collectorate, Civil Lines',
                schemeAuthorization: 'NSFDC, NBCFDC, NSKFDC direct concessional loans'
              },
              {
                name: 'State Bank of India (SBI) SME Branch',
                type: 'Public Sector Bank (PSB)',
                distanceKm: 1.8,
                address: 'Main Commercial Branch, Station Road',
                schemeAuthorization: 'PMEGP, Stand-Up India, Mudra & CGTMSE'
              },
              {
                name: 'District Industries Centre (DIC)',
                type: 'DIC Nodal Office',
                distanceKm: 4.2,
                address: 'Industrial Estate, Phase 1',
                schemeAuthorization: 'PMEGP Task Force Committee & PM Vishwakarma verification'
              }
            ]
          },
          suggestedPrompts: [
            'Ludhiana, Punjab, tailoring business, OBC category',
            'Pune, Maharashtra, dairy farm, SC category',
            'Lucknow, UP, grocery retail shop, Women entrepreneur'
          ]
        };
      }

      return {
        id: `saathi-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your profile as a **${category}** entrepreneur in **${profile?.district || location}**:
Here are your primary authorized application avenues ready to process your scheme application:
1. **State Channelizing Agency (SCA) District Office**: Vikas Bhawan / Collectorate office for direct ${category} concessional subsidies.
2. **Lead Public Sector Bank (SBI / PNB)**: Contact the MSME credit desk for direct Mudra, Stand-Up India, or PMEGP loan sanctioning.
3. **District Industries Centre (DIC)**: For PMEGP subsidy task force approvals and PM Vishwakarma verification.
4. **Online Portal**: Apply directly 24/7 at **jansamarth.in** or **kviconline.gov.in**.`,
        hindiText: `आपकी प्रोफ़ाइल (${profile?.district || location} में ${category} उद्यमी) के आधार पर अधिकृत आवेदन केंद्र:
1. **राज्य चैनलाइजिंग एजेंसी (SCA)**: विकास भवन/कलेक्ट्रेट परिसर स्थित SCA कार्यालय ${category} विशेष रियायती ऋण व सब्सिडी के लिए।
2. **नज़दीकी सरकारी बैंक (SBI / PNB)**: मुद्रा, PMEGP और स्टैंड-अप इंडिया ऋण स्वीकृति हेतु।
3. **जिला उद्योग केंद्र (DIC)**: PMEGP टास्क फ़ोर्स सब्सिडी अनुमोदन और पीएम विश्वकर्मा सत्यापन के लिए।
4. **ऑनलाइन पोर्टल**: आप **jansamarth.in** पर भी सीधे आवेदन कर सकते हैं।`,
        punjabiText: `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਦੇ ਆਧਾਰ 'ਤੇ ਅਧਿਕਾਰਤ ਅਰਜ਼ੀ ਕੇਂਦਰ: ਸਟੇਟ ਚੈਨਲਾਈਜ਼ਿੰਗ ਏਜੰਸੀ (SCA), ਨਜ਼ਦੀਕੀ ਸਰਕਾਰੀ ਬੈਂਕ (SBI/PNB), ਅਤੇ JanSamarth ਪੋਰਟਲ (jansamarth.in)।`,
        timestamp: timeStr,
        featureMode: 'partners',
        partnerCard: {
          nearestPartners: [
            {
              name: 'State Channelizing Agency (SCA) District Office',
              type: 'Apex Channelizing Agency (SCA)',
              distanceKm: 3.4,
              address: 'Vikas Bhawan, Near Collectorate, Civil Lines',
              schemeAuthorization: 'NSFDC, NBCFDC, NSKFDC direct concessional loans'
            },
            {
              name: 'State Bank of India (SBI) SME Branch',
              type: 'Public Sector Bank (PSB)',
              distanceKm: 1.8,
              address: 'Main Commercial Branch, Station Road',
              schemeAuthorization: 'PMEGP, Stand-Up India, Mudra & CGTMSE'
            },
            {
              name: 'District Industries Centre (DIC)',
              type: 'DIC Nodal Office',
              distanceKm: 4.2,
              address: 'Industrial Estate, Phase 1',
              schemeAuthorization: 'PMEGP Task Force Committee & PM Vishwakarma verification'
            }
          ]
        },
        suggestedPrompts: [
          'What documents should I carry to the SCA office?',
          'Check eligibility for Stand-Up India',
          'Simulate what-if I apply through a rural branch'
        ]
      };
    }

    case 'documents': {
      if (!isProfileFilled) {
        return {
          id: `saathi-${Date.now()}`,
          sender: 'assistant',
          text: `Here is an overview of the core documents required to apply for Indian government business loans and capital subsidies:
1. **Identity & Address Proof**: Aadhaar Card (linked to active mobile number) & PAN Card.
2. **Business Proof**: Udyam MSME Registration (100% free online registration at udyamregistration.gov.in in 10 minutes).
3. **Financial Statement**: Bank Account Statement for the last 6 months.
4. **Category Certificate**: Digitized Caste / Category Certificate (for SC/ST/OBC applicants to unlock up to 35% subsidies).
5. **Project Outline**: Detailed Project Report (DPR / Viability Summary).

To generate your exact tailored document checklist:
Could you please tell me:
1. What is your planned **business or trade**?
2. Which **social category** (SC / ST / OBC / Women / General) do you belong to?`,
          hindiText: `सरकारी व्यावसायिक ऋण और सब्सिडी के लिए आवश्यक मुख्य दस्तावेज़ों का विवरण:
1. **पहचान व पता प्रमाण**: आधार कार्ड (मोबाइल से लिंक) और पैन कार्ड।
2. **व्यवसाय प्रमाण**: उद्यम एमएसएमई पंजीकरण (udyamregistration.gov.in पर 10 मिनट में 100% निःशुल्क)।
3. **वित्तीय विवरण**: पिछले 6 माह का बैंक खाता विवरण (स्टेटमेंट)।
4. **जाति प्रमाण पत्र**: डिजिटल जाति/श्रेणी प्रमाण पत्र (SC/ST/OBC हेतु 35% तक सब्सिडी के लिए)।
5. **प्रोजेक्ट रिपोर्ट**: विस्तृत व्यवसाय योजना (DPR)।

अपनी व्यक्तिगत दस्तावेज़ चेकलिस्ट प्राप्त करने के लिए, कृपया बताएं:
1. आपका **कार्य या व्यवसाय** क्या है?
2. आपकी **सामाजिक श्रेणी** क्या है?`,
          punjabiText: `ਸਰਕਾਰੀ ਕਾਰੋਬਾਰੀ ਕਰਜ਼ਿਆਂ ਲਈ ਲੋੜੀਂਦੇ ਮੁੱਖ ਕਾਗਜ਼ਾਤ: ਆਧਾਰ ਕਾਰਡ, ਪੈਨ ਕਾਰਡ, ਬੈਂਕ ਸਟੇਟਮੈਂਟ, ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ। ਆਪਣੀ ਸਹੀ ਸੂਚੀ ਲਈ ਆਪਣਾ ਕੰਮ ਅਤੇ ਸ਼੍ਰੇਣੀ ਦੱਸੋ।`,
          timestamp: timeStr,
          featureMode: 'documents',
          documentCard: {
            schemeName: 'PMEGP & NSFDC Credit Linkage',
            documents: [
              { name: 'Aadhaar Card (linked to Mobile)', mandatory: true, status: 'Ready', howToGet: 'UIDAI Portal / Nearest CSC' },
              { name: `${category} Caste Certificate (Digital)`, mandatory: true, status: 'Ready', howToGet: 'State e-District / Tehsil Portal' },
              { name: 'Udyam MSME Registration (100% Free)', mandatory: true, status: 'Missing', howToGet: 'udyamregistration.gov.in (Takes 10 mins)' },
              { name: 'Bank Statement (Last 6 Months)', mandatory: true, status: 'Ready', howToGet: 'Net Banking or Bank Passbook Stamp' },
              { name: 'Detailed Project Report (DPR / Viability)', mandatory: true, status: 'Ready', howToGet: 'Generated automatically by SchemeMatch AI' },
              { name: 'Rent Agreement / Land Ownership Proof', mandatory: false, status: 'Ready', howToGet: 'Local Panchayat or Municipality deed' }
            ]
          },
          suggestedPrompts: [
            'Tailoring business, OBC category',
            'Dairy farming, SC category',
            'Retail grocery shop, General category'
          ]
        };
      }

      return {
        id: `saathi-${Date.now()}`,
        sender: 'assistant',
        text: `Here is your personalized document checklist for applying under Ministry of Social Justice & PMEGP schemes (${category} category). Ensuring these documents are active and digitized increases your sanction speed by over 3x!`,
        hindiText: `सामाजिक न्याय मंत्रालय और PMEGP योजनाओं (${category} श्रेणी) में आवेदन हेतु आपकी व्यक्तिगत दस्तावेज़ चेकलिस्ट तैयार है।`,
        punjabiText: `ਸਮਾਜਿਕ ਨਿਆਂ ਮੰਤਰਾਲੇ ਅਤੇ PMEGP ਸਕੀਮਾਂ ਲਈ ਤੁਹਾਡੀ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਇੱਥੇ ਹੈ।`,
        timestamp: timeStr,
        featureMode: 'documents',
        documentCard: {
          schemeName: 'PMEGP & NSFDC Credit Linkage',
          documents: [
            { name: 'Aadhaar Card (linked to Mobile)', mandatory: true, status: 'Ready', howToGet: 'UIDAI Portal / Nearest CSC' },
            { name: `${category} Caste Certificate (Digital)`, mandatory: true, status: 'Ready', howToGet: 'State e-District / Tehsil Portal' },
            { name: 'Udyam MSME Registration (100% Free)', mandatory: true, status: 'Missing', howToGet: 'udyamregistration.gov.in (Takes 10 mins)' },
            { name: 'Bank Statement (Last 6 Months)', mandatory: true, status: 'Ready', howToGet: 'Net Banking or Bank Passbook Stamp' },
            { name: 'Detailed Project Report (DPR / Viability)', mandatory: true, status: 'Ready', howToGet: 'Generated automatically by SchemeMatch AI' },
            { name: 'Rent Agreement / Land Ownership Proof', mandatory: false, status: 'Ready', howToGet: 'Local Panchayat or Municipality deed' }
          ]
        },
        suggestedPrompts: [
          'How do I register for Udyam in 10 minutes?',
          'Calculate my monthly EMI',
          'Find nearest authorized channel partner'
        ]
      };
    }

    case 'emi': {
      const rate = 8.5;
      const tenureMonths = 60;
      const subsidyRate = location === 'Rural' ? 0.35 : 0.25;
      const subsidyAmount = Math.round(loanAmt * subsidyRate);
      const netPrincipal = Math.max(10000, loanAmt - subsidyAmount);
      const r = rate / 1200;
      const emi = Math.round((netPrincipal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));

      if (!isProfileFilled) {
        return {
          id: `saathi-${Date.now()}`,
          sender: 'assistant',
          text: `Government-backed enterprise loans (like PMEGP, Mudra, and NSFDC) offer subsidized interest rates (4% to 8.5%) and capital subsidies (25% to 35%) that significantly reduce your effective monthly EMI:
- **Example Calculation**: For a **₹5 Lakh** loan under PMEGP, a **35% Capital Subsidy (₹1.75 Lakhs)** lowers your net loan to **₹3.25 Lakhs**, with an estimated EMI of only **~₹6,600/month** and a 6-month moratorium period.

To calculate your exact EMI, subsidy amount, and interest rate:
Could you please share:
1. Approximately **how much loan or funding** do you need?
2. What is your **planned business or trade**?
3. Your **social category** (SC / ST / OBC / Women / General) and **location** (Rural village or Urban city)?`,
          hindiText: `सरकारी व्यावसायिक ऋणों (जैसे PMEGP, मुद्रा, NSFDC) में रियायती ब्याज दरें (4% से 8.5%) और पूंजीगत सब्सिडी (25% से 35%) मिलती हैं, जिससे मासिक किस्त (EMI) बहुत कम हो जाती है:
- **उदाहरण गणना**: ₹5 लाख के ऋण पर PMEGP में **35% सब्सिडी (₹1.75 लाख)** मिलने से शुद्ध ऋण घटकर केवल ₹3.25 लाख रह जाता है, जिससे मासिक ईएमआई मात्र **~₹6,600/माह** आती है।

अपनी सटीक ईएमआई और सब्सिडी की गणना के लिए, कृपया बताएं: ऋण राशि, कार्य और श्रेणी।`,
          punjabiText: `ਸਰਕਾਰੀ ਕਰਜ਼ਿਆਂ ਵਿੱਚ 25% ਤੋਂ 35% ਸਬਸਿਡੀ ਮਿਲਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI) ਬਹੁਤ ਘੱਟ ਜਾਂਦੀ ਹੈ। ਸਹੀ EMI ਜਾਣਨ ਲਈ ਕਰਜ਼ੇ ਦੀ ਰਕਮ ਅਤੇ ਕੰਮ ਦੱਸੋ।`,
          timestamp: timeStr,
          featureMode: 'emi',
          emiCard: {
            schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
            loanAmount: 500000,
            subsidyAmount: 175000,
            interestRate: 8.5,
            tenureMonths: 60,
            monthlyEmi: 6650,
            moratoriumMonths: 6
          },
          suggestedPrompts: [
            'Need ₹2 Lakhs loan for tailoring shop, OBC Rural',
            'Need ₹5 Lakhs for dairy farming, SC category',
            'Calculate EMI for ₹10 Lakhs manufacturing unit'
          ]
        };
      }

      return {
        id: `saathi-${Date.now()}`,
        sender: 'assistant',
        text: `Here is your loan and EMI breakdown for a loan of ₹${loanAmt.toLocaleString('en-IN')}. Under PMEGP (${category}, ${location}), you qualify for a **${subsidyRate * 100}% Capital Subsidy (₹${subsidyAmount.toLocaleString('en-IN')})**. With a concessional rate of ${rate}% over 5 years (60 months) and a 6-month moratorium on principal repayment, your estimated net monthly EMI is **₹${emi.toLocaleString('en-IN')}/month**.`,
        hindiText: `₹${loanAmt.toLocaleString('en-IN')} के ऋण के लिए आपकी ईएमआई का विवरण: PMEGP (${category}, ${location === 'Rural' ? 'ग्रामीण' : 'शहरी'}) के तहत आपको **${subsidyRate * 100}% सरकारी सब्सिडी (₹${subsidyAmount.toLocaleString('en-IN')})** मिलेगी। अनुमानित शुद्ध मासिक ईएमआई मात्र **₹${emi.toLocaleString('en-IN')}/माह** होगी।`,
        punjabiText: `₹${loanAmt.toLocaleString('en-IN')} ਦੇ ਕਰਜ਼ੇ ਲਈ ਤੁਹਾਡੀ ਈਐਮਆਈ: ਤੁਹਾਨੂੰ ${subsidyRate * 100}% ਸਬਸਿਡੀ ਮਿਲੇਗੀ ਅਤੇ ਮਾਸਿਕ ਕਿਸ਼ਤ ਲਗਭਗ ₹${emi.toLocaleString('en-IN')}/ਮਹੀਨਾ ਹੋਵੇਗੀ।`,
        timestamp: timeStr,
        featureMode: 'emi',
        emiCard: {
          schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
          loanAmount: loanAmt,
          subsidyAmount,
          interestRate: rate,
          tenureMonths,
          monthlyEmi: emi,
          moratoriumMonths: 6
        },
        suggestedPrompts: [
          'What if I increase loan tenure to 7 years?',
          'What documents are needed for bank EMI approval?',
          'Find nearest PSB branch to apply for this loan'
        ]
      };
    }

    case 'recommendation':
    default: {
      if (!isProfileFilled) {
        return {
          id: `saathi-${Date.now()}`,
          sender: 'assistant',
          text: `To recommend the best government schemes and maximum subsidies (up to 35%) for you, could you please tell me:
1. **Business or Trade**: What kind of business or enterprise do you plan to start or expand? (e.g., tailoring shop, dairy farming, grocery/retail, food stall, manufacturing)
2. **Loan Amount**: Approximately how much funding or bank loan do you need?
3. **Social Category & Location**: Your category (SC / ST / OBC / Women / General) and location (Rural village or Urban city) so we can calculate your exact subsidy bracket.`,
          hindiText: `आपको सबसे उपयुक्त सरकारी योजनाएं और अधिकतम सब्सिडी (35% तक) सुझाने के लिए, कृपया मुझे 3 बुनियादी बातें बताएं:
1. **व्यवसाय या कार्य**: आप किस प्रकार का व्यवसाय शुरू या विस्तार करना चाहते हैं? (जैसे सिलाई की दुकान, डेयरी, किराना/खुदरा, खाद्य स्टॉल, विनिर्माण)
2. **ऋण राशि**: आपको लगभग कितनी वित्तीय सहायता या बैंक ऋण की आवश्यकता है?
3. **श्रेणी और क्षेत्र**: आपकी सामाजिक श्रेणी (SC / ST / OBC / महिला / सामान्य) और क्षेत्र (ग्रामीण गांव या शहर)।`,
          punjabiText: `ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਬਸਿਡੀ (35% ਤੱਕ) ਦੱਸਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਹ ਦੱਸੋ:
1. **ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ**: ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? (ਜਿਵੇਂ ਸਿਲਾਈ, ਡੇਅਰੀ, ਕਰਿਆਨਾ, ਫੂਡ ਸਟਾਲ)
2. **ਕਰਜ਼ੇ ਦੀ ਰਕਮ**: ਤੁਹਾਨੂੰ ਕਿੰਨੇ ਕਰਜ਼ੇ ਦੀ ਲੋੜ ਹੈ?
3. **ਸ਼੍ਰੇਣੀ ਅਤੇ ਸਥਾਨ**: ਤੁਹਾਡੀ ਸ਼੍ਰੇਣੀ (SC / ST / OBC / ਮਹਿਲਾ / ਜਨਰਲ) ਅਤੇ ਖੇਤਰ (ਪੇਂਡੂ ਜਾਂ ਸ਼ਹਿਰੀ)।`,
          timestamp: timeStr,
          featureMode: 'recommendation',
          matchedSchemes: [
            {
              id: 'pmegp-2026',
              name: "Prime Minister's Employment Generation Programme (PMEGP)",
              subsidyHighlight: 'Up to 35% Capital Subsidy',
              interestRate: '8.5% p.a.',
              maxLoan: 5000000
            },
            {
              id: 'pm-vishwakarma',
              name: 'PM Vishwakarma Scheme for Artisans & Trades',
              subsidyHighlight: '₹15,000 Toolkit + 5% Interest Loan',
              interestRate: '5.0% Subsidized',
              maxLoan: 300000
            },
            {
              id: 'standup-india',
              name: 'Stand-Up India Scheme for SC/ST & Women',
              subsidyHighlight: 'Bank Credit from ₹10 Lakh to ₹1 Crore',
              interestRate: 'MCLR + 3%',
              maxLoan: 10000000
            }
          ],
          suggestedPrompts: [
            'I want to open a tailoring shop, need ₹2 Lakhs, OBC Rural',
            'Need ₹5 Lakhs for dairy farming, SC category',
            'Retail grocery shop loan ₹1 Lakh, Women entrepreneur'
          ]
        };
      }

      return {
        id: `saathi-${Date.now()}`,
        sender: 'assistant',
        text: `Here are the top high-impact government schemes matching your profile (${category} entrepreneur in a ${location} area, requirement ₹${loanAmt.toLocaleString('en-IN')}):
1. **PMEGP**: Up to 35% Capital Grant & loan up to ₹50 Lakhs.
2. **PM Vishwakarma**: ₹15,000 tool grant + 5% subsidized loan for traditional artisans.
3. **Stand-Up India / NSFDC**: ₹10 Lakh to ₹1 Crore credit at concessional rates.`,
        hindiText: `आपकी प्रोफ़ाइल (${location === 'Rural' ? 'ग्रामीण' : 'शहरी'} क्षेत्र में ${category} उद्यमी) के आधार पर सर्वश्रेष्ठ योजनाएं: PMEGP, पीएम विश्वकर्मा, और स्टैंड-अप इंडिया।`,
        punjabiText: `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਦੇ ਆਧਾਰ 'ਤੇ ਵਧੀਆ ਸਕੀਮਾਂ: PMEGP, PM ਵਿਸ਼ਵਕਰਮਾ, ਅਤੇ ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ।`,
        timestamp: timeStr,
        featureMode: 'recommendation',
        matchedSchemes: [
          {
            id: 'pmegp-2026',
            name: "Prime Minister's Employment Generation Programme (PMEGP)",
            subsidyHighlight: 'Up to 35% Capital Subsidy',
            interestRate: '8.5% p.a.',
            maxLoan: 5000000
          },
          {
            id: 'pm-vishwakarma',
            name: 'PM Vishwakarma Scheme for Artisans & Trades',
            subsidyHighlight: '₹15,000 Toolkit + 5% Interest Loan',
            interestRate: '5.0% Subsidized',
            maxLoan: 300000
          },
          {
            id: 'standup-india',
            name: 'Stand-Up India Scheme for SC/ST & Women',
            subsidyHighlight: 'Bank Credit from ₹10 Lakh to ₹1 Crore',
            interestRate: 'MCLR + 3%',
            maxLoan: 10000000
          }
        ],
        suggestedPrompts: [
          'Check my eligibility for PMEGP',
          'Calculate my monthly EMI',
          'What documents do I need to apply?'
        ]
      };
    }
  }
};
