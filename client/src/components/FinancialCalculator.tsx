import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Calendar, 
  CheckCircle, 
  FileText, 
  TrendingDown, 
  PieChart, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface SchemeFinancialPreset {
  id: string;
  nameKey: string;
  interestRate: number; // % per annum
  interestSubvention: number; // % subsidy on interest
  maxSubsidyPercent: number;
  maxSubsidyAmount: number;
  promoterContributionMin: number; // %
  defaultTenureYears: number;
  defaultMoratoriumMonths: number;
}

const SCHEME_PRESETS: SchemeFinancialPreset[] = [
  {
    id: 'pmegp',
    nameKey: 'presetPmegp',
    interestRate: 8.5,
    interestSubvention: 0,
    maxSubsidyPercent: 35, // For special category rural
    maxSubsidyAmount: 1750000,
    promoterContributionMin: 5,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  },
  {
    id: 'standup',
    nameKey: 'presetStandup',
    interestRate: 7.75,
    interestSubvention: 0,
    maxSubsidyPercent: 15,
    maxSubsidyAmount: 1500000,
    promoterContributionMin: 15,
    defaultTenureYears: 7,
    defaultMoratoriumMonths: 18
  },
  {
    id: 'nsfdc-term',
    nameKey: 'presetNsfdc',
    interestRate: 5.0,
    interestSubvention: 1.5,
    maxSubsidyPercent: 20,
    maxSubsidyAmount: 500000,
    promoterContributionMin: 5,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  },
  {
    id: 'mudra-tarun',
    nameKey: 'presetMudra',
    interestRate: 8.75,
    interestSubvention: 0,
    maxSubsidyPercent: 0,
    maxSubsidyAmount: 0,
    promoterContributionMin: 10,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 3
  },
  {
    id: 'pmsvanidhi',
    nameKey: 'presetSvanidhi',
    interestRate: 9.0,
    interestSubvention: 7.0,
    maxSubsidyPercent: 0,
    maxSubsidyAmount: 0,
    promoterContributionMin: 0,
    defaultTenureYears: 1,
    defaultMoratoriumMonths: 0
  },
  {
    id: 'custom',
    nameKey: 'presetCustom',
    interestRate: 8.5,
    interestSubvention: 0,
    maxSubsidyPercent: 25,
    maxSubsidyAmount: 1000000,
    promoterContributionMin: 10,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  }
];

const CALC_LABELS: Record<Language, Record<string, string>> = {
  en: {
    badge: 'Scheme-Aware Banking Math',
    title: 'Scheme-Aware Financial Calculator',
    subtitle: 'Calculates bank appraisal metrics, back-ended capital subsidies, interest subvention concessions, and monthly EMIs calibrated to exact Government scheme guidelines.',
    transferBtn: 'Transfer to Bank DPR',
    presetLabel: 'Select Concessional Scheme Rules:',
    presetPmegp: 'PMEGP (Prime Minister Employment Generation Programme)',
    presetStandup: 'Stand-Up India (SC/ST & Women Greenfields)',
    presetNsfdc: 'NSFDC Term Loan (Concessional for SC Entrepreneurs)',
    presetMudra: 'PM MUDRA Yojana (Tarun Category)',
    presetSvanidhi: 'PM SVANidhi (Micro-Credit with 7% Subvention)',
    presetCustom: 'Custom Parameter Calculation',
    totalProjectCost: 'Total Project Cost',
    promoterContribution: 'Promoter Contribution (Margin Money)',
    govtSubsidyRate: 'Government Capital Subsidy Rate',
    bankInterestRate: 'Bank Interest (% p.a.)',
    tenureYears: 'Tenure (Years)',
    moratoriumMonths: 'Moratorium (Months)',
    tenure1Yr: '1 Year (12 Mo)',
    tenure3Yr: '3 Years (36 Mo)',
    tenure5Yr: '5 Years (60 Mo)',
    tenure7Yr: '7 Years (84 Mo)',
    moraNoGrace: 'No Grace Period',
    mora3Mo: '3 Months',
    mora6Mo: '6 Months',
    mora12Mo: '12 Months',
    subventionApplied: 'Govt Subvention Applied:',
    subventionDesc: 'Effective interest drops from',
    toText: 'to',
    paText: 'p.a.',
    estMonthlyRepayment: 'Estimated Monthly Repayment',
    perMonth: '/ month',
    capitalDist: 'Capital Distribution',
    totalCostText: 'Total Cost',
    ownMargin: 'Margin:',
    govtSubsidyLabel: 'Subsidy:',
    bankLoanLabel: 'Bank Loan:',
    totalInterestPayable: 'Total Interest Payable:',
    totalOutflow: 'Total Outflow (Principal+Int):',
    subventionSavings: 'Govt. Subvention Savings:',
    interestSavedSuffix: 'interest saved',
    amortTitle: 'Year-by-Year Amortization Trajectory:',
    thYear: 'Year',
    thPrincipal: 'Principal',
    thInterest: 'Interest',
    thBalance: 'Balance',
    yrPrefix: 'Yr'
  },
  hi: {
    badge: 'योजना-आधारित बैंकिंग गणित',
    title: 'योजना-आधारित वित्तीय कैलकुलेटर',
    subtitle: 'सटीक सरकारी योजना दिशानिर्देशों के अनुरूप बैंक मूल्यांकन मेट्रिक्स, पूंजीगत सब्सिडी, ब्याज अनुदान और मासिक ईएमआई की गणना करें।',
    transferBtn: 'बैंक डीपीआर में स्थानांतरित करें',
    presetLabel: 'रियायती योजना के नियम चुनें:',
    presetPmegp: 'PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम)',
    presetStandup: 'स्टैंड-अप इंडिया (SC/ST और महिला ग्रीनफील्ड)',
    presetNsfdc: 'NSFDC मियादी ऋण (SC उद्यमियों हेतु रियायती)',
    presetMudra: 'प्रधानमंत्री मुद्रा योजना (तरुण श्रेणी)',
    presetSvanidhi: 'पीएम स्वनिधि (7% ब्याज अनुदान युक्त सूक्ष्म ऋण)',
    presetCustom: 'कस्टम पैरामीटर गणना',
    totalProjectCost: 'कुल परियोजना लागत',
    promoterContribution: 'प्रमोटर योगदान (मार्जिन मनी)',
    govtSubsidyRate: 'सरकारी पूंजी सब्सिडी दर',
    bankInterestRate: 'बैंक ब्याज (% वार्षिक)',
    tenureYears: 'अवधि (वर्ष)',
    moratoriumMonths: 'मोरेटोरियम (महीने)',
    tenure1Yr: '1 वर्ष (12 माह)',
    tenure3Yr: '3 वर्ष (36 माह)',
    tenure5Yr: '5 वर्ष (60 माह)',
    tenure7Yr: '7 वर्ष (84 माह)',
    moraNoGrace: 'कोई छूट अवधि नहीं',
    mora3Mo: '3 महीने',
    mora6Mo: '6 महीने',
    mora12Mo: '12 महीने',
    subventionApplied: 'सरकारी ब्याज अनुदान लागू:',
    subventionDesc: 'प्रभावी ब्याज दर घटकर',
    toText: 'से',
    paText: 'वार्षिक हो गई',
    estMonthlyRepayment: 'अनुमानित मासिक पुनर्भुगतान (EMI)',
    perMonth: '/ माह',
    capitalDist: 'पूंजी वितरण',
    totalCostText: 'कुल लागत',
    ownMargin: 'मार्जिन:',
    govtSubsidyLabel: 'सब्सिडी:',
    bankLoanLabel: 'बैंक ऋण:',
    totalInterestPayable: 'कुल देय ब्याज:',
    totalOutflow: 'कुल भुगतान (मूलधन + ब्याज):',
    subventionSavings: 'सरकारी अनुदान से बचत:',
    interestSavedSuffix: 'ब्याज की बचत',
    amortTitle: 'वर्ष-दर-वर्ष परिशोधन (Amortization) मार्ग:',
    thYear: 'वर्ष',
    thPrincipal: 'मूलधन',
    thInterest: 'ब्याज',
    thBalance: 'शेष राशि',
    yrPrefix: 'वर्ष'
  },
  pa: {
    badge: 'ਸਕੀਮ-ਅਧਾਰਤ ਬੈਂਕਿੰਗ ਗਣਿਤ',
    title: 'ਸਕੀਮ-ਅਧਾਰਤ ਵਿੱਤੀ ਕੈਲਕੁਲੇਟਰ',
    subtitle: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਬੈਂਕ ਮੁਲਾਂਕਣ, ਪੂੰਜੀਗਤ ਸਬਸਿਡੀ, ਵਿਆਜ ਛੋਟ ਅਤੇ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤਾਂ (EMI) ਦੀ ਸਹੀ ਗਣਨਾ ਕਰੋ।',
    transferBtn: 'ਬੈਂਕ ਡੀ.ਪੀ.ਆਰ. ਵਿੱਚ ਤਬਦੀਲ ਕਰੋ',
    presetLabel: 'ਰਿਆਇਤੀ ਸਕੀਮ ਨਿਯਮ ਚੁਣੋ:',
    presetPmegp: 'PMEGP (ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਰੁਜ਼ਗਾਰ ਉਤਪਾਦਨ ਪ੍ਰੋਗਰਾਮ)',
    presetStandup: 'ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ (SC/ST ਅਤੇ ਮਹਿਲਾ ਉੱਦਮੀ)',
    presetNsfdc: 'NSFDC ਮਿਆਦੀ ਕਰਜ਼ਾ (SC ਉੱਦਮੀਆਂ ਲਈ ਰਿਆਇਤੀ)',
    presetMudra: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਮੁਦਰਾ ਯੋਜਨਾ (ਤਰੁਣ ਸ਼੍ਰੇਣੀ)',
    presetSvanidhi: 'ਪੀ.ਐੱਮ. ਸਵਨਿਧੀ (7% ਵਿਆਜ ਸਬਵੈਂਸ਼ਨ ਨਾਲ ਮਾਈਕ੍ਰੋ-ਕ੍ਰੈਡਿਟ)',
    presetCustom: 'ਕਸਟਮ ਪੈਰਾਮੀਟਰ ਗਣਨਾ',
    totalProjectCost: 'ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ',
    promoterContribution: 'ਪ੍ਰਮੋਟਰ ਯੋਗਦਾਨ (ਮਾਰਜਿਨ ਮਨੀ)',
    govtSubsidyRate: 'ਸਰਕਾਰੀ ਪੂੰਜੀ ਸਬਸਿਡੀ ਦਰ',
    bankInterestRate: 'ਬੈਂਕ ਵਿਆਜ (% ਸਾਲਾਨਾ)',
    tenureYears: 'ਮਿਆਦ (ਸਾਲ)',
    moratoriumMonths: 'ਮੋਰਟੋਰੀਅਮ (ਮਹੀਨੇ)',
    tenure1Yr: '1 ਸਾਲ (12 ਮਹੀਨੇ)',
    tenure3Yr: '3 ਸਾਲ (36 ਮਹੀਨੇ)',
    tenure5Yr: '5 ਸਾਲ (60 ਮਹੀਨੇ)',
    tenure7Yr: '7 ਸਾਲ (84 ਮਹੀਨੇ)',
    moraNoGrace: 'ਕੋਈ ਛੋਟ ਮਿਆਦ ਨਹੀਂ',
    mora3Mo: '3 ਮਹੀਨੇ',
    mora6Mo: '6 ਮਹੀਨੇ',
    mora12Mo: '12 ਮਹੀਨੇ',
    subventionApplied: 'ਸਰਕਾਰੀ ਵਿਆਜ ਸਬਵੈਂਸ਼ਨ ਲਾਗੂ:',
    subventionDesc: 'ਅਸਰਦਾਰ ਵਿਆਜ ਦਰ ਘਟ ਕੇ',
    toText: 'ਤੋਂ',
    paText: 'ਸਾਲਾਨਾ ਰਹਿ ਗਈ',
    estMonthlyRepayment: 'ਅਨੁਮਾਨਿਤ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI)',
    perMonth: '/ ਮਹੀਨਾ',
    capitalDist: 'ਪੂੰਜੀ ਵੰਡ',
    totalCostText: 'ਕੁੱਲ ਲਾਗਤ',
    ownMargin: 'ਮਾਰਜਿਨ:',
    govtSubsidyLabel: 'ਸਬਸਿਡੀ:',
    bankLoanLabel: 'ਬੈਂਕ ਲੋਨ:',
    totalInterestPayable: 'ਕੁੱਲ ਦੇਣਯੋਗ ਵਿਆਜ:',
    totalOutflow: 'ਕੁੱਲ ਭੁਗਤਾਨ (ਮੂਲ + ਵਿਆਜ):',
    subventionSavings: 'ਸਰਕਾਰੀ ਸਬਵੈਂਸ਼ਨ ਬੱਚਤ:',
    interestSavedSuffix: 'ਵਿਆਜ ਦੀ ਬੱਚਤ',
    amortTitle: 'ਸਾਲ-ਦਰ-ਸਾਲ ਅਮੋਰਟਾਈਜ਼ੇਸ਼ਨ ਟ੍ਰੈਜੈਕਟਰੀ:',
    thYear: 'ਸਾਲ',
    thPrincipal: 'ਮੂਲਧਨ',
    thInterest: 'ਵਿਆਜ',
    thBalance: 'ਬਾਕੀ ਰਕਮ',
    yrPrefix: 'ਸਾਲ'
  },
  te: {
    badge: 'స్కీమ్-ఆధారిత బ్యాంకింగ్ గణితం',
    title: 'స్కీమ్-ఆధారిత ఆర్థిక కాలిక్యులేటర్',
    subtitle: 'బ్యాంక్ మదింపు సూచికలు, క్యాపిటల్ సబ్సిడీ, వడ్డీ రాయితీలు మరియు నెలవారీ EMIలను ఖచ్చితమైన ప్రభుత్వ నిబంధనల ప్రకారం లెక్కిస్తుంది.',
    transferBtn: 'బ్యాంక్ DPR కి బదిలీ చేయండి',
    presetLabel: 'రాయితీ పథకం నిబంధనలను ఎంచుకోండి:',
    presetPmegp: 'PMEGP (ప్రధాన మంత్రి ఉపాధి కల్పన కార్యక్రమం)',
    presetStandup: 'స్టాండప్ ఇండియా (SC/ST & మహిళా గ్రీన్‌ఫీల్డ్స్)',
    presetNsfdc: 'NSFDC టర్మ్ లోన్ (SC వ్యవస్థాపకులకు రాయితీ)',
    presetMudra: 'పీఎం ముద్రా యోజన (తరుణ్ వర్గం)',
    presetSvanidhi: 'పీఎం స్వనిధి (7% వడ్డీ రాయితీతో మైక్రో-క్రెడిట్)',
    presetCustom: 'కస్టమ్ పారామీటర్ లెక్కింపు',
    totalProjectCost: 'మొత్తం ప్రాజెక్ట్ ఖర్చు',
    promoterContribution: 'ప్రమోటర్ వాటా (మార్జిన్ మనీ)',
    govtSubsidyRate: 'ప్రభుత్వ మూలధన సబ్సిడీ రేటు',
    bankInterestRate: 'బ్యాంక్ వడ్డీ (% వార్షికం)',
    tenureYears: 'వ్యవధి (సంవత్సరాలు)',
    moratoriumMonths: 'మొరటోరియం (నెలలు)',
    tenure1Yr: '1 సంవత్సరం (12 నెలలు)',
    tenure3Yr: '3 సంవత్సరాలు (36 నెలలు)',
    tenure5Yr: '5 సంవత్సరాలు (60 నెలలు)',
    tenure7Yr: '7 సంవత్సరాలు (84 నెలలు)',
    moraNoGrace: 'గ్రేస్ పీరియడ్ లేదు',
    mora3Mo: '3 నెలలు',
    mora6Mo: '6 నెలలు',
    mora12Mo: '12 నెలలు',
    subventionApplied: 'ప్రభుత్వ వడ్డీ రాయితీ వర్తించబడింది:',
    subventionDesc: 'సమర్థవంతమైన వడ్డీ రేటు',
    toText: 'నుండి',
    paText: 'వార్షికానికి తగ్గింది',
    estMonthlyRepayment: 'అంచనా వేసిన నెలవారీ తిరిగి చెల్లింపు (EMI)',
    perMonth: '/ నెల',
    capitalDist: 'మూలధన పంపిణీ',
    totalCostText: 'మొత్తం ఖర్చు',
    ownMargin: 'మార్జిన్:',
    govtSubsidyLabel: 'సబ్సిడీ:',
    bankLoanLabel: 'బ్యాంక్ రుణం:',
    totalInterestPayable: 'చెల్లించాల్సిన మొత్తం వడ్డీ:',
    totalOutflow: 'మొత్తం చెల్లింపు (అసలు + వడ్డీ):',
    subventionSavings: 'ప్రభుత్వ రాయితీ ఆదా:',
    interestSavedSuffix: 'వడ్డీ ఆదా అయింది',
    amortTitle: 'సంవత్సరాల వారీగా రుణ విమోచన పట్టిక:',
    thYear: 'సంవత్సరం',
    thPrincipal: 'అసలు',
    thInterest: 'వడ్డీ',
    thBalance: 'మిగిలిన నిల్వ',
    yrPrefix: 'సం'
  },
  mr: {
    badge: 'योजना-आधारित बँकिंग गणित',
    title: 'योजना-आधारित वित्तीय कॅल्क्युलेटर',
    subtitle: 'शासकीय योजनेच्या अचूक मार्गदर्शक तत्त्वांनुसार बँक मूल्यांकन मेट्रिक्स, भांडवली सबसिडी, व्याज सवलत आणि मासिक हप्त्याची (EMI) अचूक गणना करा.',
    transferBtn: 'बँक DPR मध्ये हस्तांतरित करा',
    presetLabel: 'सवलतीच्या योजनांचे नियम निवडा:',
    presetPmegp: 'PMEGP (पंतप्रधान रोजगार निर्मिती कार्यक्रम)',
    presetStandup: 'स्टँड-अप इंडिया (SC/ST आणि महिला ग्रीनफील्ड)',
    presetNsfdc: 'NSFDC मुदत कर्ज (SC उद्योजकांसाठी सवलतीचे)',
    presetMudra: 'पीएम मुद्रा योजना (तरुण प्रवर्ग)',
    presetSvanidhi: 'पीएम स्वनिधी (7% व्याज सवलतीसह सूक्ष्म कर्ज)',
    presetCustom: 'कस्टम पॅरामीटर गणना',
    totalProjectCost: 'एकूण प्रकल्प खर्च',
    promoterContribution: 'प्रवर्तकाचे योगदान (मार्जिन मनी)',
    govtSubsidyRate: 'शासकीय भांडवली सबसिडी दर',
    bankInterestRate: 'बँक व्याज (% वार्षिक)',
    tenureYears: 'कालावधी (वर्षे)',
    moratoriumMonths: 'मोरेटोरियम (महिने)',
    tenure1Yr: '1 वर्ष (12 महिने)',
    tenure3Yr: '3 वर्षे (36 महिने)',
    tenure5Yr: '5 वर्षे (60 महिने)',
    tenure7Yr: '7 वर्षे (84 महिने)',
    moraNoGrace: 'सूट कालावधी नाही',
    mora3Mo: '3 महिने',
    mora6Mo: '6 महिने',
    mora12Mo: '12 महिने',
    subventionApplied: 'शासकीय व्याज सवलत लागू:',
    subventionDesc: 'प्रभावी व्याज दर',
    toText: 'वरून',
    paText: 'वार्षिक झाला',
    estMonthlyRepayment: 'अंदाजे मासिक हप्ता (EMI)',
    perMonth: '/ महिना',
    capitalDist: 'भांडवल वितरण',
    totalCostText: 'एकूण खर्च',
    ownMargin: 'मार्जिन:',
    govtSubsidyLabel: 'सबसिडी:',
    bankLoanLabel: 'बँक कर्ज:',
    totalInterestPayable: 'एकूण देय व्याज:',
    totalOutflow: 'एकूण परतावा (मुद्दल + व्याज):',
    subventionSavings: 'सरकारी सवलतीमुळे बचत:',
    interestSavedSuffix: 'व्याज बचत',
    amortTitle: 'वर्षनिहाय परतफेड तपशील (Amortization):',
    thYear: 'वर्ष',
    thPrincipal: 'मुद्दल',
    thInterest: 'व्याज',
    thBalance: 'शिल्लक',
    yrPrefix: 'वर्ष'
  },
  bn: {
    badge: 'স্কিম-সচেতন ব্যাংকিং হিসাব',
    title: 'স্কিম-সচেতন আর্থিক ক্যালকুলেটর',
    subtitle: 'সুনির্দিষ্ট সরকারি স্কিম নির্দেশিকা অনুযায়ী ব্যাংক মূল্যায়ন মেট্রিক্স, মূলধন ভর্তুকি, সুদের অনুদান এবং মাসিক ইএমআই নির্ভুলভাবে গণনা করুন।',
    transferBtn: 'ব্যাংক ডিপিআরে স্থানান্তর করুন',
    presetLabel: 'সুবিধাজনক স্কিম নিয়ম নির্বাচন করুন:',
    presetPmegp: 'PMEGP (প্রধানমন্ত্রীর কর্মসংস্থান সৃষ্টি কর্মসূচি)',
    presetStandup: 'স্ট্যান্ড-আপ ইন্ডিয়া (SC/ST এবং মহিলা উদ্যোক্তা)',
    presetNsfdc: 'NSFDC মেয়াদী ঋণ (SC উদ্যোক্তাদের জন্য সুবিধাজনক)',
    presetMudra: 'প্রধানমন্ত্রী মুদ্রা যোজনা (তরুণ বিভাগ)',
    presetSvanidhi: 'পিএম স্বনিধি (৭% সুদ ভর্তুকি সহ ক্ষুদ্র ঋণ)',
    presetCustom: 'কাস্টম প্যারামিটার গণনা',
    totalProjectCost: 'মোট প্রকল্প ব্যয়',
    promoterContribution: 'প্রবর্তকের নিজস্ব মূলধন (মার্জিন মানি)',
    govtSubsidyRate: 'সরকারি মূলধন ভর্তুকি হার',
    bankInterestRate: 'ব্যাংক সুদ (% বার্ষিক)',
    tenureYears: 'মেয়াদ (বছর)',
    moratoriumMonths: 'গ্রেস পিরিয়ড / মোরেটোরিয়াম (মাস)',
    tenure1Yr: '১ বছর (১২ মাস)',
    tenure3Yr: '৩ বছর (৩৬ মাস)',
    tenure5Yr: '৫ বছর (৬০ মাস)',
    tenure7Yr: '৭ বছর (৮৪ মাস)',
    moraNoGrace: 'কোনো গ্রেস পিরিয়ড নেই',
    mora3Mo: '৩ মাস',
    mora6Mo: '৬ মাস',
    mora12Mo: '১২ মাস',
    subventionApplied: 'সরকারি সুদের অনুদান প্রয়োগ করা হয়েছে:',
    subventionDesc: 'কার্যকর সুদের হার কমে',
    toText: 'থেকে',
    paText: 'বার্ষিক হয়েছে',
    estMonthlyRepayment: 'আনুমানিক মাসিক পরিশোধ (EMI)',
    perMonth: '/ মাস',
    capitalDist: 'মূলধন বণ্টন',
    totalCostText: 'মোট ব্যয়',
    ownMargin: 'মার্জিন:',
    govtSubsidyLabel: 'ভর্তুকি:',
    bankLoanLabel: 'ব্যাংক ঋণ:',
    totalInterestPayable: 'মোট প্রদেয় সুদ:',
    totalOutflow: 'মোট বহিঃপ্রবাহ (আসল + সুদ):',
    subventionSavings: 'সরকারি ভর্তুকির সঞ্চয়:',
    interestSavedSuffix: 'সুদ সাশ্রয়',
    amortTitle: 'বছরভিত্তিক পরিশোধের গতিপথ:',
    thYear: 'বছর',
    thPrincipal: 'আসল পরিশোধ',
    thInterest: 'সুদ পরিশোধ',
    thBalance: 'অবশিষ্ট ঋণ',
    yrPrefix: 'বছর'
  }
};

export const FinancialCalculator: React.FC = () => {
  const { profile, setActiveTab } = useProfile();
  const { language } = useLanguage();
  const t = (key: string) => CALC_LABELS[language]?.[key] || CALC_LABELS.en[key] || key;

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pmegp');
  const [projectCost, setProjectCost] = useState<number>(profile.totalProjectCost || 300000);
  const [promoterContributionPercent, setPromoterContributionPercent] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [interestSubvention, setInterestSubvention] = useState<number>(0);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6);
  const [subsidyRatePercent, setSubsidyRatePercent] = useState<number>(35);

  // Sync with preset when scheme selection changes
  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    const preset = SCHEME_PRESETS.find(p => p.id === schemeId);
    if (preset) {
      setInterestRate(preset.interestRate);
      setInterestSubvention(preset.interestSubvention);
      setPromoterContributionPercent(preset.promoterContributionMin);
      setTenureYears(preset.defaultTenureYears);
      setMoratoriumMonths(preset.defaultMoratoriumMonths);
      setSubsidyRatePercent(preset.maxSubsidyPercent);
    }
  };

  // Financial Computations
  const ownContributionAmount = Math.round(projectCost * (promoterContributionPercent / 100));
  const rawBankLoan = projectCost - ownContributionAmount;
  
  // Subsidy calculation
  const calculatedSubsidy = Math.round(projectCost * (subsidyRatePercent / 100));
  const preset = SCHEME_PRESETS.find(p => p.id === selectedSchemeId);
  const eligibleSubsidy = preset && preset.maxSubsidyAmount > 0 
    ? Math.min(calculatedSubsidy, preset.maxSubsidyAmount)
    : calculatedSubsidy;

  // Net loan upon which interest is serviced (under capital subsidy back-ended model or principal deduction)
  const netLoanLiability = Math.max(1000, rawBankLoan - eligibleSubsidy);

  // Effective interest rate after subvention
  const effectiveAnnualRate = Math.max(0.01, (interestRate - interestSubvention) / 100);
  const monthlyRate = effectiveAnnualRate / 12;
  const totalMonths = tenureYears * 12;
  const repaymentMonths = Math.max(1, totalMonths - moratoriumMonths);

  // Standard amortized EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyEmi = Math.round(
    (netLoanLiability * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
  );

  const totalRepaymentAmount = (monthlyEmi * repaymentMonths) + ownContributionAmount;
  const totalInterestPayable = Math.max(0, (monthlyEmi * repaymentMonths) - netLoanLiability);
  const subventionSavings = Math.round((netLoanLiability * (interestSubvention / 100)) * tenureYears);

  // Year-by-year schedule preview
  const generateAmortizationSchedule = () => {
    let balance = netLoanLiability;
    const schedule = [];
    const annualPayment = monthlyEmi * 12;

    for (let yr = 1; yr <= tenureYears; yr++) {
      const interestForYear = Math.round(balance * effectiveAnnualRate);
      const principalForYear = Math.min(balance, annualPayment - interestForYear);
      balance = Math.max(0, balance - principalForYear);

      schedule.push({
        year: yr,
        openingBalance: balance + principalForYear,
        principalPaid: principalForYear,
        interestPaid: interestForYear,
        closingBalance: balance
      });
      if (balance <= 0) break;
    }
    return schedule;
  };

  const schedule = generateAmortizationSchedule();

  return (
    <div className="financial-calculator-container" style={{ padding: '8px 0' }}>
      {/* Institutional Financial Terminal Header */}
      <div className="tactile-card-3d" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                <ShieldCheck size={12} />
                <span>{t('badge')}</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                BANK APPRAISAL ENGINE
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              {t('subtitle')}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('dpr')}
            className="tactile-btn-primary-3d"
            style={{
              padding: '10px 18px',
              fontSize: '0.86rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={16} />
            <span>{t('transferBtn')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Column + Output Column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr)', gap: '24px' }}>
        
        {/* Left Column: Form & Sliders */}
        <div className="tactile-card-3d" style={{ padding: '24px' }}>
          
          {/* Preset Scheme Selector */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              {t('presetLabel')}
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => handleSchemeChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.88rem',
                borderRadius: '9px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)'
              }}
            >
              {SCHEME_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {t(p.nameKey)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Project Cost Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('totalProjectCost')}
                </label>
                <strong style={{ color: '#4F46E5', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                  ₹{projectCost.toLocaleString('en-IN')}
                </strong>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={50000}
                max={5000000}
                step={25000}
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Promoter Margin Money % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('promoterContribution')}
                </label>
                <strong style={{ color: '#F59E0B', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                  {promoterContributionPercent}% (₹{ownContributionAmount.toLocaleString('en-IN')})
                </strong>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={5}
                max={40}
                step={1}
                value={promoterContributionPercent}
                onChange={(e) => setPromoterContributionPercent(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Subsidy Rate % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('govtSubsidyRate')}
                </label>
                <strong style={{ color: '#10B981', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                  {subsidyRatePercent}% (₹{eligibleSubsidy.toLocaleString('en-IN')})
                </strong>
              </div>
              <input
                type="range"
                className="tactile-slider-3d"
                min={0}
                max={35}
                step={5}
                value={subsidyRatePercent}
                onChange={(e) => setSubsidyRatePercent(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Grid of Interest Rate, Tenure, Moratorium */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('bankInterestRate')}
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.86rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('tenureYears')}
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.86rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                >
                  <option value={1}>{t('tenure1Yr')}</option>
                  <option value={3}>{t('tenure3Yr')}</option>
                  <option value={5}>{t('tenure5Yr')}</option>
                  <option value={7}>{t('tenure7Yr')}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  {t('moratoriumMonths')}
                </label>
                <select
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 10px', fontSize: '0.86rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                >
                  <option value={0}>{t('moraNoGrace')}</option>
                  <option value={3}>{t('mora3Mo')}</option>
                  <option value={6}>{t('mora6Mo')}</option>
                  <option value={12}>{t('mora12Mo')}</option>
                </select>
              </div>
            </div>

            {/* Interest Subvention Notification */}
            {interestSubvention > 0 && (
              <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#059669' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  <strong>{interestSubvention}% {t('subventionApplied')}</strong> {t('subventionDesc')} {interestRate}% {t('toText')} {(interestRate - interestSubvention).toFixed(2)}% {t('paText')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Results Cards & Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Key Metric Card */}
          <div className="tactile-card-3d" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              {t('estMonthlyRepayment')}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0 16px 0' }}>
              <span style={{ fontSize: '2.3rem', fontWeight: 800, color: '#4F46E5', letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t('perMonth')}</span>
            </div>

            {/* Three-Tier Capital Breakdown Bar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{t('capitalDist')}</span>
                <span>₹{projectCost.toLocaleString('en-IN')} {t('totalCostText')}</span>
              </div>
              <div style={{
                width: '100%',
                height: '14px',
                borderRadius: '8px',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
              }}>
                <div 
                  title={`Own Margin: ₹${ownContributionAmount.toLocaleString('en-IN')}`} 
                  style={{ width: `${promoterContributionPercent}%`, background: '#F59E0B' }} 
                />
                <div 
                  title={`Govt Subsidy: ₹${eligibleSubsidy.toLocaleString('en-IN')}`} 
                  style={{ width: `${subsidyRatePercent}%`, background: '#10B981' }} 
                />
                <div 
                  title={`Bank Loan: ₹${netLoanLiability.toLocaleString('en-IN')}`} 
                  style={{ width: `${100 - promoterContributionPercent - subsidyRatePercent}%`, background: '#4F46E5' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', marginTop: '10px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#F59E0B' }} />
                  {t('ownMargin')} ₹{ownContributionAmount.toLocaleString('en-IN')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#10B981' }} />
                  {t('govtSubsidyLabel')} ₹{eligibleSubsidy.toLocaleString('en-IN')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: '#4F46E5' }} />
                  {t('bankLoanLabel')} ₹{netLoanLiability.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Financial Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  {t('totalInterestPayable')}
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{totalInterestPayable.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  {t('totalOutflow')}
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{totalRepaymentAmount.toLocaleString('en-IN')}
                </strong>
              </div>
              {subventionSavings > 0 && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: '#059669', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                    {t('subventionSavings')}
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    +₹{subventionSavings.toLocaleString('en-IN')} {t('interestSavedSuffix')}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* Repayment Schedule Mini Table */}
          <div className="tactile-card-3d" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
              {t('amortTitle')}
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px' }}>{t('thYear')}</th>
                    <th style={{ padding: '6px 8px' }}>{t('thPrincipal')}</th>
                    <th style={{ padding: '6px 8px' }}>{t('thInterest')}</th>
                    <th style={{ padding: '6px 8px' }}>{t('thBalance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 5).map((row) => (
                    <tr key={row.year} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '7px 8px', fontWeight: 700 }}>{t('yrPrefix')} {row.year}</td>
                      <td style={{ padding: '7px 8px', color: '#4F46E5' }}>₹{row.principalPaid.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '7px 8px', color: 'var(--text-muted)' }}>₹{row.interestPaid.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '7px 8px', fontWeight: 700 }}>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FinancialCalculator;
