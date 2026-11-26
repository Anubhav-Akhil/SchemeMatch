import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  MapPin, 
  Briefcase,
  HelpCircle,
  Zap
} from 'lucide-react';
import { SectorType, SocialCategory, LocationType } from '../types';

const WHATIF_LABELS: Record<Language, Record<string, string>> = {
  en: {
    badge: 'Real-Time Parameter Sensitivity',
    title: 'What-If Scheme Simulator',
    subtitle: 'Tweak financial requirements, sector classifications, location types, and registration parameters in real-time to observe dynamic changes in capital subsidy, match probability, and monthly repayment liability.',
    applyBtn: 'Apply to Active Profile',
    appliedNotice: 'Profile Synchronized!',
    instantPresets: 'Instant Presets:',
    presetMaxSubsidy: '🎯 Max 35% Rural Subsidy',
    presetScaleMfg: '🏭 Scale-Up Mfg (₹25L)',
    presetMicroCredit: '⚡ Micro-Loan (< ₹1L)',
    presetReset: 'Reset to My Profile',
    simParams: 'Simulation Parameters',
    totalProjectCost: 'Total Project Cost',
    microHint: '₹50,000 (Micro)',
    msmeHint: '₹25,00,000 (MSME)',
    maxPmegpHint: '₹50,00,000 (Max PMEGP)',
    bankLoanRequested: 'Bank Loan Requested',
    loanPortion: 'Loan portion:',
    promoterMargin: 'Promoter Margin Money (Own Investment)',
    marginScStHint: '₹5,000 (Min 5% for SC/ST)',
    marginGenHint: 'Min 10% for General',
    marginMaxHint: '40% Max Self-Finance',
    businessSector: 'Business Sector',
    artisanCraft: 'Artisan & Craft',
    manufacturing: 'Manufacturing',
    services: 'Services',
    retailTrading: 'Retail / Trading',
    textilesWeaving: 'Textiles & Weaving',
    agroAllied: 'Agro-Allied',
    socialCategory: 'Social Category',
    catSC: 'SC (Scheduled Caste)',
    catST: 'ST (Scheduled Tribe)',
    catOBC: 'OBC',
    catGeneral: 'General',
    catMinority: 'Minority',
    locationType: 'Location Type',
    locRural: 'Rural (35% Subsidy)',
    locUrban: 'Urban (25% Subsidy)',
    locSemiUrban: 'Semi-Urban',
    simRegDocs: 'Simulate Registration / Document Status:',
    hasUdyam: 'Has Udyam',
    casteCert: 'Caste Certificate',
    bankableDpr: 'Bankable DPR',
    simOutcome: 'Simulated Financial Outcome',
    liveCalculated: 'Live Calculated',
    govtSubsidy: 'Govt. Capital Subsidy',
    estMonthlyEmi: 'Est. Monthly EMI',
    rateSuffix: 'rate',
    tenureNote: 'p.a. • 5 yr tenure',
    higherSubsidyNotice: 'higher subsidy compared to your baseline profile!',
    lowerSubsidyNotice: 'lower subsidy due to changed parameters.',
    schemeFeasibility: 'Scheme Eligibility Under Current Simulation:',
    pmegpTitle: 'PMEGP Credit Subsidy',
    pmegpCostOk: '✅ Cost within ceiling',
    pmegpCostExceed: '❌ Exceeds 50L limit',
    fitScoreHigh: '95% Fit',
    fitScoreMed: '78% Fit',
    standupTitle: 'Stand-Up India (₹10L - ₹1Cr)',
    standupEligible: '✅ Eligible for Greenfield',
    standupReq: 'Requires min ₹10L loan & SC/ST/Women',
    badgeEligible: 'Eligible',
    badgeConditional: 'Conditional',
    mudraTitle: 'Mudra (Tarun) / NSFDC Term Loan',
    mudraDesc: 'Up to ₹10 Lakhs with 4-6% concessional rate',
    badgeHighPriority: 'High Priority',
    badgeBridgeOption: 'Bridge Option'
  },
  hi: {
    badge: 'रियल-टाइम पैरामीटर संवेदनशीलता',
    title: 'व्हाट-इफ़ योजना सिम्युलेटर',
    subtitle: 'पूंजी सब्सिडी, पात्रता संभावना और मासिक ईएमआई में गतिशील बदलाव देखने के लिए वास्तविक समय में वित्तीय आवश्यकताओं, क्षेत्र, स्थान और दस्तावेज़ की स्थिति को समायोजित करें।',
    applyBtn: 'सक्रिय प्रोफ़ाइल पर लागू करें',
    appliedNotice: 'प्रोफ़ाइल सिंक हो गई!',
    instantPresets: 'त्वरित प्रीसेट:',
    presetMaxSubsidy: '🎯 अधिकतम 35% ग्रामीण सब्सिडी',
    presetScaleMfg: '🏭 विनिर्माण विस्तार (₹25 लाख)',
    presetMicroCredit: '⚡ सूक्ष्म ऋण (< ₹1 लाख)',
    presetReset: 'मेरी प्रोफ़ाइल पर रीसेट करें',
    simParams: 'सिम्युलेशन पैरामीटर',
    totalProjectCost: 'कुल परियोजना लागत',
    microHint: '₹50,000 (सूक्ष्म)',
    msmeHint: '₹25,00,000 (एमएसएमई)',
    maxPmegpHint: '₹50,00,000 (अधिकतम PMEGP)',
    bankLoanRequested: 'बैंक ऋण राशि',
    loanPortion: 'ऋण हिस्सा:',
    promoterMargin: 'प्रमोटर मार्जिन मनी (स्वयं का निवेश)',
    marginScStHint: '₹5,000 (SC/ST के लिए न्यूनतम 5%)',
    marginGenHint: 'सामान्य वर्ग हेतु न्यूनतम 10%',
    marginMaxHint: 'अधिकतम 40% स्वयं-वित्त',
    businessSector: 'व्यवसाय क्षेत्र',
    artisanCraft: 'कारीगर और हस्तशिल्प',
    manufacturing: 'विनिर्माण',
    services: 'सेवाएं',
    retailTrading: 'खुदरा / व्यापार',
    textilesWeaving: 'वस्त्र और बुनाई',
    agroAllied: 'कृषि संबद्ध',
    socialCategory: 'सामाजिक श्रेणी',
    catSC: 'एससी (अनुसूचित जाति)',
    catST: 'एसटी (अनुसूचित जनजाति)',
    catOBC: 'ओबीसी',
    catGeneral: 'सामान्य',
    catMinority: 'अल्पसंख्यक',
    locationType: 'स्थान का प्रकार',
    locRural: 'ग्रामीण (35% सब्सिडी)',
    locUrban: 'शहरी (25% सब्सिडी)',
    locSemiUrban: 'अर्ध-शहरी',
    simRegDocs: 'पंजीकरण / दस्तावेज़ स्थिति का अनुकरण करें:',
    hasUdyam: 'उद्यम उपलब्ध',
    casteCert: 'जाति प्रमाण पत्र',
    bankableDpr: 'बैंक योग्य डीपीआर',
    simOutcome: 'अनुकरणित वित्तीय परिणाम',
    liveCalculated: 'लाइव गणना',
    govtSubsidy: 'सरकारी पूंजी सब्सिडी',
    estMonthlyEmi: 'अनुमानित मासिक ईएमआई',
    rateSuffix: 'दर',
    tenureNote: 'वार्षिक • 5 वर्ष अवधि',
    higherSubsidyNotice: 'आपकी मूल प्रोफ़ाइल की तुलना में अधिक सब्सिडी!',
    lowerSubsidyNotice: 'बदले गए मापदंडों के कारण कम सब्सिडी।',
    schemeFeasibility: 'वर्तमान सिम्युलेशन के तहत योजना पात्रता:',
    pmegpTitle: 'PMEGP क्रेडिट सब्सिडी',
    pmegpCostOk: '✅ लागत सीमा के भीतर',
    pmegpCostExceed: '❌ 50 लाख की सीमा से अधिक',
    fitScoreHigh: '95% उपयुक्त',
    fitScoreMed: '78% उपयुक्त',
    standupTitle: 'स्टैंड-अप इंडिया (₹10L - ₹1Cr)',
    standupEligible: '✅ ग्रीनफ़ील्ड हेतु पात्र',
    standupReq: 'न्यूनतम ₹10 लाख ऋण और SC/ST/महिला होना आवश्यक',
    badgeEligible: 'पात्र',
    badgeConditional: 'सशर्त',
    mudraTitle: 'मुद्रा (तरुण) / NSFDC मियादी ऋण',
    mudraDesc: '4-6% रियायती दर पर ₹10 लाख तक',
    badgeHighPriority: 'उच्च प्राथमिकता',
    badgeBridgeOption: 'वैकल्पिक विकल्प'
  },
  pa: {
    badge: 'ਰੀਅਲ-ਟਾਈਮ ਪੈਰਾਮੀਟਰ ਸੰਵੇਦਨਸ਼ੀਲਤਾ',
    title: 'ਵ੍ਹਟ-ਇਫ਼ ਸਕੀਮ ਸਿਮੂਲੇਟਰ',
    subtitle: 'ਕੈਪੀਟਲ ਸਬਸਿਡੀ, ਯੋਗਤਾ ਸੰਭਾਵਨਾ ਅਤੇ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ (EMI) ਵਿੱਚ ਤਬਦੀਲੀਆਂ ਵੇਖਣ ਲਈ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਵਿੱਤੀ ਲੋੜਾਂ, ਖੇਤਰ, ਸਥਾਨ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੈਰਾਮੀਟਰਾਂ ਨੂੰ ਬਦਲੋ।',
    applyBtn: 'ਸਰਗਰਮ ਪ੍ਰੋਫਾਈਲ ਤੇ ਲਾਗੂ ਕਰੋ',
    appliedNotice: 'ਪ੍ਰੋਫਾਈਲ ਸਿੰਕ ਹੋ ਗਈ!',
    instantPresets: 'ਤੁਰੰਤ ਪ੍ਰੀਸੈੱਟ:',
    presetMaxSubsidy: '🎯 ਵੱਧ ਤੋਂ ਵੱਧ 35% ਪੇਂਡੂ ਸਬਸਿਡੀ',
    presetScaleMfg: '🏭 ਮੈਨੂਫੈਕਚਰਿੰਗ ਸਕੇਲ-ਅੱਪ (₹25 ਲੱਖ)',
    presetMicroCredit: '⚡ ਮਾਈਕ੍ਰੋ-ਲੋਨ (< ₹1 ਲੱਖ)',
    presetReset: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ ਤੇ ਰੀਸੈੱਟ ਕਰੋ',
    simParams: 'ਸਿਮੂਲੇਸ਼ਨ ਪੈਰਾਮੀਟਰ',
    totalProjectCost: 'ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ',
    microHint: '₹50,000 (ਮਾਈਕ੍ਰੋ)',
    msmeHint: '₹25,00,000 (MSME)',
    maxPmegpHint: '₹50,00,000 (ਵੱਧ ਤੋਂ ਵੱਧ PMEGP)',
    bankLoanRequested: 'ਬੈਂਕ ਲੋਨ ਦੀ ਮੰਗ',
    loanPortion: 'ਕਰਜ਼ਾ ਹਿੱਸਾ:',
    promoterMargin: 'ਪ੍ਰਮੋਟਰ ਮਾਰਜਿਨ ਮਨੀ (ਆਪਣਾ ਨਿਵੇਸ਼)',
    marginScStHint: '₹5,000 (SC/ST ਲਈ ਘੱਟੋ-ਘੱਟ 5%)',
    marginGenHint: 'ਜਨਰਲ ਲਈ ਘੱਟੋ-ਘੱਟ 10%',
    marginMaxHint: '40% ਵੱਧ ਤੋਂ ਵੱਧ ਸਵੈ-ਨਿਵੇਸ਼',
    businessSector: 'ਕਾਰੋਬਾਰੀ ਖੇਤਰ',
    artisanCraft: 'ਕਾਰੀਗਰ ਅਤੇ ਦਸਤਕਾਰੀ',
    manufacturing: 'ਮੈਨੂਫੈਕਚਰਿੰਗ',
    services: 'ਸੇਵਾਵਾਂ',
    retailTrading: 'ਪ੍ਰਚੂਨ / ਵਪਾਰ',
    textilesWeaving: 'ਕੱਪੜਾ ਅਤੇ ਬੁਣਾਈ',
    agroAllied: 'ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ',
    socialCategory: 'ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ',
    catSC: 'SC (ਅਨੁਸੂਚਿਤ ਜਾਤੀ)',
    catST: 'ST (ਅਨੁਸੂਚਿਤ ਜਨਜਾਤੀ)',
    catOBC: 'OBC (ਪੱਛੜੀਆਂ ਸ਼੍ਰੇਣੀਆਂ)',
    catGeneral: 'ਜਨਰਲ',
    catMinority: 'ਘੱਟ ਗਿਣਤੀ',
    locationType: 'ਸਥਾਨ ਦੀ ਕਿਸਮ',
    locRural: 'ਪੇਂਡੂ (35% ਸਬਸਿਡੀ)',
    locUrban: 'ਸ਼ਹਿਰੀ (25% ਸਬਸਿਡੀ)',
    locSemiUrban: 'ਅਰਧ-ਸ਼ਹਿਰੀ',
    simRegDocs: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ / ਦਸਤਾਵੇਜ਼ ਸਥਿਤੀ ਸਿਮੂਲੇਟ ਕਰੋ:',
    hasUdyam: 'ਉਦਯਮ ਉਪਲਬਧ',
    casteCert: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ',
    bankableDpr: 'ਬੈਂਕ ਯੋਗ ਡੀ.ਪੀ.ਆਰ.',
    simOutcome: 'ਸਿਮੂਲੇਟਿਡ ਵਿੱਤੀ ਨਤੀਜਾ',
    liveCalculated: 'ਲਾਈਵ ਗਣਨਾ',
    govtSubsidy: 'ਸਰਕਾਰੀ ਪੂੰਜੀ ਸਬਸਿਡੀ',
    estMonthlyEmi: 'ਅਨੁਮਾਨਿਤ ਮਾਸਿਕ EMI',
    rateSuffix: 'ਦਰ',
    tenureNote: 'ਸਾਲਾਨਾ • 5 ਸਾਲ ਦੀ ਮਿਆਦ',
    higherSubsidyNotice: 'ਤੁਹਾਡੀ ਬੇਸਲਾਈਨ ਪ੍ਰੋਫਾਈਲ ਦੇ ਮੁਕਾਬਲੇ ਵੱਧ ਸਬਸਿਡੀ!',
    lowerSubsidyNotice: 'ਬਦਲੇ ਗਏ ਪੈਰਾਮੀਟਰਾਂ ਕਾਰਨ ਘੱਟ ਸਬਸਿਡੀ।',
    schemeFeasibility: 'ਮੌਜੂਦਾ ਸਿਮੂਲੇਸ਼ਨ ਅਧੀਨ ਸਕੀਮ ਯੋਗਤਾ:',
    pmegpTitle: 'PMEGP ਕ੍ਰੈਡਿਟ ਸਬਸਿਡੀ',
    pmegpCostOk: '✅ ਲਾਗਤ ਸੀਮਾ ਅੰਦਰ ਹੈ',
    pmegpCostExceed: '❌ 50 ਲੱਖ ਦੀ ਹੱਦ ਤੋਂ ਵੱਧ',
    fitScoreHigh: '95% ਯੋਗ',
    fitScoreMed: '78% ਯੋਗ',
    standupTitle: 'ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ (₹10L - ₹1Cr)',
    standupEligible: '✅ ਗ੍ਰੀਨਫੀਲਡ ਲਈ ਯੋਗ',
    standupReq: 'ਘੱਟੋ-ਘੱਟ ₹10 ਲੱਖ ਲੋਨ ਅਤੇ SC/ST/ਮਹਿਲਾ ਹੋਣਾ ਲਾਜ਼ਮੀ',
    badgeEligible: 'ਯੋਗ',
    badgeConditional: 'ਸ਼ਰਤੀਆ',
    mudraTitle: 'ਮੁਦਰਾ (ਤਰੁਣ) / NSFDC ਮਿਆਦੀ ਕਰਜ਼ਾ',
    mudraDesc: '4-6% ਰਿਆਇਤੀ ਦਰ ਤੇ ₹10 ਲੱਖ ਤੱਕ',
    badgeHighPriority: 'ਉੱਚ ਤਰਜੀਹ',
    badgeBridgeOption: 'ਵਿਕਲਪ'
  },
  te: {
    badge: 'రియల్-టైమ్ పారామీటర్ సెన్సిటివిటీ',
    title: 'వాట్-ఇఫ్ స్కీమ్ సిమ్యులేటర్',
    subtitle: 'సబ్సిడీ, అర్హత సంభావ్యత మరియు నెలవారీ చెల్లింపుల (EMI) మార్పులను నిజ సమయంలో వీక్షించడానికి ఆర్థిక అవసరాలు, రంగం మరియు స్థానాన్ని మార్చండి.',
    applyBtn: 'యాక్టివ్ ప్రొఫైల్‌కు వర్తింపజేయండి',
    appliedNotice: 'ప్రొఫైల్ సమకాలీకరించబడింది!',
    instantPresets: 'తక్షణ ప్రీసెట్‌లు:',
    presetMaxSubsidy: '🎯 గరిష్ట 35% గ్రామీణ సబ్సిడీ',
    presetScaleMfg: '🏭 తయారీ విస్తరణ (₹25 లక్షలు)',
    presetMicroCredit: '⚡ సూక్ష్మ రుణం (< ₹1 లక్ష)',
    presetReset: 'నా ప్రొఫైల్‌కు రీసెట్ చేయండి',
    simParams: 'సిమ్యులేషన్ పారామితులు',
    totalProjectCost: 'మొత్తం ప్రాజెక్ట్ ఖర్చు',
    microHint: '₹50,000 (మైక్రో)',
    msmeHint: '₹25,00,000 (MSME)',
    maxPmegpHint: '₹50,00,000 (గరిష్ట PMEGP)',
    bankLoanRequested: 'బ్యాంక్ రుణం కోరిన మొత్తం',
    loanPortion: 'రుణం శాతం:',
    promoterMargin: 'ప్రమోటర్ మార్జిన్ మనీ (సొంత పెట్టుబడి)',
    marginScStHint: '₹5,000 (SC/ST కి కనీసం 5%)',
    marginGenHint: 'జనరల్ కి కనీసం 10%',
    marginMaxHint: 'గరిష్ట 40% స్వీయ-నిధులు',
    businessSector: 'వ్యాపార రంగం',
    artisanCraft: 'చేతివృత్తులు & కళలు',
    manufacturing: 'తయారీ రంగం',
    services: 'సేవలు',
    retailTrading: 'రిటైల్ / వ్యాపారం',
    textilesWeaving: 'వస్త్రాలు & నేత',
    agroAllied: 'వ్యవసాయ అనుబంధ',
    socialCategory: 'సామాజిక వర్గం',
    catSC: 'SC (షెడ్యూల్డ్ కులం)',
    catST: 'ST (షెడ్యూల్డ్ తెగ)',
    catOBC: 'OBC',
    catGeneral: 'జనరల్',
    catMinority: 'మైనారిటీ',
    locationType: 'ప్రాంతం రకం',
    locRural: 'గ్రామీణ (35% సబ్సిడీ)',
    locUrban: 'పట్టణ (25% సబ్సిడీ)',
    locSemiUrban: 'సెమీ-అర్బన్',
    simRegDocs: 'రిజిస్ట్రేషన్ / పత్రాల స్థితిని అనుకరించండి:',
    hasUdyam: 'ఉద్యమ్ ఉంది',
    casteCert: 'కుల ధృవీకరణ పత్రం',
    bankableDpr: 'బ్యాంకు ఆమోదయోగ్య DPR',
    simOutcome: 'సిమ్యులేటెడ్ ఆర్థిక ఫలితం',
    liveCalculated: 'ప్రత్యక్ష లెక్కింపు',
    govtSubsidy: 'ప్రభుత్వ మూలధన సబ్సిడీ',
    estMonthlyEmi: 'అంచనా వేసిన నెలవారీ EMI',
    rateSuffix: 'రేటు',
    tenureNote: 'సంవత్సరానికి • 5 సంవత్సరాల కాలపరిమితి',
    higherSubsidyNotice: 'మీ బేస్‌లైన్ ప్రొఫైల్ కంటే ఎక్కువ సబ్సిడీ!',
    lowerSubsidyNotice: 'మార్చిన పారామితుల కారణంగా తక్కువ సబ్సిడీ.',
    schemeFeasibility: 'ప్రస్తుత సిమ్యులేషన్ ప్రకారం స్కీమ్ అర్హత:',
    pmegpTitle: 'PMEGP క్రెడిట్ సబ్సిడీ',
    pmegpCostOk: '✅ పరిమితి లోపల ఖర్చు',
    pmegpCostExceed: '❌ 50 లక్షల పరిమితిని మించింది',
    fitScoreHigh: '95% అనుకూలం',
    fitScoreMed: '78% అనుకూలం',
    standupTitle: 'స్టాండప్ ఇండియా (₹10L - ₹1Cr)',
    standupEligible: '✅ గ్రీన్‌ఫీల్డ్‌కు అర్హత ఉంది',
    standupReq: 'కనీసం ₹10 లక్షల రుణం & SC/ST/మహిళలు అవసరం',
    badgeEligible: 'అర్హత ఉంది',
    badgeConditional: 'షరతులతో కూడిన',
    mudraTitle: 'ముద్రా (తరుణ్) / NSFDC టర్మ్ లోన్',
    mudraDesc: '4-6% రాయితీ రేటుతో ₹10 లక్షల వరకు',
    badgeHighPriority: 'అత్యధిక ప్రాధాన్యత',
    badgeBridgeOption: 'మధ్యంతర ఎంపిక'
  },
  mr: {
    badge: 'रिअल-टाइम पॅरामीटर संवेदनशीलता',
    title: 'व्हॉट-इफ योजना सिम्युलेटर',
    subtitle: 'कॅपिटल सबसिडी, पात्रता शक्यता आणि मासिक हप्त्यामध्ये (EMI) होणारे बदल पाहण्यासाठी रिअल-टाइममध्ये आर्थिक गरजा, उद्योग क्षेत्र आणि स्थान बदला.',
    applyBtn: 'सक्रिय प्रोफाइलवर लागू करा',
    appliedNotice: 'प्रोफाइल सिंक झाली!',
    instantPresets: 'झटपट प्रीसेट्स:',
    presetMaxSubsidy: '🎯 कमाल 35% ग्रामीण सबसिडी',
    presetScaleMfg: '🏭 उत्पादन विस्तार (₹25 लाख)',
    presetMicroCredit: '⚡ सूक्ष्म कर्ज (< ₹1 लाख)',
    presetReset: 'माझ्या प्रोफाइलवर रीसेट करा',
    simParams: 'सिम्युलेशन पॅरामीटर्स',
    totalProjectCost: 'एकूण प्रकल्प खर्च',
    microHint: '₹50,000 (मायक्रो)',
    msmeHint: '₹25,00,000 (MSME)',
    maxPmegpHint: '₹50,00,000 (कमाल PMEGP)',
    bankLoanRequested: 'बँक कर्ज मागणी',
    loanPortion: 'कर्ज हिस्सा:',
    promoterMargin: 'प्रमोटर मार्जिन मनी (स्वतःची गुंतवणूक)',
    marginScStHint: '₹5,000 (SC/ST साठी किमान 5%)',
    marginGenHint: 'सर्वसाधारणसाठी किमान 10%',
    marginMaxHint: '40% कमाल स्वतःचे भांडवल',
    businessSector: 'व्यवसाय क्षेत्र',
    artisanCraft: 'कारागीर आणि हस्तकला',
    manufacturing: 'उत्पादन (मॅन्युफॅक्चरिंग)',
    services: 'सेवा',
    retailTrading: 'किरकोळ / व्यापार',
    textilesWeaving: 'कापड आणि विणकाम',
    agroAllied: 'कृषी पूरक',
    socialCategory: 'सामाजिक प्रवर्ग',
    catSC: 'SC (अनुसूचित जाती)',
    catST: 'ST (अनुसूचित जमाती)',
    catOBC: 'OBC (इतर मागासवर्गीय)',
    catGeneral: 'खुला प्रवर्ग (General)',
    catMinority: 'अल्पसंख्याक',
    locationType: 'स्थानाचा प्रकार',
    locRural: 'ग्रामीण (35% सबसिडी)',
    locUrban: 'शहरी (25% सबसिडी)',
    locSemiUrban: 'निम-शहरी',
    simRegDocs: 'नोंदणी / कागदपत्र स्थिती सिम्युलेट करा:',
    hasUdyam: 'उद्यम नोंदणी आहे',
    casteCert: 'जातीचा दाखला',
    bankableDpr: 'बँकेसाठी योग्य DPR',
    simOutcome: 'सिम्युलेटेड आर्थिक निकाल',
    liveCalculated: 'थेट गणना',
    govtSubsidy: 'शासकीय भांडवली सबसिडी',
    estMonthlyEmi: 'अंदाजे मासिक हप्ता (EMI)',
    rateSuffix: 'दर',
    tenureNote: 'वार्षिक • 5 वर्षे कालावधी',
    higherSubsidyNotice: 'तुमच्या मूळ प्रोफाइलच्या तुलनेत जास्त सबसिडी!',
    lowerSubsidyNotice: 'बदललेल्या घटकांमुळे कमी सबसिडी.',
    schemeFeasibility: 'सध्याच्या सिम्युलेशननुसार योजना पात्रता:',
    pmegpTitle: 'PMEGP क्रेडिट सबसिडी',
    pmegpCostOk: '✅ खर्च मर्यादेत आहे',
    pmegpCostExceed: '❌ 50 लाखांच्या मर्यादेपेक्षा जास्त',
    fitScoreHigh: '95% योग्य',
    fitScoreMed: '78% योग्य',
    standupTitle: 'स्टँड-अप इंडिया (₹10L - ₹1Cr)',
    standupEligible: '✅ ग्रीनफिल्डसाठी पात्र',
    standupReq: 'किमान ₹10 लाख कर्ज व SC/ST/महिला असणे आवश्यक',
    badgeEligible: 'पात्र',
    badgeConditional: 'सशर्त',
    mudraTitle: 'मुद्रा (तरुण) / NSFDC मुदत कर्ज',
    mudraDesc: '4-6% सवलतीच्या दरात ₹10 लाखांपर्यंत',
    badgeHighPriority: 'उच्च प्राधान्य',
    badgeBridgeOption: 'पर्यायी मार्ग'
  },
  bn: {
    badge: 'রিয়েল-টাইম প্যারামিটার বিশ্লেষণ',
    title: 'হোয়াট-ইফ স্কিম সিমুলেটর',
    subtitle: 'মূলধন ভর্তুকি, যোগ্যতার সম্ভাবনা এবং মাসিক ইএমআই-তে গতিশীল পরিবর্তন দেখতে রিয়েল-টাইমে আর্থিক প্রয়োজনীয়তা, খাত এবং অবস্থান সমন্বয় করুন।',
    applyBtn: 'সক্রিয় প্রোফাইলে প্রয়োগ করুন',
    appliedNotice: 'প্রোফাইল সিঙ্ক হয়েছে!',
    instantPresets: 'তাত্ক্ষণিক প্রিসেট:',
    presetMaxSubsidy: '🎯 সর্বোচ্চ ৩৫% গ্রামীণ ভর্তুকি',
    presetScaleMfg: '🏭 উৎপাদন বৃদ্ধি (₹২৫ লক্ষ)',
    presetMicroCredit: '⚡ ক্ষুদ্র ঋণ (< ₹১ লক্ষ)',
    presetReset: 'আমার প্রোফাইলে রিসেট করুন',
    simParams: 'সিমুলেশন প্যারামিটার',
    totalProjectCost: 'মোট প্রকল্প ব্যয়',
    microHint: '₹৫০,০০০ (ক্ষুদ্র)',
    msmeHint: '₹২৫,০০,০০০ (এমএসএমই)',
    maxPmegpHint: '₹৫০,০০,০০০ (সর্বোচ্চ PMEGP)',
    bankLoanRequested: 'ব্যাংক ঋণের পরিমাণ',
    loanPortion: 'ঋণের অংশ:',
    promoterMargin: 'প্রবর্তকের নিজস্ব মূলধন (মার্জিন মানি)',
    marginScStHint: '₹৫,০০০ (SC/ST-এর জন্য ন্যূনতম ৫%)',
    marginGenHint: 'সাধারণ বিভাগের জন্য ন্যূনতম ১০%',
    marginMaxHint: 'সর্বোচ্চ ৪০% স্ব-অর্থায়ন',
    businessSector: 'ব্যবসা খাত',
    artisanCraft: 'কারুশিল্পী ও হস্তশিল্প',
    manufacturing: 'উৎপাদন',
    services: 'পরিষেবা',
    retailTrading: 'খুচরা / বাণিজ্য',
    textilesWeaving: 'বস্ত্র ও বয়নশিল্প',
    agroAllied: 'কৃষি সহযোগী',
    socialCategory: 'সামাজিক শ্রেণী',
    catSC: 'এসসি (তফসিলি জাতি)',
    catST: 'এসটি (তফসিলি উপজাতি)',
    catOBC: 'ওবিসি',
    catGeneral: 'সাধারণ',
    catMinority: 'সংখ্যালঘু',
    locationType: 'অবস্থানের ধরন',
    locRural: 'গ্রামীণ (৩৫% ভর্তুকি)',
    locUrban: 'শহুরে (২৫% ভর্তুকি)',
    locSemiUrban: 'আধা-শহুরে',
    simRegDocs: 'নিবন্ধন / নথিপত্র স্থিতি সিমুলেট করুন:',
    hasUdyam: 'উদ্যম রয়েছে',
    casteCert: 'জাতি শংসাপত্র',
    bankableDpr: 'ব্যাংক গ্রহণযোগ্য ডিপিআর',
    simOutcome: 'সিমুলেটেড আর্থিক ফলাফল',
    liveCalculated: 'সরাসরি গণনা',
    govtSubsidy: 'সরকারি মূলধন ভর্তুকি',
    estMonthlyEmi: 'আনুমানিক মাসিক ইএমআই',
    rateSuffix: 'হার',
    tenureNote: 'বার্ষিক • ৫ বছরের মেয়াদ',
    higherSubsidyNotice: 'আপনার প্রাথমিক প্রোফাইলের চেয়ে বেশি ভর্তুকি!',
    lowerSubsidyNotice: 'প্যারামিটার পরিবর্তনের কারণে কম ভর্তুকি।',
    schemeFeasibility: 'বর্তমান সিমুলেশনে স্কিম যোগ্যতা:',
    pmegpTitle: 'PMEGP ঋণ ভর্তুকি',
    pmegpCostOk: '✅ ব্যয় সীমার মধ্যে',
    pmegpCostExceed: '❌ ৫০ লক্ষের সীমা ছাড়িয়েছে',
    fitScoreHigh: '৯৫% উপযুক্ত',
    fitScoreMed: '৭৮% উপযুক্ত',
    standupTitle: 'স্ট্যান্ড-আপ ইন্ডিয়া (₹১০L - ₹১Cr)',
    standupEligible: '✅ গ্রিনফিল্ডের জন্য যোগ্য',
    standupReq: 'ন্যূনতম ₹১০ লক্ষ ঋণ এবং SC/ST/মহিলা হওয়া প্রয়োজন',
    badgeEligible: 'যোগ্য',
    badgeConditional: 'শর্তসাপেক্ষ',
    mudraTitle: 'মুদ্রা (তরুণ) / NSFDC মেয়াদী ঋণ',
    mudraDesc: '৪-৬% সুবিধাজনক সুদের হারে ₹১০ লক্ষ পর্যন্ত',
    badgeHighPriority: 'উচ্চ অগ্রাধিকার',
    badgeBridgeOption: 'বিকল্প ব্যবস্থা'
  }
};

export const WhatIfSimulator: React.FC = () => {
  const { profile, setProfile, runMatching, matchResults } = useProfile();
  const { language } = useLanguage();
  const t = (key: string) => WHATIF_LABELS[language]?.[key] || WHATIF_LABELS.en[key] || key;

  // Simulated state initialized from active user profile
  const [simLoanAmount, setSimLoanAmount] = useState<number>(profile.requiredLoanAmount || 250000);
  const [simProjectCost, setSimProjectCost] = useState<number>(profile.totalProjectCost || 300000);
  const [simPromoterContribution, setSimPromoterContribution] = useState<number>(profile.promoterContributionAvailable || 15000);
  const [simSector, setSimSector] = useState<SectorType>(profile.sector || 'ArtisanHandicraft');
  const [simCategory, setSimCategory] = useState<SocialCategory>(profile.category || 'SC');
  const [simLocation, setSimLocation] = useState<LocationType>(profile.locationType || 'Rural');
  const [simHasUdyam, setSimHasUdyam] = useState<boolean>(profile.hasExistingUdyam || false);
  const [simHasCasteCert, setSimHasCasteCert] = useState<boolean>(profile.hasCasteCertificate || true);
  const [simHasDpr, setSimHasDpr] = useState<boolean>(profile.hasProjectReport || false);

  const [isAppliedNotice, setIsAppliedNotice] = useState<boolean>(false);

  // Calculate simulated subsidy & scores based on rules
  const marginPercent = simProjectCost > 0 ? (simPromoterContribution / simProjectCost) * 100 : 5;

  // Simulate PMEGP Subsidy Rate:
  // Special category (SC/ST/OBC/Women) Rural = 35%, Urban = 25%
  // General category Rural = 25%, Urban = 15%
  const isSpecialCategory = simCategory === 'SC' || simCategory === 'ST' || simCategory === 'OBC' || profile.gender === 'Female';
  let simSubsidyRate = 15;
  if (isSpecialCategory) {
    simSubsidyRate = simLocation === 'Rural' ? 35 : 25;
  } else {
    simSubsidyRate = simLocation === 'Rural' ? 25 : 15;
  }

  // Max cap for PMEGP: Mfg 50L (subsidy max 17.5L), Service 20L (subsidy max 7L)
  const maxEligibleCost = simSector === 'Manufacturing' ? 5000000 : 2000000;
  const effectiveProjectCost = Math.min(simProjectCost, maxEligibleCost);
  const simSubsidyAmount = Math.round(effectiveProjectCost * (simSubsidyRate / 100));

  // Simulated EMI calculation (concessional ~6% vs standard ~9%)
  const simAnnualRate = isSpecialCategory ? 0.06 : 0.085;
  const simMonthlyRate = simAnnualRate / 12;
  const simTenureMonths = 60;
  const simPrincipal = Math.max(10000, simLoanAmount - simSubsidyAmount);
  const simEmi = Math.round(
    (simPrincipal * simMonthlyRate * Math.pow(1 + simMonthlyRate, simTenureMonths)) /
    (Math.pow(1 + simMonthlyRate, simTenureMonths) - 1)
  );

  // Baseline comparisons with current profile
  const baselineLoan = profile.requiredLoanAmount || 250000;
  const baselineSubsidy = Math.round(
    profile.totalProjectCost * (profile.locationType === 'Rural' && (profile.category === 'SC' || profile.category === 'ST') ? 0.35 : 0.25)
  );
  const subsidyDelta = simSubsidyAmount - baselineSubsidy;

  // Quick Preset Scenarios
  const applyPreset = (preset: 'max_subsidy' | 'scale_mfg' | 'micro_credit' | 'reset') => {
    if (preset === 'reset') {
      setSimLoanAmount(profile.requiredLoanAmount || 250000);
      setSimProjectCost(profile.totalProjectCost || 300000);
      setSimPromoterContribution(profile.promoterContributionAvailable || 15000);
      setSimSector(profile.sector || 'ArtisanHandicraft');
      setSimCategory(profile.category || 'SC');
      setSimLocation(profile.locationType || 'Rural');
      setSimHasUdyam(profile.hasExistingUdyam || false);
      setSimHasCasteCert(profile.hasCasteCertificate || true);
      setSimHasDpr(profile.hasProjectReport || false);
    } else if (preset === 'max_subsidy') {
      setSimCategory('SC');
      setSimLocation('Rural');
      setSimSector('Manufacturing');
      setSimProjectCost(1000000);
      setSimLoanAmount(900000);
      setSimPromoterContribution(50000);
      setSimHasUdyam(true);
      setSimHasCasteCert(true);
      setSimHasDpr(true);
    } else if (preset === 'scale_mfg') {
      setSimSector('Manufacturing');
      setSimProjectCost(2500000);
      setSimLoanAmount(2250000);
      setSimPromoterContribution(250000);
      setSimHasUdyam(true);
      setSimHasDpr(true);
    } else if (preset === 'micro_credit') {
      setSimSector('Trading');
      setSimProjectCost(80000);
      setSimLoanAmount(70000);
      setSimPromoterContribution(10000);
      setSimHasUdyam(false);
      setSimHasDpr(false);
    }
  };

  // Commit Simulated Profile back to Workspace Context
  const applyToProfile = () => {
    const updatedProfile = {
      ...profile,
      requiredLoanAmount: simLoanAmount,
      totalProjectCost: simProjectCost,
      promoterContributionAvailable: simPromoterContribution,
      sector: simSector,
      category: simCategory,
      locationType: simLocation,
      hasExistingUdyam: simHasUdyam,
      hasCasteCertificate: simHasCasteCert,
      hasProjectReport: simHasDpr
    };
    setProfile(updatedProfile);
    runMatching(updatedProfile);
    setIsAppliedNotice(true);
    setTimeout(() => setIsAppliedNotice(false), 3000);
  };

  return (
    <div className="whatif-simulator-container" style={{ padding: '8px 0' }}>
      {/* Institutional Parameter Sensitivity Header */}
      <div className="tactile-card-3d" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                <ShieldCheck size={12} />
                <span>{t('badge')}</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SENSITIVITY ENGINE
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              {t('subtitle')}
            </p>
          </div>

          {/* Quick Apply Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={applyToProfile}
              className="tactile-btn-primary-3d"
              style={{
                padding: '10px 18px',
                fontSize: '0.86rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isAppliedNotice ? <Check size={16} /> : <Zap size={16} />}
              <span>{isAppliedNotice ? t('appliedNotice') : t('applyBtn')}</span>
            </button>
          </div>
        </div>

        {/* Preset Scenarios Strip with 3D Tactile Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('instantPresets')}
          </span>
          <button
            onClick={() => applyPreset('max_subsidy')}
            className="tactile-btn-secondary-3d"
            style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '8px' }}
          >
            {t('presetMaxSubsidy')}
          </button>
          <button
            onClick={() => applyPreset('scale_mfg')}
            className="tactile-btn-secondary-3d"
            style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '8px' }}
          >
            {t('presetScaleMfg')}
          </button>
          <button
            onClick={() => applyPreset('micro_credit')}
            className="tactile-btn-secondary-3d"
            style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '8px' }}
          >
            {t('presetMicroCredit')}
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="tactile-btn-secondary-3d"
            style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '8px' }}
          >
            <RefreshCw size={12} style={{ marginRight: '4px' }} />
            {t('presetReset')}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Sliders) + Right Live Impact Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr)', gap: '24px' }}>
        
        {/* Left Column: Interactive Simulation Sliders & Switches */}
        <div className="tactile-card-3d" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: '#4F46E5' }} />
            <span>{t('simParams')}</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Slider 1: Total Project Cost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('totalProjectCost')}
                </label>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4F46E5', fontFamily: 'var(--font-mono)' }}>
                  ₹{simProjectCost.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={50000}
                max={5000000}
                step={25000}
                value={simProjectCost}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSimProjectCost(val);
                  if (simLoanAmount > val) setSimLoanAmount(Math.round(val * 0.9));
                }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>{t('microHint')}</span>
                <span>{t('msmeHint')}</span>
                <span>{t('maxPmegpHint')}</span>
              </div>
            </div>

            {/* Slider 2: Required Loan Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('bankLoanRequested')}
                </label>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                  ₹{simLoanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={25000}
                max={simProjectCost}
                step={25000}
                value={simLoanAmount}
                onChange={(e) => setSimLoanAmount(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>₹25,000</span>
                <span>{t('loanPortion')} {Math.round((simLoanAmount / simProjectCost) * 100)}%</span>
                <span>₹{simProjectCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Slider 3: Promoter Contribution */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('promoterMargin')}
                </label>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>
                  ₹{simPromoterContribution.toLocaleString('en-IN')} ({marginPercent.toFixed(1)}%)
                </span>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={5000}
                max={Math.round(simProjectCost * 0.4)}
                step={5000}
                value={simPromoterContribution}
                onChange={(e) => setSimPromoterContribution(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>{t('marginScStHint')}</span>
                <span>{t('marginGenHint')}</span>
                <span>{t('marginMaxHint')}</span>
              </div>
            </div>

            {/* Selectors Grid: Sector, Category, Location */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('businessSector')}
                </label>
                <select
                  value={simSector}
                  onChange={(e) => setSimSector(e.target.value as SectorType)}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                >
                  <option value="ArtisanHandicraft">{t('artisanCraft')}</option>
                  <option value="Manufacturing">{t('manufacturing')}</option>
                  <option value="Services">{t('services')}</option>
                  <option value="Trading">{t('retailTrading')}</option>
                  <option value="Textiles">{t('textilesWeaving')}</option>
                  <option value="AgroAllied">{t('agroAllied')}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('socialCategory')}
                </label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value as SocialCategory)}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                >
                  <option value="SC">{t('catSC')}</option>
                  <option value="ST">{t('catST')}</option>
                  <option value="OBC">{t('catOBC')}</option>
                  <option value="General">{t('catGeneral')}</option>
                  <option value="Minority">{t('catMinority')}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('locationType')}
                </label>
                <select
                  value={simLocation}
                  onChange={(e) => setSimLocation(e.target.value as LocationType)}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                >
                  <option value="Rural">{t('locRural')}</option>
                  <option value="Urban">{t('locUrban')}</option>
                  <option value="Semi-Urban">{t('locSemiUrban')}</option>
                </select>
              </div>
            </div>

            {/* Verification Toggles */}
            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                {t('simRegDocs')}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasUdyam}
                    onChange={(e) => setSimHasUdyam(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>{t('hasUdyam')}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasCasteCert}
                    onChange={(e) => setSimHasCasteCert(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>{t('casteCert')}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasDpr}
                    onChange={(e) => setSimHasDpr(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>{t('bankableDpr')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Outcomes & Delta Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Key Outcome Highlights Pod */}
          <div className="tactile-card-3d" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {t('simOutcome')}
              </h3>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                {t('liveCalculated')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div className="tactile-stat-pod-3d" style={{ padding: '14px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, display: 'block' }}>
                  {t('govtSubsidy')}
                </span>
                <strong style={{ fontSize: '1.4rem', color: '#059669', display: 'block', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                  ₹{simSubsidyAmount.toLocaleString('en-IN')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                  {simSubsidyRate}% {t('rateSuffix')} ({simLocation})
                </span>
              </div>

              <div className="tactile-stat-pod-3d" style={{ padding: '14px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, display: 'block' }}>
                  {t('estMonthlyEmi')}
                </span>
                <strong style={{ fontSize: '1.4rem', color: '#4F46E5', display: 'block', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                  ₹{simEmi.toLocaleString('en-IN')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {(simAnnualRate * 100).toFixed(1)}% {t('tenureNote')}
                </span>
              </div>
            </div>

            {/* Subsidy Delta Notice */}
            <div style={{
              padding: '12px 14px',
              background: subsidyDelta >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
              border: subsidyDelta >= 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {subsidyDelta >= 0 ? (
                <TrendingUp size={18} style={{ color: '#059669', flexShrink: 0 }} />
              ) : (
                <TrendingDown size={18} style={{ color: '#DC2626', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                {subsidyDelta >= 0 ? (
                  <><strong>+₹{subsidyDelta.toLocaleString('en-IN')}</strong> {t('higherSubsidyNotice')}</>
                ) : (
                  <><strong>-₹{Math.abs(subsidyDelta).toLocaleString('en-IN')}</strong> {t('lowerSubsidyNotice')}</>
                )}
              </span>
            </div>
          </div>

          {/* Scheme Feasibility Matrix */}
          <div className="tactile-card-3d" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
              {t('schemeFeasibility')}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PMEGP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '9px' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-primary)' }}>{t('pmegpTitle')}</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {simProjectCost <= 5000000 ? t('pmegpCostOk') : t('pmegpCostExceed')}
                  </span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  {simHasUdyam && simHasDpr ? t('fitScoreHigh') : t('fitScoreMed')}
                </span>
              </div>

              {/* Stand-Up India */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '9px' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-primary)' }}>{t('standupTitle')}</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {simLoanAmount >= 1000000 && isSpecialCategory ? t('standupEligible') : t('standupReq')}
                  </span>
                </div>
                <span className={`badge ${simLoanAmount >= 1000000 && isSpecialCategory ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  {simLoanAmount >= 1000000 && isSpecialCategory ? t('badgeEligible') : t('badgeConditional')}
                </span>
              </div>

              {/* Mudra / NSFDC */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '9px' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-primary)' }}>{t('mudraTitle')}</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {t('mudraDesc')}
                  </span>
                </div>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  {simLoanAmount <= 1000000 ? t('badgeHighPriority') : t('badgeBridgeOption')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatIfSimulator;
