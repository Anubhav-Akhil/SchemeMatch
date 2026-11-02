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
      if (q.includes('emi') || q.includes('किस्त') || q.includes('installment') || q.includes('ਕਿਸ਼ਤ') || q.includes('వాయిదా') || q.includes('हप्ता') || q.includes('কিস্তি') || q.includes('moratorium') || ((q.includes('interest') || q.includes('ब्याज')) && !q.includes('scheme') && !q.includes('योजना'))) {
        detectedMode = 'emi';
      } else if (q.includes('document') || q.includes('paper') || q.includes('kagaz') || q.includes('aadhaar') || q.includes('pan') || q.includes('दस्तावेज') || q.includes('ਕਾਗਜ਼ਾਤ') || q.includes('పత్రాలు') || q.includes('कागदपत्रे') || q.includes('নথি') || q.includes('certificate')) {
        detectedMode = 'documents';
      } else if (q.includes('partner') || q.includes('bank') || q.includes('branch') || q.includes('where to apply') || q.includes('sca') || q.includes('psb') || q.includes('कहाँ') || q.includes('ਕਿੱਥੇ') || q.includes('ఎక్కడ') || q.includes('कुठे') || q.includes('কোথায়')) {
        detectedMode = 'partners';
      } else if (q.includes('what if') || q.includes('what-if') || q.includes('change') || q.includes('income') || q.includes('अगर') || q.includes('ਜੇਕਰ') || q.includes('simulate')) {
        detectedMode = 'whatif';
      } else if (q.includes('eligib') || q.includes('qualif') || q.includes('patrata') || q.includes('score') || q.includes('पात्रता') || q.includes('ਯੋਗਤਾ')) {
        detectedMode = 'eligibility';
      } else if (q.includes('scheme') || q.includes('yojana') || q.includes('recommend') || q.includes('योजना') || q.includes('ਸਕੀਮ') || q.includes('పథకం') || q.includes('योजना') || q.includes('স্কিম') || q.includes('best') || q.includes('suggest') || q.includes('find') || hasDetailsInQuery) {
        detectedMode = 'recommendation';
      }
    }

    let responseText = '';
    let responseHindi = '';
    let responsePunjabi = '';
    let responseTelugu = '';
    let responseMarathi = '';
    let responseBengali = '';
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

        if (!isProfileFilled && !hasDetailsInQuery) {
          responseText = `Government-backed enterprise loans (like PMEGP, Mudra, and NSFDC) offer subsidized interest rates (4% to 8.5%) and capital subsidies (25% to 35%) that significantly reduce your effective monthly EMI:
- **Example Calculation**: For a **₹5 Lakh** loan under PMEGP, a **35% Capital Subsidy (₹1.75 Lakhs)** lowers your net loan to **₹3.25 Lakhs**, with an estimated EMI of only **~₹6,600/month** and a 6-month moratorium period.

To calculate your exact EMI, subsidy amount, and interest rate:
Could you please share:
1. Approximately **how much loan or funding** do you need?
2. What is your **planned business or trade**?
3. Your **social category** (SC / ST / OBC / Women / General) and **location** (Rural village or Urban city)?`;

          responseHindi = `सरकारी व्यावसायिक ऋणों (जैसे PMEGP, मुद्रा, NSFDC) में रियायती ब्याज दरें (4% से 8.5%) और पूंजीगत सब्सिडी (25% से 35%) मिलती हैं, जिससे मासिक किस्त (EMI) बहुत कम हो जाती है:
- **उदाहरण गणना**: ₹5 लाख के ऋण पर PMEGP में **35% सब्सिडी (₹1.75 लाख)** मिलने से शुद्ध ऋण घटकर केवल ₹3.25 लाख रह जाता है, जिससे मासिक ईएमआई मात्र **~₹6,600/माह** आती है और 6 माह का मोरेटोरियम भी मिलता है।

अपनी सटीक ईएमआई और सब्सिडी की गणना के लिए, कृपया बताएं:
1. आपको लगभग **कितने ऋण** की आवश्यकता है?
2. आपका **व्यवसाय या कार्य** क्या है?
3. आपकी **सामाजिक श्रेणी** और **क्षेत्र** (ग्रामीण या शहरी)?`;

          responsePunjabi = `ਸਰਕਾਰੀ ਕਰਜ਼ਿਆਂ ਵਿੱਚ 25% ਤੋਂ 35% ਸਬਸਿਡੀ ਮਿਲਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI) ਬਹੁਤ ਘੱਟ ਜਾਂਦੀ ਹੈ:
- **ਉਦਾਹਰਣ**: ₹5 ਲੱਖ ਦੇ ਕਰਜ਼ੇ 'ਤੇ 35% ਸਬਸਿਡੀ (₹1.75 ਲੱਖ) ਮਿਲਣ ਨਾਲ ਕਰਜ਼ਾ ਘਟ ਕੇ ₹3.25 ਲੱਖ ਰਹਿ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕਿਸ਼ਤ ਸਿਰਫ਼ ~₹6,600/ਮਹੀਨਾ ਬਣਦੀ ਹੈ।

ਸਹੀ EMI ਜਾਣਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਕਰਜ਼ੇ ਦੀ ਰਕਮ, ਕੰਮ ਅਤੇ ਸ਼੍ਰੇਣੀ ਦੱਸੋ।`;
          responseTelugu = `ప్రభుత్వ రుణాలలో 25% నుండి 35% వరకు మూలధన సబ్సిడీ మరియు రాయితీ వడ్డీ లభిస్తుంది:
- **ఉదాహరణ**: PMEGP కింద ₹5 లక్షల రుణానికి 35% సబ్సిడీ (₹1.75 లక్షలు) లభిస్తుంది, దీనివల్ల నికర రుణం ₹3.25 లక్షలకు తగ్గి నెలవారీ EMI కేవలం ~₹6,600 అవుతుంది.

ఖచ్చితమైన EMI లెక్కించడానికి రుణ మొత్తం, వ్యాపారం మరియు సామాజిక వర్గం తెలపండి.`;
          responseMarathi = `सरकारी कर्जांमध्ये २५% ते ३५% भांडवली अनुदान आणि सवलतीचे व्याजदर मिळतात:
- **उदाहरण**: PMEGP अंतर्गत ₹५ लाखांच्या कर्जावर ३५% अनुदान (₹१.७५ लाख) मिळाल्याने निव्वळ कर्ज ₹३.२५ लाख राहते व मासिक हप्ता (EMI) फक्त ~₹६,६००/महिना येतो.

अचूक EMI आणि अनुदानासाठी कृपया कर्जाची रक्कम, काम आणि प्रवर्ग सांगा.`;
          responseBengali = `সরকারি ব্যবসায়িক ঋণে ২৫% থেকে ৩৫% মূলধনী ভর্তুকি পাওয়া যায়, যার ফলে মাসিক কিস্তি (EMI) অনেকটাই কমে যায়:
- **উদাহরণ**: PMEGP-এর অধীনে ₹৫ লক্ষ ঋণে ৩৫% ভর্তুকি (₹১.৭৫ লক্ষ) বাদ দিলে নিট ঋণ হয় ₹৩.২৫ লক্ষ এবং মাসিক EMI মাত্র ~₹৬,৬০০/মাস।

সঠিক EMI গণনার জন্য আনুমানিক ঋণের পরিমাণ, কাজের ধরন ও শ্রেণি জানান।`;

          suggestedPrompts.push(
            'Need ₹2 Lakhs loan for tailoring shop, OBC Rural',
            'Need ₹5 Lakhs for dairy farming, SC category',
            'Calculate EMI for ₹10 Lakhs manufacturing unit'
          );
        } else {
          responseText = `Here is your loan and EMI breakdown for a loan of ₹${loanAmt.toLocaleString('en-IN')}. Under PMEGP (${mergedCategory}, ${mergedLocation}), you qualify for a **${subsidyRate * 100}% Capital Subsidy (₹${subsidyAmount.toLocaleString('en-IN')})**. With a concessional rate of ${rate}% over 5 years (60 months) and a 6-month moratorium on principal repayment, your estimated net monthly EMI is **₹${monthlyEmi.toLocaleString('en-IN')}/month**.`;
          responseHindi = `₹${loanAmt.toLocaleString('en-IN')} के ऋण के लिए आपकी ईएमआई का विवरण: PMEGP (${mergedCategory}, ${mergedLocation === 'Rural' ? 'ग्रामीण' : 'शहरी'}) के तहत आपको **${subsidyRate * 100}% सरकारी सब्सिडी (₹${subsidyAmount.toLocaleString('en-IN')})** मिलेगी। 5 वर्ष (60 माह) के लिए ${rate}% वार्षिक ब्याज दर और 6 माह के अधिस्थगन (मोरेटोरियम) के साथ आपकी अनुमानित शुद्ध मासिक ईएमआई मात्र **₹${monthlyEmi.toLocaleString('en-IN')}/माह** होगी।`;
          responsePunjabi = `₹${loanAmt.toLocaleString('en-IN')} ਦੇ ਕਰਜ਼ੇ ਲਈ ਤੁਹਾਡੀ ਈਐਮਆਈ ਦੀ ਜਾਣਕਾਰੀ: PMEGP (${mergedCategory}, ${mergedLocation === 'Rural' ? 'ਪੇਂਡੂ' : 'ਸ਼ਹਿਰੀ'}) ਦੇ ਤਹਿਤ ਤੁਹਾਨੂੰ **${subsidyRate * 100}% ਸਬਸਿਡੀ (₹${subsidyAmount.toLocaleString('en-IN')})** ਮਿਲ ਸਕਦੀ ਹੈ। 5 ਸਾਲ ਲਈ ਮਾਸਿਕ ਕਿਸ਼ਤ ਲਗਭਗ **₹${monthlyEmi.toLocaleString('en-IN')}/ਮਹੀਨਾ** ਹੋਵੇਗੀ।`;
          responseTelugu = `₹${loanAmt.toLocaleString('en-IN')} రుణానికి మీ EMI వివరాలు: PMEGP కింద మీకు ${subsidyRate * 100}% సబ్సిడీ (₹${subsidyAmount.toLocaleString('en-IN')}) లభిస్తుంది. 5 సంవత్సరాల కాలపరిమితిలో మీ నికర నెలవారీ EMI సుమారుగా ₹${monthlyEmi.toLocaleString('en-IN')}/నెల.`;
          responseMarathi = `₹${loanAmt.toLocaleString('en-IN')} कर्जासाठी तुमचे EMI तपशील: PMEGP अंतर्गत तुम्हाला ${subsidyRate * 100}% अनुदान (₹${subsidyAmount.toLocaleString('en-IN')}) मिळेल. ५ वर्षांच्या मुदतीत तुमचा अंदाजे मासिक हप्ता ₹${monthlyEmi.toLocaleString('en-IN')}/महिना असेल.`;
          responseBengali = `₹${loanAmt.toLocaleString('en-IN')} ঋণের জন্য আপনার EMI বিবরণ: PMEGP-এর অধীনে আপনি ${subsidyRate * 100}% ভর্তুকি (₹${subsidyAmount.toLocaleString('en-IN')}) পাবেন। ৫ বছরের মেয়াদে আনুমানিক মাসিক EMI প্রায় ₹${monthlyEmi.toLocaleString('en-IN')}/মাস।`;

          suggestedPrompts.push(
            'What if I increase loan tenure to 7 years?',
            'What documents are needed for bank EMI approval?',
            'Find nearest PSB branch to apply for this loan'
          );
        }

        emiCard = {
          schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
          loanAmount: loanAmt,
          subsidyAmount,
          interestRate: rate,
          tenureMonths,
          monthlyEmi,
          moratoriumMonths: 6
        };
        break;
      }

      case 'documents': {
        if (!isProfileFilled && !hasDetailsInQuery) {
          responseText = `Here is an overview of the core documents required to apply for Indian government business loans and capital subsidies:
1. **Identity & Address Proof**: Aadhaar Card (linked to active mobile number) & PAN Card.
2. **Business Proof**: Udyam MSME Registration (100% free online registration at udyamregistration.gov.in in 10 minutes).
3. **Financial Statement**: Bank Account Statement for the last 6 months.
4. **Category Certificate**: Digitized Caste / Category Certificate (for SC/ST/OBC applicants to unlock up to 35% subsidies).
5. **Project Outline**: Detailed Project Report (DPR / Viability Summary).

To generate your exact tailored document checklist:
Could you please tell me:
1. What is your planned **business or trade**?
2. Which **social category** (SC / ST / OBC / Women / General) do you belong to?`;

          responseHindi = `सरकारी व्यावसायिक ऋण और सब्सिडी के लिए आवश्यक मुख्य दस्तावेज़ों का विवरण:
1. **पहचान व पता प्रमाण**: आधार कार्ड (मोबाइल से लिंक) और पैन कार्ड।
2. **व्यवसाय प्रमाण**: उद्यम एमएसएमई पंजीकरण (udyamregistration.gov.in पर 10 मिनट में 100% निःशुल्क)।
3. **वित्तीय विवरण**: पिछले 6 माह का बैंक खाता विवरण (स्टेटमेंट)।
4. **जाति प्रमाण पत्र**: डिजिटल जाति/श्रेणी प्रमाण पत्र (SC/ST/OBC हेतु 35% तक सब्सिडी के लिए)।
5. **प्रोजेक्ट रिपोर्ट**: विस्तृत व्यवसाय योजना (DPR)।

अपनी व्यक्तिगत दस्तावेज़ चेकलिस्ट प्राप्त करने के लिए, कृपया बताएं:
1. आपका **कार्य या व्यवसाय** क्या है?
2. आपकी **सामाजिक श्रेणी** क्या है?`;

          responsePunjabi = `ਸਰਕਾਰੀ ਕਾਰੋਬਾਰੀ ਕਰਜ਼ਿਆਂ ਲਈ ਲੋੜੀਂਦੇ ਮੁੱਖ ਕਾਗਜ਼ਾਤ:
1. **ਪਛਾਣ ਪੱਤਰ**: ਆਧਾਰ ਕਾਰਡ (ਮੋਬਾਈਲ ਨਾਲ ਲਿੰਕ) ਅਤੇ ਪੈਨ ਕਾਰਡ।
2. **ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ**: udyamregistration.gov.in 'ਤੇ 10 ਮਿੰਟ ਵਿੱਚ ਮੁਫ਼ਤ।
3. **ਬੈਂਕ ਸਟੇਟਮੈਂਟ**: ਪਿਛਲੇ 6 ਮਹੀਨਿਆਂ ਦੀ।
4. **ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ**: SC/ST/OBC ਲਈ ਸਬਸਿਡੀ ਵਾਸਤੇ।

ਆਪਣੀ ਸਹੀ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕੰਮ ਅਤੇ ਸ਼੍ਰੇਣੀ ਦੱਸੋ।`;
          responseTelugu = `ప్రభుత్వ వ్యాపార రుణాల కోసం అవసరమైన ముఖ్య పత్రాలు:
1. ఆధార్ కార్డు (మొబైల్ లింక్ చేయబడినది) మరియు పాన్ కార్డు.
2. ఉద్యమ్ ఎంఎస్ఎంఈ రిజిస్ట్రేషన్ (udyamregistration.gov.in లో 10 నిమిషాల్లో ఉచితం).
3. గత 6 నెలల బ్యాంక్ ఖాతా స్టేట్‌మెంట్.
4. డిజిటల్ కుల ధృవీకరణ పత్రం (SC/ST/OBC కోసం 35% సబ్సిడీ కోసం).
ఖచ్చితమైన జాబితా కోసం మీ వ్యాపారం మరియు వర్గాన్ని తెలపండి.`;
          responseMarathi = `सरकारी व्यावसायिक कर्जासाठी आवश्यक मुख्य कागदपत्रे:
१. आधार कार्ड (मोबाईल लिंक असलेले) आणि पॅन कार्ड.
२. उद्यम नोंदणी (udyamregistration.gov.in वर १० मिनिटांत मोफत).
३. मागील ६ महिन्यांचे बँक स्टेटमेंट.
४. डिजिटल जात प्रमाणपत्र (SC/ST/OBC सवलतीसाठी).
तपशीलवार यादीसाठी कृपया तुमचे काम आणि प्रवर्ग सांगा.`;
          responseBengali = `সরকারি ব্যবসায়িক ঋণের জন্য প্রয়োজনীয় প্রধান নথিপত্র:
১. আধার কার্ড (মোবাইল লিঙ্ক করা) এবং প্যান কার্ড।
২. উদ্যম এমএসএমই রেজিস্ট্রেশন (udyamregistration.gov.in এ ১০ মিনিটে বিনামূল্যে)।
৩. বিগত ৬ মাসের ব্যাঙ্ক অ্যাকাউন্ট স্টেটমেন্ট।
৪. ডিজিটাল জাতিগত শংসাপত্র (SC/ST/OBC ভর্তুকির জন্য)।
নির্দিষ্ট তালিকার জন্য আপনার কাজ এবং শ্রেণি জানান।`;

          suggestedPrompts.push(
            'Tailoring business, OBC category',
            'Dairy farming, SC category',
            'Retail kirana store, General category'
          );
        } else {
          responseText = `Here is your personalized document checklist for applying under Ministry of Social Justice & PMEGP schemes (${mergedCategory} category). Ensuring these documents are active and digitized increases your sanction speed by over 3x!`;
          responseHindi = `सामाजिक न्याय मंत्रालय और PMEGP योजनाओं (${mergedCategory} श्रेणी) में आवेदन हेतु आपकी व्यक्तिगत दस्तावेज़ चेकलिस्ट तैयार है। इन दस्तावेजों को डिजिटल रूप में रखने से ऋण स्वीकृति 3 गुना तेज़ी से होती है!`;
          responsePunjabi = `ਸਮਾਜਿਕ ਨਿਆਂ ਮੰਤਰਾਲੇ ਅਤੇ PMEGP ਸਕੀਮਾਂ (${mergedCategory} ਸ਼੍ਰੇਣੀ) ਲਈ ਤੁਹਾਡੀ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਇੱਥੇ ਹੈ।`;

          suggestedPrompts.push(
            'How do I register for Udyam in 10 minutes?',
            'Calculate my monthly EMI',
            'Find nearest authorized channel partner'
          );
        }

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
        break;
      }

      case 'partners': {
        const userState = currentProfile?.state || updates.state;
        const userDistrict = currentProfile?.district;
        const userTrade = updates.tradeType || currentProfile?.tradeType || updates.sector || currentProfile?.sector;

        if (!isProfileFilled && !hasDetailsInQuery) {
          responseText = `Government schemes and subsidies are primarily routed through 3 authorized channels:
1. **Public Sector Commercial Banks (PSBs)** (e.g., SBI, PNB, Bank of Baroda): Accept direct applications for **Mudra Loans (up to ₹10 Lakhs)** and **Stand-Up India (up to ₹1 Crore)**.
2. **District Industries Centre (DIC) & KVIC**: Nodal processing agency for **PMEGP (with up to 35% capital subsidy)** and **PM Vishwakarma**. You can also apply online 24/7 on the official **JanSamarth Portal (jansamarth.in)** and **PMEGP e-Portal**.
3. **State Channelizing Agencies (SCAs)**: Located at District Vikas Bhawan / Collectorate, providing subsidized credit (4%–6% concessional interest) from central corporations (NSFDC, NBCFDC, NSKFDC) for SC, ST, OBC, Safai Karamchari & Minority entrepreneurs.

To pinpoint your exact nearest branch, district nodal officer, and specific scheme portal:
Could you please share:
1. **Your State & District / City**: (e.g., Lucknow, UP or Ludhiana, Punjab)
2. **Your Business or Trade**: (e.g., tailoring, dairy farming, grocery shop, food stall, manufacturing)
3. **Your Social Category**: (SC / ST / OBC / Minority / General / Women entrepreneur)?`;

          responseHindi = `सरकारी योजनाओं और सब्सिडी के लिए आवेदन मुख्य रूप से 3 अधिकृत माध्यमों से किए जाते हैं:
1. **सरकारी वाणिज्यिक बैंक (PSBs)** (जैसे SBI, PNB, बैंक ऑफ बड़ौदा): **मुद्रा ऋण (₹10 लाख तक)** और **स्टैंड-अप इंडिया (₹1 करोड़ तक)** के लिए।
2. **जिला उद्योग केंद्र (DIC) व खादी बोर्ड (KVIC)**: **PMEGP (35% तक सरकारी सब्सिडी)** और **पीएम विश्वकर्मा** के लिए नोडल केंद्र। आप आधिकारिक **जनसमर्थ पोर्टल (jansamarth.in)** पर भी 24x7 ऑनलाइन आवेदन कर सकते हैं।
3. **राज्य चैनलाइजिंग एजेंसियां (SCAs)**: विकास भवन/कलेक्ट्रेट में स्थित, जो SC, ST, OBC, सफाई कर्मचारियों व अल्पसंख्यकों के लिए 4%-6% रियायती ब्याज दर पर ऋण देती हैं।

आपके व्यवसाय के लिए सबसे नज़दीकी बैंक शाखा, नोडल अधिकारी व आवेदन पोर्टल बताने के लिए, कृपया 3 बातें बताएं:
1. **आपका राज्य और जिला/शहर**
2. **आपका कार्य या व्यवसाय** (जैसे सिलाई, किराना, डेयरी, फ़ूड स्टॉल)
3. **आपकी सामाजिक श्रेणी** (SC / ST / OBC / अल्पसंख्यक / सामान्य / महिला उद्यमी)?`;

          responsePunjabi = `ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਲਈ ਅਰਜ਼ੀਆਂ ਮੁੱਖ ਤੌਰ 'ਤੇ 3 ਅਧਿਕਾਰਤ ਤਰੀਕਿਆਂ ਰਾਹੀਂ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ:
1. **ਸਰਕਾਰੀ ਵਪਾਰਕ ਬੈਂਕ (PSBs)** (ਜਿਵੇਂ SBI, PNB): **ਮੁਦਰਾ ਕਰਜ਼ੇ (₹10 ਲੱਖ ਤੱਕ)** ਅਤੇ **ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ (₹1 ਕਰੋੜ ਤੱਕ)** ਲਈ।
2. **ਜ਼ਿਲ੍ਹਾ ਉਦਯੋਗ ਕੇਂਦਰ (DIC) ਤੇ KVIC**: **PMEGP (35% ਤੱਕ ਸਬਸਿਡੀ)** ਅਤੇ **PM ਵਿਸ਼ਵਕਰਮਾ** ਲਈ ਨੋਡਲ ਦਫ਼ਤਰ। ਤੁਸੀਂ **JanSamarth ਪੋਰਟਲ (jansamarth.in)** 'ਤੇ ਵੀ ਆਨਲਾਈਨ ਅਪਲਾਈ ਕਰ ਸਕਦੇ ਹੋ।
3. **ਸਟੇਟ ਚੈਨਲਾਈਜ਼ਿੰਗ ਏਜੰਸੀਆਂ (SCAs)**: ਜ਼ਿਲ੍ਹਾ ਵਿਕਾਸ ਭਵਨ ਵਿਖੇ ਸਥਿਤ, ਜੋ SC/ST/OBC ਲਈ 4%-6% ਸਸਤੇ ਵਿਆਜ 'ਤੇ ਕਰਜ਼ਾ ਦਿੰਦੀਆਂ ਹਨ।

ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਲਈ ਸਹੀ ਨਜ਼ਦੀਕੀ ਬੈਂਕ ਅਤੇ ਅਧਿਕਾਰੀ ਲੱਭਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ:
1. **ਤੁਹਾਡਾ ਰਾਜ ਅਤੇ ਜ਼ਿਲ੍ਹਾ**
2. **ਤੁਹਾਡਾ ਕੰਮ ਜਾਂ ਕਾਰੋਬਾਰ**
3. **ਤੁਹਾਡੀ ਸ਼੍ਰੇਣੀ** (SC / ST / OBC / ਮਹਿਲਾ / ਜਨਰਲ)?`;
          responseTelugu = `ప్రభుత్వ పథకాలు మరియు రాయితీల కోసం దరఖాస్తు చేసుకోవడానికి 3 ప్రధాన అధికారిక మార్గాలు ఉన్నాయి:
1. ప్రభుత్వ వాణిజ్య బ్యాంకులు (PSBs - SBI, PNB): ముద్ర లోన్లు మరియు స్టాండ్-అప్ ఇండియా కోసం.
2. జిల్లా పరిశ్రమల కేంద్రం (DIC) & KVIC: PMEGP మరియు PM విశ్వకర్మ కోసం. ఆన్‌లైన్‌లో jansamarth.in లో కూడా దరఖాస్తు చేసుకోవచ్చు.
3. రాష్ట్ర ఛానలైజింగ్ ఏజెన్సీలు (SCAs): కలెక్టరేట్ లేదా వికాస్ భవన్‌లో SC/ST/OBC కోసం తక్కువ వడ్డీతో రుణాలు.
మీ సమీప శాఖను గుర్తించడానికి రాష్ట్రం, వ్యాపారం మరియు వర్గాన్ని తెలపండి.`;
          responseMarathi = `सरकारी योजना आणि अनुदानासाठी अर्ज करण्याचे ३ प्रमुख अधिकृत मार्ग:
१. सरकारी बँका (PSBs - SBI, PNB): मुद्रा कर्ज (₹१० लाखांपर्यंत) आणि स्टँड-अप इंडियासाठी.
२. जिल्हा उद्योग केंद्र (DIC) व KVIC: PMEGP (३५% पर्यंत अनुदान) आणि पीएम विश्वकर्मासाठी. jansamarth.in वरही ऑनलाइन अर्ज करता येतो.
३. राज्य चॅनेलायझिंग एजन्सी (SCAs): विकास भवनातील कार्यालय, जे सवलतीच्या व्याजदराने कर्ज उपलब्ध करून देते.
जवळची बँक शाखा शोधण्यासाठी कृपया राज्य/जिल्हा, काम आणि प्रवर्ग सांगा.`;
          responseBengali = `সরকারি স্কিম এবং ভর্তুকির জন্য আবেদনের ৩টি প্রধান অনুমোদিত মাধ্যম:
১. সরকারি বাণিজ্যিক ব্যাংক (PSBs - SBI, PNB): মুদ্রা ঋণ এবং স্ট্যান্ড-আপ ইন্ডিয়ার জন্য।
২. জেলা শিল্প কেন্দ্র (DIC) ও KVIC: PMEGP (৩৫% পর্যন্ত ভর্তুকি) এবং পিএম বিশ্বকর্মার জন্য। অনলাইনে jansamarth.in পোর্টালেও আবেদন করা যায়।
৩. স্টেট চ্যানেলাইজিং এজেন্সি (SCAs): বিকাশ ভবনে অবস্থিত অফিস যা স্বল্প সুদে ঋণ প্রদান করে।
নিকটতম কেন্দ্র খুঁজে পেতে অনুগ্রহ করে রাজ্য, জেলা, কাজের ধরন এবং শ্রেণি জানান।`;

          suggestedPrompts.push(
            'Ludhiana, Punjab, tailoring business, OBC category',
            'Pune, Maharashtra, dairy farm, SC category',
            'Lucknow, UP, grocery retail shop, Women entrepreneur'
          );
        } else {
          const locDesc = userDistrict ? `${userDistrict}${userState ? ', ' + userState : ''}` : `${mergedLocation} region`;
          responseText = `Based on your profile as an **${mergedCategory}** entrepreneur in **${locDesc}**${userTrade ? ` for **${userTrade}**` : ''}:
Here are your primary authorized application avenues ready to process your scheme application:
1. **State Channelizing Agency (SCA) District Office**: Visit the Vikas Bhawan / Collectorate office for direct ${mergedCategory} special concessional credit and MoSJE margin money subsidies.
2. **Lead Public Sector Bank (SBI / PNB)**: Contact the MSME credit desk for direct Mudra, Stand-Up India, or PMEGP loan sanctioning.
3. **District Industries Centre (DIC)**: For PMEGP subsidy task force approvals and PM Vishwakarma craft certification.
4. **Online Portal**: You can also apply directly 24/7 at **jansamarth.in** or **kviconline.gov.in** under the ${mergedCategory} category.`;

          responseHindi = `आपकी प्रोफ़ाइल (${locDesc} में ${mergedCategory} उद्यमी${userTrade ? `, कार्य: ${userTrade}` : ''}) के आधार पर अधिकृत आवेदन केंद्र:
1. **राज्य चैनलाइजिंग एजेंसी (SCA)**: विकास भवन/कलेक्ट्रेट परिसर स्थित SCA कार्यालय ${mergedCategory} विशेष रियायती ऋण व सब्सिडी के लिए।
2. **नज़दीकी सरकारी बैंक (SBI / PNB)**: मुद्रा, PMEGP और स्टैंड-अप इंडिया ऋण स्वीकृति हेतु।
3. **जिला उद्योग केंद्र (DIC)**: PMEGP टास्क फ़ोर्स सब्सिडी अनुमोदन और पीएम विश्वकर्मा सत्यापन के लिए।
4. **ऑनलाइन पोर्टल**: आप **jansamarth.in** या **kviconline.gov.in** पर भी सीधे आवेदन कर सकते हैं।`;

          responsePunjabi = `ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ (${locDesc} ਵਿੱਚ ${mergedCategory} ਉੱਦਮੀ) ਦੇ ਆਧਾਰ 'ਤੇ ਅਧਿਕਾਰਤ ਅਰਜ਼ੀ ਕੇਂਦਰ:
1. **ਸਟੇਟ ਚੈਨਲਾਈਜ਼ਿੰਗ ਏਜੰਸੀ (SCA)**: ਵਿਕਾਸ ਭਵਨ ਸਥਿਤ SCA ਦਫ਼ਤਰ।
2. **ਸਰਕਾਰੀ ਬੈਂਕ (SBI / PNB)**: ਮੁਦਰਾ ਅਤੇ PMEGP ਕਰਜ਼ੇ ਲਈ।
3. **ਜ਼ਿਲ੍ਹਾ ਉਦਯੋਗ ਕੇਂਦਰ (DIC)**: ਸਬਸਿਡੀ ਮਨਜ਼ੂਰੀ ਲਈ।
4. **ਆਨਲਾਈਨ ਪੋਰਟਲ**: **jansamarth.in** 'ਤੇ ਸਿੱਧਾ ਅਪਲਾਈ ਕਰੋ।`;

          suggestedPrompts.push(
            'What documents should I carry to the SCA office?',
            'Check eligibility for Stand-Up India',
            'Simulate what-if I apply through a rural branch'
          );
        }

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
          responseTelugu = `మీకు ఉత్తమమైన ప్రభుత్వ పథకాలు మరియు గరిష్ట సబ్సిడీ (35% వరకు) సూచించడానికి, దయచేసి నాకు 3 వివరాలు తెలపండి:
1. **వ్యాపారం లేదా వృత్తి**: మీరు ఏ రకమైన వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నారు? (ఉదా. టైలరింగ్, డెయిరీ, కిరాణా దుకాణం, తయారీ)
2. **రుణ మొత్తం**: మీకు సుమారుగా ఎంత రుణ సహాయం అవసరం?
3. **సామాజిక వర్గం & ప్రాంతం**: మీ వర్గం (SC / ST / OBC / మహిళ / సాధారణం) మరియు ప్రాంతం (గ్రామీణ లేదా పట్టణ).`;
          responseMarathi = `तुम्हाला सर्वोत्तम सरकारी योजना आणि कमाल अनुदान (३५% पर्यंत) सुचवण्यासाठी, कृपया मला ३ प्राथमिक गोष्टी सांगा:
१. **व्यवसाय किंवा काम**: तुम्ही कोणता व्यवसाय सुरू किंवा विस्तार करू इच्छिता? (उदा. टेलरिंग, डेअरी, किराणा, उत्पादन)
२. **कर्ज रक्कम**: तुम्हाला अंदाजे किती बँक कर्जाची आवश्यकता आहे?
३. **सामाजिक प्रवर्ग व परिसर**: तुमचा प्रवर्ग (SC / ST / OBC / महिला / खुला) आणि परिसर (ग्रामीण किंवा शहरी).`;
          responseBengali = `আপনার জন্য সেরা সরকারি স্কিম এবং সর্বাধিক ভর্তুকি (৩৫% পর্যন্ত) সুপারিশ করতে, অনুগ্রহ করে ৩টি তথ্য জানান:
১. **ব্যবসা বা কাজ**: আপনি কী ধরনের ব্যবসা শুরু করতে চান? (যেমন দর্জি, ডেইরি, মুদি দোকান, উৎপাদন)
২. **ঋণের পরিমাণ**: আনুমানিক কত ঋণ প্রয়োজন?
৩. **শ্রেণি ও এলাকা**: আপনার সামাজিক শ্রেণি (SC / ST / OBC / মহিলা / সাধারণ) এবং এলাকা (গ্রামীণ বা শহুরে)।`;

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
      teluguText: responseTelugu,
      marathiText: responseMarathi,
      bengaliText: responseBengali,
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

