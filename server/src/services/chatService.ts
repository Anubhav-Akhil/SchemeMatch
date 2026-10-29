import { 
  Scheme, 
  UserProfile, 
  SocialCategory, 
  Gender, 
  SectorType, 
  ChatMessage, 
  ChatFeatureMode,
  ChatEmiCardData,
  ChatDocumentItem,
  ChatPartnerItem,
  ChatWhatIfCardData,
  ChatEligibilityCardData
} from '../types';

export class SaathiChatService {
  private schemes: Scheme[];

  constructor(schemes: Scheme[]) {
    this.schemes = schemes;
  }

  private calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): number {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    const r = annualRatePercent / 1200;
    if (r === 0) return Math.round(principal / tenureMonths);
    const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    return Math.round(emi);
  }

  public processMessage(
    userQuery: string, 
    currentProfile?: Partial<UserProfile>, 
    preferredMode?: ChatFeatureMode
  ): ChatMessage {
    const q = userQuery.toLowerCase().trim();
    const updates: Partial<UserProfile> = {};
    const suggestedPrompts: string[] = [];

    // Entity extraction with exact word boundaries
    if (/\bsc\b/i.test(q) || q.includes('scheduled caste') || q.includes('dalit') || q.includes('अनुसूचित जाति')) {
      updates.category = 'SC';
    } else if (/\bst\b/i.test(q) || q.includes('scheduled tribe') || q.includes('adivasi') || q.includes('अनुसूचित जनजाति')) {
      updates.category = 'ST';
    } else if (/\bobc\b/i.test(q) || q.includes('backward class') || q.includes('पिछड़ा वर्ग')) {
      updates.category = 'OBC';
    } else if (q.includes('safai') || q.includes('sanitation') || q.includes('scavenger') || q.includes('सफाई कर्मचारी')) {
      updates.category = 'SafaiKaramchari';
      updates.isSafaiKaramchariDependent = true;
    } else if (q.includes('minority') || q.includes('muslim') || q.includes('christian') || q.includes('sikh') || q.includes('अल्पसंख्यक')) {
      updates.category = 'Minority';
      updates.isMinority = true;
    }

    if (q.includes('mahila') || /\bwoman\b/i.test(q) || /\bwomen\b/i.test(q) || /\bfemale\b/i.test(q) || q.includes('महिला') || q.includes('ਔਰਤ')) {
      updates.gender = 'Female';
    } else if (q.includes('purush') || /\bman\b/i.test(q) || /\bmale\b/i.test(q) || q.includes('पुरुष') || q.includes('ਮਰਦ')) {
      updates.gender = 'Male';
    }

    if (q.includes('divyang') || q.includes('handicap') || q.includes('disabled') || q.includes('disability') || q.includes('दिव्यांग') || q.includes('ਅਪਾਹਜ')) {
      updates.isDifferentlyAbled = true;
      updates.disabilityPercentage = 40;
    }

    if (q.includes('gaao') || q.includes('gaon') || q.includes('rural') || q.includes('village') || q.includes('ग्रामीण') || q.includes('ਪੇਂਡੂ')) {
      updates.locationType = 'Rural';
    } else if (q.includes('city') || q.includes('urban') || q.includes('nagar') || q.includes('shahar') || q.includes('शहरी') || q.includes('ਸ਼ਹਿਰੀ')) {
      updates.locationType = 'Urban';
    }

    if (q.includes('silai') || q.includes('tailor') || q.includes('garment') || q.includes('कपड़ा') || q.includes('ਕੱਪੜੇ')) {
      updates.sector = 'Textiles';
      updates.tradeType = 'Tailoring & Garments';
    } else if (q.includes('bunkar') || q.includes('weaver') || q.includes('handloom') || q.includes('कारीगर') || q.includes('artisan') || q.includes('craft')) {
      updates.sector = 'ArtisanHandicraft';
      updates.tradeType = 'Handloom / Artisan Craft';
    } else if (q.includes('vendor') || q.includes('thela') || q.includes('food cart') || q.includes('chaat') || q.includes('stall') || q.includes('रेहड़ी') || q.includes('ਰੇਹੜੀ')) {
      updates.sector = 'StreetVending';
      updates.tradeType = 'Street Vending Stall';
    } else if (q.includes('sanitation') || q.includes('cleaning') || q.includes('सफाई')) {
      updates.sector = 'Sanitation';
      updates.tradeType = 'Mechanized Sanitation Services';
    } else if (q.includes('kisan') || q.includes('agro') || q.includes('krishi') || q.includes('dairy') || q.includes('poultry') || q.includes('खेती') || q.includes('ਡੇਅਰੀ')) {
      updates.sector = 'AgroAllied';
      updates.tradeType = 'Agro-Processing & Allied';
    }

    // Loan amount parsing
    const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|ਲੱਖ)/i);
    if (lakhMatch) {
      const lakhs = parseFloat(lakhMatch[1]);
      updates.requiredLoanAmount = lakhs * 100000;
      updates.totalProjectCost = Math.round(updates.requiredLoanAmount * 1.1);
    } else {
      const numMatch = q.match(/(?:rs\.?|inr|₹)?\s*(\d{4,7})/i);
      if (numMatch) {
        updates.requiredLoanAmount = parseInt(numMatch[1], 10);
        updates.totalProjectCost = Math.round(updates.requiredLoanAmount * 1.1);
      }
    }

    const isProfileFilled = Boolean(
      currentProfile && (
        (currentProfile.category && String(currentProfile.category).trim()) ||
        (currentProfile.sector && String(currentProfile.sector).trim()) ||
        (currentProfile.tradeType && String(currentProfile.tradeType).trim()) ||
        (currentProfile.requiredLoanAmount && Number(currentProfile.requiredLoanAmount) > 0)
      )
    );
    const hasDetailsInQuery = Boolean(
      updates.category || updates.tradeType || updates.sector || updates.requiredLoanAmount
    );

    const mergedCategory = updates.category || currentProfile?.category || 'SC';
    const mergedLocation = updates.locationType || currentProfile?.locationType || 'Rural';
    const loanAmt = updates.requiredLoanAmount || currentProfile?.requiredLoanAmount || 500000;

    // Determine Feature Mode
    let detectedMode: ChatFeatureMode = preferredMode || 'general';
    if (detectedMode === 'general') {
      if (q.includes('emi') || q.includes('किस्त') || q.includes('installment') || q.includes('ਕਿਸ਼ਤ') || q.includes('moratorium') || ((q.includes('interest') || q.includes('ब्याज')) && !q.includes('scheme') && !q.includes('योजना'))) {
        detectedMode = 'emi';
      } else if (q.includes('document') || q.includes('paper') || q.includes('kagaz') || q.includes('aadhaar') || q.includes('pan') || q.includes('दस्तावेज') || q.includes('ਕਾਗਜ਼ਾਤ') || q.includes('certificate')) {
        detectedMode = 'documents';
      } else if (q.includes('partner') || q.includes('bank') || q.includes('branch') || q.includes('where to apply') || q.includes('sca') || q.includes('psb') || q.includes('कहाँ') || q.includes('ਕਿੱਥੇ')) {
        detectedMode = 'partners';
      } else if (q.includes('what if') || q.includes('what-if') || q.includes('change') || q.includes('income') || q.includes('अगर') || q.includes('ਜੇਕਰ') || q.includes('simulate')) {
        detectedMode = 'whatif';
      } else if (q.includes('eligib') || q.includes('qualif') || q.includes('patrata') || q.includes('score') || q.includes('पात्रता') || q.includes('ਯੋਗਤਾ')) {
        detectedMode = 'eligibility';
      } else if (q.includes('scheme') || q.includes('yojana') || q.includes('recommend') || q.includes('योजना') || q.includes('ਸਕੀਮ') || q.includes('best') || q.includes('suggest') || q.includes('find') || hasDetailsInQuery) {
        detectedMode = 'recommendation';
      }
    }

    let responseText = '';
    let responseHindi = '';
    let responsePunjabi = '';
    let emiCard: ChatEmiCardData | undefined;
    let documentCard: { schemeName: string; documents: ChatDocumentItem[] } | undefined;
    let partnerCard: { nearestPartners: ChatPartnerItem[] } | undefined;
    let whatIfCard: ChatWhatIfCardData | undefined;
    let eligibilityCard: ChatEligibilityCardData | undefined;
    const matchedSchemes: Array<{ id: string; name: string; subsidyHighlight: string; interestRate?: string; maxLoan?: number }> = [];

    switch (detectedMode) {
      case 'emi': {
        const rate = 8.5;
        const tenureMonths = 60;
        const subsidyRate = mergedLocation === 'Rural' ? 0.35 : 0.25;
        const subsidyAmount = Math.round(loanAmt * subsidyRate);
        const netLoanPrincipal = Math.max(10000, loanAmt - subsidyAmount);
        const monthlyEmi = this.calculateEmi(netLoanPrincipal, rate, tenureMonths);

        responseText = `Here is your loan and EMI breakdown for a loan of ₹${loanAmt.toLocaleString('en-IN')}. Under PMEGP (${mergedCategory}, ${mergedLocation}), you qualify for a **${subsidyRate * 100}% Capital Subsidy (₹${subsidyAmount.toLocaleString('en-IN')})**. With a concessional rate of ${rate}% over 5 years (60 months) and a 6-month moratorium on principal repayment, your estimated net monthly EMI is **₹${monthlyEmi.toLocaleString('en-IN')}/month**.`;
        
        responseHindi = `₹${loanAmt.toLocaleString('en-IN')} के ऋण के लिए आपकी ईएमआई का विवरण: PMEGP (${mergedCategory}, ${mergedLocation === 'Rural' ? 'ग्रामीण' : 'शहरी'}) के तहत आपको **${subsidyRate * 100}% सरकारी सब्सिडी (₹${subsidyAmount.toLocaleString('en-IN')})** मिलेगी। 5 वर्ष (60 माह) के लिए ${rate}% वार्षिक ब्याज दर और 6 माह के अधिस्थगन (मोरेटोरियम) के साथ आपकी अनुमानित शुद्ध मासिक ईएमआई मात्र **₹${monthlyEmi.toLocaleString('en-IN')}/माह** होगी।`;

        responsePunjabi = `₹${loanAmt.toLocaleString('en-IN')} ਦੇ ਕਰਜ਼ੇ ਲਈ ਤੁਹਾਡੀ ਈਐਮਆਈ ਦੀ ਜਾਣਕਾਰੀ: PMEGP (${mergedCategory}, ${mergedLocation === 'Rural' ? 'ਪੇਂਡੂ' : 'ਸ਼ਹਿਰੀ'}) ਦੇ ਤਹਿਤ ਤੁਹਾਨੂੰ **${subsidyRate * 100}% ਸਬਸਿਡੀ (₹${subsidyAmount.toLocaleString('en-IN')})** ਮਿਲ ਸਕਦੀ ਹੈ। 5 ਸਾਲ (60 ਮਹੀਨੇ) ਲਈ ${rate}% ਵਿਆਜ ਦਰ 'ਤੇ ਤੁਹਾਡੀ ਮਾਸਿਕ ਕਿਸ਼ਤ ਲਗਭਗ **₹${monthlyEmi.toLocaleString('en-IN')}/ਮਹੀਨਾ** ਹੋਵੇਗੀ।`;

        emiCard = {
          schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
          loanAmount: loanAmt,
          subsidyAmount,
          interestRate: rate,
          tenureMonths,
          monthlyEmi,
          moratoriumMonths: 6
        };

        suggestedPrompts.push(
          'What if I increase loan tenure to 7 years?',
          'What documents are needed for bank EMI approval?',
          'Find nearest PSB branch to apply for this loan'
        );
        break;
      }

      case 'documents': {
        responseText = `Here is your personalized document checklist for applying to Ministry of Social Justice & PMEGP schemes. Ensuring these documents are active and digitized increases your sanction speed by over 3x!`;
        responseHindi = `सामाजिक न्याय मंत्रालय और PMEGP योजनाओं में आवेदन हेतु आपकी व्यक्तिगत दस्तावेज़ चेकलिस्ट तैयार है। इन दस्तावेजों को डिजिटल रूप में रखने से ऋण स्वीकृति 3 गुना तेज़ी से होती है!`;
        responsePunjabi = `ਸਮਾਜਿਕ ਨਿਆਂ ਮੰਤਰਾਲੇ ਅਤੇ PMEGP ਸਕੀਮਾਂ ਲਈ ਤੁਹਾਡੀ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਇੱਥੇ ਹੈ। ਇਹ ਕਾਗਜ਼ਾਤ ਤਿਆਰ ਹੋਣ ਨਾਲ ਕਰਜ਼ਾ ਬਹੁਤ ਜਲਦੀ ਮਨਜ਼ੂਰ ਹੁੰਦਾ ਹੈ।`;

        documentCard = {
          schemeName: 'PMEGP & NSFDC Credit Linkage',
          documents: [
            { name: 'Aadhaar Card (linked to Mobile)', mandatory: true, status: 'Ready', howToGet: 'UIDAI Portal / Nearest CSC' },
            { name: `${mergedCategory} Caste Certificate (Digital)`, mandatory: true, status: 'Ready', howToGet: 'State e-District / Tehsil Portal' },
            { name: 'Udyam MSME Registration (100% Free)', mandatory: true, status: 'Missing', howToGet: 'udyamregistration.gov.in (Takes 10 mins)' },
            { name: 'Bank Statement (Last 6 Months)', mandatory: true, status: 'Ready', howToGet: 'Net Banking or Bank Passbook Stamp' },
            { name: 'Detailed Project Report (DPR / Viability)', mandatory: true, status: 'Ready', howToGet: 'Generated automatically by SchemeMatch AI' },
            { name: 'Rent Agreement / Land Ownership Proof', mandatory: false, status: 'Ready', howToGet: 'Local Panchayat or Municipality deed' }
          ]
        };

        suggestedPrompts.push(
          'How do I register for Udyam in 10 minutes?',
          'Calculate my monthly EMI',
          'Find nearest authorized channel partner'
        );
        break;
      }

      case 'partners': {
        responseText = `We have located authorized Channel Partners (SCAs, Public Sector Banks, and District Industries Centres) ready to process your application under Government concessional credit mandates.`;
        responseHindi = `हमने आपके लिए अधिकृत चैनल पार्टनर (राज्य चैनलाइजिंग एजेंसी, सरकारी बैंक, और जिला उद्योग केंद्र) चिन्हित किए हैं जो आपका आवेदन सीधे स्वीकार करेंगे।`;
        responsePunjabi = `ਅਸੀਂ ਤੁਹਾਡੇ ਇਲਾਕੇ ਦੇ ਅਧਿਕਾਰਤ ਚੈਨਲ ਪਾਰਟਨਰ (ਸਰਕਾਰੀ ਬੈਂਕ ਅਤੇ ਜ਼ਿਲ੍ਹਾ ਉਦਯੋਗ ਕੇਂਦਰ) ਲੱਭੇ ਹਨ ਜੋ ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਸਵੀਕਾਰ ਕਰਨਗੇ।`;

        partnerCard = {
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
        };

        suggestedPrompts.push(
          'What documents should I carry to the SCA office?',
          'Check eligibility for Stand-Up India',
          'Simulate what-if I apply through a rural branch'
        );
        break;
      }

      case 'whatif': {
        const baselineSub = Math.round(loanAmt * 0.15);
        const improvedSub = Math.round(loanAmt * 0.35);
        const baseEmi = this.calculateEmi(loanAmt - baselineSub, 10.5, 60);
        const impEmi = this.calculateEmi(loanAmt - improvedSub, 7.5, 60);

        responseText = `Here is your **What-If Eligibility Simulation**. Changing your enterprise location or formalizing documentation substantially boosts your government benefit:
- **Baseline (Urban / General category)**: 15% Subsidy (₹${baselineSub.toLocaleString('en-IN')}) | EMI: ₹${baseEmi.toLocaleString('en-IN')}/mo
- **Optimized (${mergedCategory} / Rural setting)**: **35% Subsidy (₹${improvedSub.toLocaleString('en-IN')})** | Concessional EMI: **₹${impEmi.toLocaleString('en-IN')}/mo**
- **Net Monthly Savings**: ₹${(baseEmi - impEmi).toLocaleString('en-IN')}/month!`;

        responseHindi = `यह आपका **व्हॉट-इफ (What-If) सिमुलेशन** है:
- **सामान्य शहरी स्थिति**: 15% सब्सिडी (₹${baselineSub.toLocaleString('en-IN')}) | ईएमआई: ₹${baseEmi.toLocaleString('en-IN')}/माह
- **अनुकूलित (${mergedCategory} / ग्रामीण)**: **35% सब्सिडी (₹${improvedSub.toLocaleString('en-IN')})** | रियायती ईएमआई: **₹${impEmi.toLocaleString('en-IN')}/माह**
- **मासिक बचत**: ₹${(baseEmi - impEmi).toLocaleString('en-IN')}/माह!`;

        responsePunjabi = `ਤੁਹਾਡਾ **ਵੱਟ-ਇਫ਼ ਸਿਮੂਲੇਸ਼ਨ (What-If)**:
- **ਆਮ ਸ਼ਹਿਰੀ ਵਿਕਲਪ**: 15% ਸਬਸਿਡੀ | ਕਿਸ਼ਤ: ₹${baseEmi.toLocaleString('en-IN')}/ਮਹੀਨਾ
- **ਅਨੁਕੂਲਿਤ (${mergedCategory} / ਪੇਂਡੂ)**: **35% ਸਬਸਿਡੀ (₹${improvedSub.toLocaleString('en-IN')})** | ਕਿਸ਼ਤ: **₹${impEmi.toLocaleString('en-IN')}/ਮਹੀਨਾ**
- **ਕੁੱਲ ਮਾਸਿਕ ਬੱਚਤ**: ₹${(baseEmi - impEmi).toLocaleString('en-IN')}/ਮਹੀਨਾ!`;

        whatIfCard = {
          baselineSubsidy: baselineSub,
          improvedSubsidy: improvedSub,
          baselineEmi: baseEmi,
          improvedEmi: impEmi,
          recommendationTip: 'Establishing your manufacturing unit in a notified Rural Panchayat qualifies you for the top 35% capital subsidy bracket under PMEGP.'
        };

        suggestedPrompts.push(
          'Check required documents for rural PMEGP',
          'Find nearest rural bank branch',
          'Calculate exact EMI for ₹10 Lakhs'
        );
        break;
      }

      case 'eligibility': {
        responseText = `Here is your instant **Eligibility Verification Result** for top central schemes based on your profile. You meet 100% of the core socioeconomic guidelines.`;
        responseHindi = `आपकी प्रोफ़ाइल के आधार पर शीर्ष केंद्रीय योजनाओं के लिए आपका **पात्रता सत्यापन परिणाम** तैयार है। आप सभी प्रमुख सामाजिक-आर्थिक दिशानिर्देशों को पूरा करते हैं।`;
        responsePunjabi = `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਦੇ ਅਨੁਸਾਰ ਮੁੱਖ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ ਤੁਹਾਡਾ **ਯੋਗਤਾ ਨਤੀਜਾ** ਤਿਆਰ ਹੈ। ਤੁਸੀਂ ਸਾਰੇ ਜ਼ਰੂਰੀ ਨਿਯਮਾਂ ਨੂੰ ਪੂਰਾ ਕਰਦੇ ਹੋ।`;

        eligibilityCard = {
          schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
          matchScore: 96,
          verdict: 'Eligible',
          reasons: [
            `Applicant belongs to designated special beneficiary category (${mergedCategory})`,
            `Proposed unit location (${mergedLocation}) qualifies for apex subsidy bracket`,
            `Applicant age and project outlay are within permissible limits`,
            'Beneficiary promoter contribution of 5% meets minimal capital mandate'
          ],
          remedyTips: [
            'Obtain free Udyam MSME registration before final bank disbursement',
            'Keep digitized caste certificate ready for online DIC verification'
          ]
        };

        suggestedPrompts.push(
          'Show my loan and EMI breakdown',
          'Download bank-ready document checklist',
          'Connect with nearest Channel Partner'
        );
        break;
      }

      case 'recommendation': {
        if (!isProfileFilled && !hasDetailsInQuery) {
          responseText = `To recommend the best government schemes and maximum subsidies (up to 35%) for you, could you please tell me:
1. **Business or Trade**: What kind of business or enterprise do you plan to start or expand? (e.g., tailoring shop, dairy farming, grocery/retail, food stall, manufacturing)
2. **Loan Amount**: Approximately how much funding or bank loan do you need?
3. **Social Category & Location**: Your category (SC / ST / OBC / Women / General) and location (Rural village or Urban city) so we can calculate your exact subsidy bracket.`;

          responseHindi = `आपको सबसे उपयुक्त सरकारी योजनाएं और अधिकतम सब्सिडी (35% तक) सुझाने के लिए, कृपया मुझे 3 बुनियादी बातें बताएं:
1. **व्यवसाय या कार्य**: आप किस प्रकार का व्यवसाय शुरू या विस्तार करना चाहते हैं? (जैसे सिलाई की दुकान, डेयरी, किराना/खुदरा, खाद्य स्टॉल, विनिर्माण)
2. **ऋण राशि**: आपको लगभग कितनी वित्तीय सहायता या बैंक ऋण की आवश्यकता है?
3. **श्रेणी और क्षेत्र**: आपकी सामाजिक श्रेणी (SC / ST / OBC / महिला / सामान्य) और क्षेत्र (ग्रामीण गांव या शहर)।`;

          responsePunjabi = `ਤੁਹਾਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਬਸਿਡੀ (35% ਤੱਕ) ਦੱਸਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਹ ਦੱਸੋ:
1. **ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ**: ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? (ਜਿਵੇਂ ਸਿਲਾਈ, ਡੇਅਰੀ, ਕਰਿਆਨਾ, ਫੂਡ ਸਟਾਲ)
2. **ਕਰਜ਼ੇ ਦੀ ਰਕਮ**: ਤੁਹਾਨੂੰ ਕਿੰਨੇ ਕਰਜ਼ੇ ਦੀ ਲੋੜ ਹੈ?
3. **ਸ਼੍ਰੇਣੀ ਅਤੇ ਸਥਾਨ**: ਤੁਹਾਡੀ ਸ਼੍ਰੇਣੀ (SC / ST / OBC / ਮਹਿਲਾ / ਜਨਰਲ) ਅਤੇ ਖੇਤਰ (ਪੇਂਡੂ ਜਾਂ ਸ਼ਹਿਰੀ)।`;

          suggestedPrompts.push(
            'I want to open a tailoring shop, need ₹2 Lakhs, OBC Rural',
            'Need ₹5 Lakhs for dairy farming, SC category',
            'Retail grocery shop loan ₹1 Lakh, Women entrepreneur'
          );
          break;
        }

        responseText = `Here are the top high-impact government schemes matching your profile (${mergedCategory} entrepreneur in a ${mergedLocation} area, requirement ₹${loanAmt.toLocaleString('en-IN')}):
1. **PMEGP**: Up to 35% Capital Grant & loan up to ₹50 Lakhs.
2. **PM Vishwakarma**: ₹15,000 tool grant + 5% subsidized loan for traditional artisans.
3. **Stand-Up India / NSFDC**: ₹10 Lakh to ₹1 Crore credit at concessional rates.`;

        responseHindi = `आपकी प्रोफ़ाइल (${mergedLocation === 'Rural' ? 'ग्रामीण' : 'शहरी'} क्षेत्र में ${mergedCategory} उद्यमी, आवश्यकता ₹${loanAmt.toLocaleString('en-IN')}) के आधार पर सर्वश्रेष्ठ योजनाएं:
1. **पीएमईजीपी (PMEGP)**: 35% तक पूंजीगत अनुदान एवं ₹50 लाख तक ऋण।
2. **पीएम विश्वकर्मा**: ₹15,000 टूलकिट अनुदान + 5% रियायती ऋण।
3. **स्टैंड-अप इंडिया / एनएसएफडीसी**: ₹10 लाख से ₹1 करोड़ तक का रियायती ऋण।`;

        responsePunjabi = `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ (${mergedCategory} ਉੱਦਮੀ, ${mergedLocation === 'Rural' ? 'ਪੇਂਡੂ' : 'ਸ਼ਹਿਰੀ'} ਖੇਤਰ, ਲੋੜ ₹${loanAmt.toLocaleString('en-IN')}) ਦੇ ਆਧਾਰ 'ਤੇ ਵਧੀਆ ਸਕੀਮਾਂ:
1. **PMEGP**: 35% ਤੱਕ ਸਬਸਿਡੀ ਅਤੇ ₹50 ਲੱਖ ਤੱਕ ਕਰਜ਼ਾ।
2. **PM ਵਿਸ਼ਵਕਰਮਾ**: ₹15,000 ਟੂਲਕਿੱਟ ਗ੍ਰਾਂਟ + 5% ਵਿਆਜ 'ਤੇ ਕਰਜ਼ਾ।
3. **ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ / NSFDC**: ₹10 ਲੱਖ ਤੋਂ ₹1 ਕਰੋੜ ਤੱਕ ਕਰਜ਼ਾ।`;

        matchedSchemes.push(
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
        );

        suggestedPrompts.push(
          'Check my eligibility for PMEGP',
          'Calculate my monthly EMI',
          'What documents do I need to apply?'
        );
        break;
      }

      case 'general':
      default: {
        const isGreeting = /^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening|who are you|help|thanks|thank you|shukriya|ਧੰਨਵਾਦ)[\s!.,?]*$/i.test(q) || q.length < 5;

        if (isGreeting) {
          responseText = `Hello! How can I help you today with government schemes, subsidies, or business loans?`;
          responseHindi = `नमस्ते! आज मैं सरकारी योजनाओं, सब्सिडी या व्यावसायिक ऋण में आपकी क्या मदद कर सकता हूँ?`;
          responsePunjabi = `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਅੱਜ ਮੈਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸਬਸਿਡੀਆਂ ਜਾਂ ਵਪਾਰਕ ਕਰਜ਼ਿਆਂ ਵਿੱਚ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`;
        } else {
          responseText = `I can help you explore government schemes, calculate EMIs and subsidies, or check document readiness. What specific trade or loan amount are you exploring?`;
          responseHindi = `मैं सरकारी योजनाओं, सब्सिडी, ईएमआई या आवश्यक दस्तावेज़ों की जांच में सहायता कर सकता हूँ। आप किस कार्य या ऋण राशि के बारे में जानना चाहते हैं?`;
          responsePunjabi = `ਮੈਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸਬਸਿਡੀਆਂ, EMI ਜਾਂ ਜ਼ਰੂਰੀ ਕਾਗਜ਼ਾਤ ਦੀ ਜਾਂਚ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।`;
        }

        suggestedPrompts.push(
          'Find a scheme',
          'Documents needed',
          'Calculate EMI',
          'Where to apply'
        );
        break;
      }
    }

    return {
      id: `saathi-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      hindiText: responseHindi,
      punjabiText: responsePunjabi,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      featureMode: detectedMode,
      matchedSchemes: matchedSchemes.length > 0 ? matchedSchemes : undefined,
      emiCard,
      documentCard,
      partnerCard,
      whatIfCard,
      eligibilityCard,
      suggestedPrompts,
      extractedProfileUpdates: Object.keys(updates).length > 0 ? updates : undefined
    };
  }
}

