import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  HelpCircle,
  Clock,
  Award,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

interface EligibilityGap {
  id: string;
  title: string;
  description: string;
  impactScore: number;
  subsidyUnlock: number;
  actionLabel: string;
  actionTab?: 'documents' | 'dpr' | 'profile' | 'whatif';
  externalUrl?: string;
  difficulty: string;
  isCompleted: boolean;
}

const GAP_LABELS: Record<string, Record<string, string>> = {
  en: {
    badge: 'Explainable AI Diagnostics',
    title: 'Eligibility Gap Analyzer',
    subtitle: 'Identifies exact missing criteria, documentation bottlenecks, and structural discrepancies between your profile and target government credit schemes — with clear, actionable remediation steps.',
    currentScore: 'Current Score',
    potentialScore: 'Potential Score',
    selectScheme: 'Select Target Scheme to Diagnose:',
    identifiedGaps: 'Identified Gaps for',
    sortedBy: 'Sorted by Subsidy Impact',
    matchScoreSuffix: 'Match Score',
    unlocks: 'Unlocks',
    subsidy: 'Subsidy',
    impactSummaryTitle: 'Remediation Impact Summary',
    impactSummaryDescPre: 'Resolving the',
    impactSummaryDescPost: 'pending items on this scheme will elevate your sanction probability from conditional to pre-approved.',
    additionalSubsidy: 'Additional Subsidy to Unlock:',
    targetFit: 'Target Match Confidence:',
    highFit: 'High Fit',
    estTime: 'Estimated Time to Clear:',
    estTimeVal: '~2-3 Business Days',
    eligibilityProgress: 'Eligibility Progress',
    of: 'of',
    inspectFull: 'Inspect Scheme Full Guidelines',
    advisoryTitle: 'Bank Appraisal Advisory',
    advisoryDesc: 'Under Ministry guidelines, applications with completed Udyam Registration and a 3-year projected Debt Service Coverage Ratio (DSCR) above 1.5 receive priority sanction from Public Sector Banks within 14 days.',
    quick: 'Quick (5 mins)',
    medium: 'Medium (1-2 days)',
    actionReq: 'Action Required',
    gapUdyamTitle: 'Missing Udyam MSME Registration',
    gapUdyamDesc: 'Government portals require Udyam MSME Registration to qualify for credit-linked capital subsidies and priority sector lending.',
    gapUdyamAction: 'Register on Udyam Portal (Free)',
    gapDprTitle: 'No Detailed Project Report (DPR) Attached',
    gapDprDesc: 'Banks require a compliant 3-year projected balance sheet, cash flow statement, and DSCR analysis for loan sanction.',
    gapDprAction: 'Generate Free Bank-Ready DPR',
    gapMarginTitle: 'Promoter Contribution Below Required Minimum',
    gapMarginDesc: 'Increase your margin equity contribution to meet bank appraisal guidelines.',
    gapMarginAction: 'Simulate Contribution in What-If',
    gapCasteTitle: 'Official Caste / Category Certificate Not Uploaded',
    gapCasteDesc: 'Required to claim the 35% special category capital subsidy and concessional 4-6% interest rate under this scheme.',
    gapCasteAction: 'Upload Caste Certificate',
    gapSkillTitle: 'EDP / Skill Development Certificate Not Linked',
    gapSkillDesc: 'Mandatory 10-day Entrepreneurship Development Programme (EDP) training or PMKVY certificate expedites loan disbursement.',
    gapSkillAction: 'Enroll in Free e-EDP Training',
    gapNoneTitle: 'All Primary Eligibility Criteria Satisfied!',
    gapNoneDesc: 'Your profile satisfies all core prerequisites for this scheme. You can proceed directly to bank branch submission.',
    gapNoneAction: 'View Application Roadmap'
  },
  hi: {
    badge: 'व्याख्यात्मक AI निदान',
    title: 'पात्रता अंतर विश्लेषक',
    subtitle: 'आपकी प्रोफ़ाइल और लक्षित सरकारी ऋण योजनाओं के बीच छूटे हुए मानदंड, दस्तावेज़ की कमियां और विसंगतियों की पहचान करता है — स्पष्ट सुधारात्मक कदमों के साथ।',
    currentScore: 'वर्तमान स्कोर',
    potentialScore: 'संभावित स्कोर',
    selectScheme: 'निदान के लिए लक्षित योजना चुनें:',
    identifiedGaps: 'पहचाने गए अंतर',
    sortedBy: 'सब्सिडी प्रभाव के अनुसार क्रमबद्ध',
    matchScoreSuffix: 'मिलान स्कोर',
    unlocks: 'अनलॉक',
    subsidy: 'सब्सिडी',
    impactSummaryTitle: 'सुधार प्रभाव सारांश',
    impactSummaryDescPre: 'इस योजना पर',
    impactSummaryDescPost: 'लंबित मदों का समाधान करने से आपकी स्वीकृति संभावना सशर्त से पूर्व-स्वीकृत हो जाएगी।',
    additionalSubsidy: 'अनलॉक होने वाली अतिरिक्त सब्सिडी:',
    targetFit: 'लक्षित मिलान विश्वास:',
    highFit: 'उच्च उपयुक्तता',
    estTime: 'अनुमानित समाधान समय:',
    estTimeVal: '~२-३ कार्य दिवस',
    eligibilityProgress: 'पात्रता प्रगति',
    of: 'का',
    inspectFull: 'योजना के पूर्ण दिशानिर्देश देखें',
    advisoryTitle: 'बैंक मूल्यांकन परामर्श',
    advisoryDesc: 'मंत्रालय के दिशानिर्देशों के तहत, पूर्ण उद्यम पंजीकरण और १.५ से अधिक ३-वर्षीय अनुमानित DSCR वाले आवेदनों को सार्वजनिक क्षेत्र के बैंकों द्वारा १४ दिनों के भीतर प्राथमिकता से ऋण मिलता है।',
    quick: 'शीघ्र (५ मिनट)',
    medium: 'मध्यम (१-२ दिन)',
    actionReq: 'कार्रवाई आवश्यक',
    gapUdyamTitle: 'उद्यम MSME पंजीकरण गायब है',
    gapUdyamDesc: 'ऋण-लिंक्ड पूंजी सब्सिडी और प्राथमिकता क्षेत्र ऋण के लिए सरकारी पोर्टलों पर उद्यम पंजीकरण अनिवार्य है।',
    gapUdyamAction: 'उद्यम पोर्टल पर पंजीकरण करें (मुफ्त)',
    gapDprTitle: 'विस्तृत परियोजना रिपोर्ट (DPR) संलग्न नहीं है',
    gapDprDesc: 'ऋण स्वीकृति के लिए बैंकों को ३-वर्षीय अनुमानित बैलेंस शीट, नकदी प्रवाह विवरण और DSCR विश्लेषण की आवश्यकता होती है।',
    gapDprAction: 'मुफ्त बैंक-रेडी DPR बनाएं',
    gapMarginTitle: 'प्रमोटर योगदान आवश्यक न्यूनतम से कम है',
    gapMarginDesc: 'बैंक मूल्यांकन दिशानिर्देशों को पूरा करने के लिए अपना मार्जिन अंशदान बढ़ाएं।',
    gapMarginAction: 'क्या-अगर में अंशदान सिमुलेट करें',
    gapCasteTitle: 'आधिकारिक जाति / श्रेणी प्रमाण पत्र अपलोड नहीं है',
    gapCasteDesc: 'इस योजना के तहत ३५% विशेष श्रेणी सब्सिडी और रियायती ४-६% ब्याज दर का दावा करने के लिए आवश्यक है।',
    gapCasteAction: 'जाति प्रमाण पत्र अपलोड करें',
    gapSkillTitle: 'EDP / कौशल विकास प्रमाण पत्र लिंक नहीं है',
    gapSkillDesc: '१० दिवसीय उद्यमिता विकास कार्यक्रम (EDP) या PMKVY प्रमाण पत्र ऋण संवितरण में तेजी लाता है।',
    gapSkillAction: 'मुफ्त e-EDP में दाखिला लें',
    gapNoneTitle: 'सभी प्राथमिक पात्रता मानदंड पूर्ण हैं!',
    gapNoneDesc: 'आपकी प्रोफ़ाइल इस योजना की सभी शर्तों को पूरा करती है। आप सीधे बैंक शाखा में आवेदन कर सकते हैं।',
    gapNoneAction: 'आवेदन रोडमैप देखें'
  },
  pa: {
    badge: 'ਵਿਆਖਿਆਤਮਕ AI ਨਿਦਾਨ',
    title: 'ਯੋਗਤਾ ਘਾਟ ਵਿਸ਼ਲੇਸ਼ਕ',
    subtitle: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸਰਕਾਰੀ ਕਰਜ਼ਾ ਸਕੀਮਾਂ ਵਿਚਕਾਰ ਘਾਟਾਂ, ਦਸਤਾਵੇਜ਼ਾਂ ਦੀਆਂ ਕਮੀਆਂ ਅਤੇ ਅਸਮਾਨਤਾਵਾਂ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ — ਸਪੱਸ਼ਟ ਸੁਧਾਰਾਤਮਕ ਕਦਮਾਂ ਦੇ ਨਾਲ.',
    currentScore: 'ਮੌਜੂਦਾ ਸਕੋਰ',
    potentialScore: 'ਸੰਭਾਵੀ ਸਕੋਰ',
    selectScheme: 'ਜਾਂਚ ਲਈ ਸਕੀਮ ਚੁਣੋ:',
    identifiedGaps: 'ਲੱਭੀਆਂ ਗਈਆਂ ਘਾਟਾਂ',
    sortedBy: 'ਸਬਸਿਡੀ ਪ੍ਰਭਾਵ ਅਨੁਸਾਰ',
    matchScoreSuffix: 'ਮੇਲ ਸਕੋਰ',
    unlocks: 'ਅਨਲੌਕ',
    subsidy: 'ਸਬਸਿਡੀ',
    impactSummaryTitle: 'ਸੁਧਾਰ ਪ੍ਰਭਾਵ ਸਾਰ',
    impactSummaryDescPre: 'ਇਸ ਸਕੀਮ ਉੱਤੇ',
    impactSummaryDescPost: 'ਬਕਾਇਆ ਕਮੀਆਂ ਨੂੰ ਹੱਲ ਕਰਨ ਨਾਲ ਤੁਹਾਡੀ ਕਰਜ਼ਾ ਮਨਜ਼ੂਰੀ ਦੀ ਸੰਭਾਵਨਾ ਵਧ ਜਾਵੇਗੀ।',
    additionalSubsidy: 'ਅਨਲੌਕ ਹੋਣ ਵਾਲੀ ਵਾਧੂ ਸਬਸਿਡੀ:',
    targetFit: 'ਟੀਚਾ ਮੇਲ ਭਰੋਸਾ:',
    highFit: 'ਉੱਚ ਮੇਲ',
    estTime: 'ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ:',
    estTimeVal: '~2-3 ਕੰਮਕਾਜੀ ਦਿਨ',
    eligibilityProgress: 'ਯੋਗਤਾ ਤਰੱਕੀ',
    of: 'ਵਿੱਚੋਂ',
    inspectFull: 'ਸਕੀਮ ਦੇ ਪੂਰੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਵੇਖੋ',
    advisoryTitle: 'ਬੈਂਕ ਮੁਲਾਂਕਣ ਸਲਾਹ',
    advisoryDesc: 'ਮੰਤਰਾਲੇ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ, ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ 1.5 ਤੋਂ ਵੱਧ DSCR ਵਾਲੀਆਂ ਅਰਜ਼ੀਆਂ ਨੂੰ ਸਰਕਾਰੀ ਬੈਂਕਾਂ ਤੋਂ 14 ਦਿਨਾਂ ਵਿੱਚ ਤਰਜੀਹੀ ਕਰਜ਼ਾ ਮਿਲਦਾ ਹੈ।',
    quick: 'ਤੇਜ਼ (5 ਮਿੰਟ)',
    medium: 'ਦਰਮਿਆਨਾ (1-2 ਦਿਨ)',
    actionReq: 'ਕਾਰਵਾਈ ਦੀ ਲੋੜ',
    gapUdyamTitle: 'ਉਦਯਮ MSME ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਗੁੰਮ ਹੈ',
    gapUdyamDesc: 'ਕਰਜ਼ਾ ਸਬਸਿਡੀ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦਾ ਲਾਭ ਲੈਣ ਲਈ ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਾਜ਼ਮੀ ਹੈ।',
    gapUdyamAction: 'ਉਦਯਮ ਪੋਰਟਲ \'ਤੇ ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ',
    gapDprTitle: 'ਕੋਈ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ (DPR) ਨਹੀਂ ਹੈ',
    gapDprDesc: 'ਬੈਂਕ ਕਰਜ਼ੇ ਲਈ 3-ਸਾਲਾ ਬੈਲੰਸ ਸ਼ੀਟ ਅਤੇ DSCR ਵਿਸ਼ਲੇਸ਼ਣ ਵਾਲੀ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ ਮੰਗਦੇ ਹਨ।',
    gapDprAction: 'ਮੁਫ਼ਤ ਬੈਂਕ-ਰੈਡੀ DPR ਬਣਾਓ',
    gapMarginTitle: 'ਪ੍ਰਮੋਟਰ ਹਿੱਸਾ ਲੋੜੀਂਦੀ ਹੱਦ ਤੋਂ ਘੱਟ ਹੈ',
    gapMarginDesc: 'ਬੈਂਕ ਮਨਜ਼ੂਰੀ ਲਈ ਆਪਣਾ ਨਿਵੇਸ਼ ਹਿੱਸਾ ਵਧਾਓ।',
    gapMarginAction: 'ਕੀ-ਜੇ ਸਿਮੂਲੇਟਰ ਵਿੱਚ ਜਾਂਚੋ',
    gapCasteTitle: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ ਅਪਲੋਡ ਨਹੀਂ ਹੈ',
    gapCasteDesc: 'ਇਸ ਸਕੀਮ ਤਹਿਤ 35% ਸਬਸਿਡੀ ਅਤੇ 4-6% ਰਿਆਇਤੀ ਵਿਆਜ ਲਈ ਸਰਟੀਫਿਕੇਟ ਜ਼ਰੂਰੀ ਹੈ।',
    gapCasteAction: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ ਅਪਲੋਡ ਕਰੋ',
    gapSkillTitle: 'EDP / ਹੁਨਰ ਸਰਟੀਫਿਕੇਟ ਲਿੰਕ ਨਹੀਂ ਹੈ',
    gapSkillDesc: '10 ਦਿਨਾਂ ਦੀ EDP ਸਿਖਲਾਈ ਜਾਂ PMKVY ਸਰਟੀਫਿਕੇਟ ਕਰਜ਼ਾ ਜਲਦੀ ਜਾਰੀ ਕਰਵਾਉਂਦਾ ਹੈ।',
    gapSkillAction: 'ਮੁਫ਼ਤ e-EDP ਸਿਖਲਾਈ ਲਵੋ',
    gapNoneTitle: 'ਸਾਰੇ ਯੋਗਤਾ ਨਿਯਮ ਪੂਰੇ ਹਨ!',
    gapNoneDesc: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਇਸ ਸਕੀਮ ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ। ਤੁਸੀਂ ਸਿੱਧਾ ਬੈਂਕ ਵਿੱਚ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ।',
    gapNoneAction: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ ਵੇਖੋ'
  },
  te: {
    badge: 'వివరణాత్మక AI నిర్ధారణ',
    title: 'అర్హత లోటు విశ్లేషకం',
    subtitle: 'మీ ప్రొఫైల్ మరియు లక్షిత ప్రభుత్వ రుణ పథకాల మధ్య లోపించిన ప్రమాణాలు, పత్రాల లోపాలు మరియు అంతరాలను గుర్తిస్తుంది.',
    currentScore: 'ప్రస్తుత స్కోరు',
    potentialScore: 'సంభావ్య స్కోరు',
    selectScheme: 'పరిశీలించడానికి పథకాన్ని ఎంచుకోండి:',
    identifiedGaps: 'గుర్తించిన లోపాలు',
    sortedBy: 'సబ్సిడీ ప్రభావం ప్రకారం',
    matchScoreSuffix: 'మ్యాచ్ స్కోరు',
    unlocks: 'అన్‌లాక్ చేస్తుంది',
    subsidy: 'సబ్సిడీ',
    impactSummaryTitle: 'దిద్దుబాటు ప్రభావ సారాంశం',
    impactSummaryDescPre: 'ఈ పథకంలో',
    impactSummaryDescPost: 'పెండింగ్‌లో ఉన్న అంశాలను పరిష్కరించడం వలన మీ రుణం మంజూరయ్యే అవకాశం పెరుగుతుంది.',
    additionalSubsidy: 'అన్‌లాక్ కానున్న అదనపు సబ్సిడీ:',
    targetFit: 'లక్షిత మ్యాచ్ విశ్వాసం:',
    highFit: 'అధిక అమరిక',
    estTime: 'అంచనా సమయం:',
    estTimeVal: '~2-3 పని దినాలు',
    eligibilityProgress: 'అర్హత పురోగతి',
    of: 'లో',
    inspectFull: 'పూర్తి మార్గదర్శకాలు చూడండి',
    advisoryTitle: 'బ్యాంక్ మదింపు సలహా',
    advisoryDesc: 'మంత్రిత్వ శాఖ నిబంధనల ప్రకారం, ఉద్యమ్ నమోదు మరియు 1.5 కన్నా ఎక్కువ DSCR ఉన్న దరఖాస్తులకు 14 రోజుల్లో ప్రాధాన్యత రుణం లభిస్తుంది.',
    quick: 'వేగవంతమైనది (5 నిమి)',
    medium: 'మధ్యస్థం (1-2 రోజులు)',
    actionReq: 'చర్య అవసరం',
    gapUdyamTitle: 'ఉద్యమ్ MSME రిజిస్ట్రేషన్ లేదు',
    gapUdyamDesc: 'సబ్సిడీ మరియు ప్రాధాన్యత రంగ రుణాల కోసం ఉద్యమ్ నమోదు తప్పనిసరి.',
    gapUdyamAction: 'ఉద్యమ్ పోర్టల్‌లో ఉచితంగా నమోదు చేయండి',
    gapDprTitle: 'ప్రాజెక్ట్ నివేదిక (DPR) జతపరచలేదు',
    gapDprDesc: 'బ్యాంకు రుణం కొరకు 3 సంవత్సరాల ఆర్థిక అంచనాలతో కూడిన DPR నివేదిక అవసరం.',
    gapDprAction: 'ఉచిత బ్యాంక్-రెడీ DPR తయారు చేయండి',
    gapMarginTitle: 'స్వంత పెట్టుబడి కనీస పరిమితి కన్నా తక్కువ ఉంది',
    gapMarginDesc: 'బ్యాంక్ నిబంధనలను చేరుకోవడానికి మీ మార్జిన్ పెట్టుబడిని పెంచండి.',
    gapMarginAction: 'ఏమైతే-అయితే లో సిమ్యులేట్ చేయండి',
    gapCasteTitle: 'అధికారిక కుల ధృవీకరణ పత్రం అప్‌లోడ్ చేయలేదు',
    gapCasteDesc: '35% ప్రత్యేక సబ్సిడీ మరియు 4-6% రాయితీ వడ్డీ రేటు పొందడానికి ఇది అవసరం.',
    gapCasteAction: 'కుల ధృవీకరణ పత్రం అప్‌లోడ్ చేయండి',
    gapSkillTitle: 'EDP / నైపుణ్య సర్టిఫికేట్ లింక్ చేయలేదు',
    gapSkillDesc: '10 రోజుల EDP శిక్షణ లేదా PMKVY సర్టిఫికేట్ ఉంటే రుణం త్వరగా అందుతుంది.',
    gapSkillAction: 'ఉచిత e-EDP శిక్షణలో చేరండి',
    gapNoneTitle: 'అన్ని అర్హత నిబంధనలు పూర్తయ్యాయి!',
    gapNoneDesc: 'మీ ప్రొఫైల్ ఈ పథకానికి పూర్తిగా అర్హత కలిగి ఉంది. మీరు నేరుగా దరఖాస్తు చేసుకోవచ్చు.',
    gapNoneAction: 'దరఖాస్తు రోడ్‌మ్యాప్ చూడండి'
  },
  mr: {
    badge: 'स्पष्टीकरणात्मक AI विश्लेषण',
    title: 'पात्रता तफावत विश्लेषक',
    subtitle: 'तुमचे प्रोफाइल आणि सरकारी योजनांमधील त्रुटी, कागदपत्रांमधील उणीवा आणि आवश्यक सुधारणा शोधून काढते.',
    currentScore: 'सध्याचा स्कोअर',
    potentialScore: 'संभाव्य स्कोअर',
    selectScheme: 'तपासणीसाठी योजना निवडा:',
    identifiedGaps: 'शोधलेल्या त्रुटी',
    sortedBy: 'अनुदान प्रभावानुसार',
    matchScoreSuffix: 'मॅच स्कोअर',
    unlocks: 'अनलॉक',
    subsidy: 'अनुदान',
    impactSummaryTitle: 'सुधारणा प्रभाव सारांश',
    impactSummaryDescPre: 'या योजनेतील',
    impactSummaryDescPost: 'प्रलंबित त्रुटी सोडवल्यास तुमची कर्ज मंजुरीची शक्यता वाढेल.',
    additionalSubsidy: 'अनलॉक होणारे अतिरिक्त अनुदान:',
    targetFit: 'विश्वासार्हता:',
    highFit: 'उत्तम योग्यता',
    estTime: 'अंदाजे कालावधी:',
    estTimeVal: '~२-३ कामकाजाचे दिवस',
    eligibilityProgress: 'पात्रता प्रगती',
    of: 'पैकी',
    inspectFull: 'योजनेची संपूर्ण नियमावली पहा',
    advisoryTitle: 'बँक मूल्यांकन सल्ला',
    advisoryDesc: 'उद्यम नोंदणी आणि १.५ पेक्षा जास्त DSCR असलेले अर्ज सार्वजनिक बँकांद्वारे १४ दिवसांत मंजूर केले जातात.',
    quick: 'जलद (५ मिनिटे)',
    medium: 'मध्यम (१-२ दिवस)',
    actionReq: 'कृती आवश्यक',
    gapUdyamTitle: 'उद्यम MSME नोंदणी उपलब्ध नाही',
    gapUdyamDesc: 'भांडवली अनुदान आणि कर्ज योजनांसाठी उद्यम नोंदणी आवश्यक आहे.',
    gapUdyamAction: 'उद्यम पोर्टलवर मोफत नोंदणी करा',
    gapDprTitle: 'प्रकल्प अहवाल (DPR) जोडलेला नाही',
    gapDprDesc: 'कर्ज मंजुरीसाठी ३ वर्षांचा वित्तीय अंदाज असलेला DPR आवश्यक आहे.',
    gapDprAction: 'मोफत बँक-रेडी DPR बनवा',
    gapMarginTitle: 'स्वतःचे भांडवल किमान मर्यादेपेक्षा कमी आहे',
    gapMarginDesc: 'बँक अटी पूर्ण करण्यासाठी तुमचे मार्जिन भांडवल वाढवा.',
    gapMarginAction: 'काय-जर मध्ये तपासा',
    gapCasteTitle: 'जातीचे प्रमाणपत्र अपलोड केलेले नाही',
    gapCasteDesc: '३५% विशेष अनुदान आणि सवलतीचा व्याजदर मिळवण्यासाठी जातीचे प्रमाणपत्र आवश्यक आहे.',
    gapCasteAction: 'जातीचे प्रमाणपत्र अपलोड करा',
    gapSkillTitle: 'EDP / कौशल्य प्रमाणपत्र जोडलेले नाही',
    gapSkillDesc: '१० दिवसांचे EDP प्रशिक्षण किंवा PMKVY प्रमाणपत्र कर्ज वितरणाला गती देते.',
    gapSkillAction: 'मोफत e-EDP मध्ये सहभागी व्हा',
    gapNoneTitle: 'सर्व प्राथमिक पात्रता अटी पूर्ण आहेत!',
    gapNoneDesc: 'तुमचे प्रोफाइल या योजनेच्या सर्व अटी पूर्ण करते. तुम्ही थेट बँकेत अर्ज करू शकता.',
    gapNoneAction: 'अर्ज रोडमॅप पहा'
  },
  bn: {
    badge: 'ব্যাখ্যামূলক AI বিশ্লেষণ',
    title: 'যোগ্যতা ফাঁক বিশ্লেষক',
    subtitle: 'আপনার প্রোফাইল এবং সরকারি ঋণ প্রকল্পের মধ্যে ঘাটতি, নথির ত্রুটি এবং প্রয়োজনীয় সংশোধন চিহ্নিত করে।',
    currentScore: 'বর্তমান স্কোর',
    potentialScore: 'সম্ভাব্য স্কোর',
    selectScheme: 'যাচাইয়ের জন্য প্রকল্প নির্বাচন করুন:',
    identifiedGaps: 'চিহ্নিত ফাঁকসমূহ',
    sortedBy: 'ভর্তুকি প্রভাব অনুযায়ী',
    matchScoreSuffix: 'ম্যাচ স্কোর',
    unlocks: 'আনলক করে',
    subsidy: 'ভর্তুকি',
    impactSummaryTitle: 'উন্নতির প্রভাবের সারসংক্ষেপ',
    impactSummaryDescPre: 'এই প্রকল্পের',
    impactSummaryDescPost: 'বাকি থাকা বিষয়গুলি সমাধান করলে ঋণ অনুমোদনের সম্ভাবনা উল্লেখযোগ্যভাবে বৃদ্ধি পাবে।',
    additionalSubsidy: 'আনলকযোগ্য অতিরিক্ত ভর্তুকি:',
    targetFit: 'লক্ষ্য ম্যাচ আত্মবিশ্বাস:',
    highFit: 'উচ্চ মিল',
    estTime: 'আনুমানিক সময়:',
    estTimeVal: '~২-৩ কার্যদিবস',
    eligibilityProgress: 'যোগ্যতার অগ্রগতি',
    of: 'এর মধ্যে',
    inspectFull: 'প্রকল্পের সম্পূর্ণ নির্দেশিকা দেখুন',
    advisoryTitle: 'ব্যাংক মূল্যায়ন পরামর্শ',
    advisoryDesc: 'উদ্যম নিবন্ধন এবং ১.৫ এর বেশি DSCR থাকা আবেদনগুলি রাষ্ট্রায়ত্ত ব্যাংক থেকে ১৪ দিনের মধ্যে অগ্রাধিকার পায়।',
    quick: 'দ্রুত (৫ মিনিট)',
    medium: 'মাঝারি (১-২ দিন)',
    actionReq: 'পদক্ষেপ প্রয়োজন',
    gapUdyamTitle: 'উদ্যম MSME নিবন্ধন নেই',
    gapUdyamDesc: 'ভর্তুকি ও ঋণ সুবিধার জন্য উদ্যম নিবন্ধন বাধ্যতামূলক।',
    gapUdyamAction: 'উদ্যম পোর্টালে বিনামূল্যে নিবন্ধন করুন',
    gapDprTitle: 'বিস্তারিত প্রকল্প রিপোর্ট (DPR) সংযুক্ত নেই',
    gapDprDesc: 'ব্যাংক ঋণের জন্য ৩ বছরের আর্থিক পূর্বাভাস সম্বলিত DPR প্রয়োজন।',
    gapDprAction: 'বিনামূল্যে ব্যাংক-রেডি DPR তৈরি করুন',
    gapMarginTitle: 'উদ্যোক্তার নিজস্ব অবদান প্রয়োজনীয় নূন্যতমের চেয়ে কম',
    gapMarginDesc: 'ব্যাংক নির্দেশিকা পূরণের জন্য আপনার মূলধন অংশ বৃদ্ধি করুন।',
    gapMarginAction: 'কী-যদি সিমুলেটরে পরীক্ষা করুন',
    gapCasteTitle: 'অফিসিয়াল জাতিগত শংসাপত্র আপলোড করা হয়নি',
    gapCasteDesc: '৩৫% বিশেষ ভর্তুকি এবং ৪-৬% স্বল্প সুদের সুবিধার জন্য এই শংসাপত্র প্রয়োজন।',
    gapCasteAction: 'জাতিগত শংসাপত্র আপলোড করুন',
    gapSkillTitle: 'EDP / দক্ষতা প্রশিক্ষণ শংসাপত্র যুক্ত নেই',
    gapSkillDesc: '১০ দিনের EDP প্রশিক্ষণ বা PMKVY শংসাপত্র ঋণ বিতরণ প্রক্রিয়া দ্রুত করে।',
    gapSkillAction: 'বিনামূল্যে e-EDP প্রশিক্ষণে অংশ নিন',
    gapNoneTitle: 'সমস্ত প্রাথমিক যোগ্যতার শর্ত পূরণ হয়েছে!',
    gapNoneDesc: 'আপনার প্রোফাইল এই প্রকল্পের সমস্ত মূল শর্ত পূরণ করে। আপনি সরাসরি আবেদন করতে পারেন।',
    gapNoneAction: 'আবেদন রোডম্যাপ দেখুন'
  }
};

export const GapAnalyzer: React.FC = () => {
  const { profile, matchResults, otherSchemes, setActiveTab, setSelectedSchemeModal } = useProfile();
  const { language } = useLanguage();
  const l = GAP_LABELS[language] || GAP_LABELS.en;

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    matchResults[0]?.scheme.id || otherSchemes[0]?.scheme.id || 'pmegp'
  );

  const allSchemes = [...matchResults, ...otherSchemes];
  const activeMatch = allSchemes.find((m) => m.scheme.id === selectedSchemeId) || matchResults[0];

  // Derive realistic gaps based on current profile and scheme conditions
  const generateGapsForScheme = (): EligibilityGap[] => {
    const gaps: EligibilityGap[] = [];

    // 1. Udyam Registration Gap
    if (!profile.hasExistingUdyam) {
      gaps.push({
        id: 'gap-udyam',
        title: l.gapUdyamTitle,
        description: l.gapUdyamDesc,
        impactScore: 18,
        subsidyUnlock: 75000,
        actionLabel: l.gapUdyamAction,
        externalUrl: 'https://udyamregistration.gov.in',
        difficulty: l.quick,
        isCompleted: false
      });
    }

    // 2. DPR Gap
    if (!profile.hasProjectReport) {
      gaps.push({
        id: 'gap-dpr',
        title: l.gapDprTitle,
        description: l.gapDprDesc,
        impactScore: 22,
        subsidyUnlock: 120000,
        actionLabel: l.gapDprAction,
        actionTab: 'dpr',
        difficulty: l.quick,
        isCompleted: false
      });
    }

    // 3. Margin Money / Promoter Contribution Gap
    const minRequiredMargin = activeMatch 
      ? (activeMatch.scheme.promoterContributionMinPercent?.specialCategory || 5)
      : 5;
    const currentMarginPercent = profile.totalProjectCost > 0
      ? (profile.promoterContributionAvailable / profile.totalProjectCost) * 100
      : 0;

    if (currentMarginPercent < minRequiredMargin) {
      gaps.push({
        id: 'gap-margin',
        title: `${l.gapMarginTitle} (${minRequiredMargin}%)`,
        description: `${l.gapMarginDesc} (Declared: ${currentMarginPercent.toFixed(1)}%, Min: ${minRequiredMargin}%).`,
        impactScore: 15,
        subsidyUnlock: 50000,
        actionLabel: l.gapMarginAction,
        actionTab: 'whatif',
        difficulty: l.actionReq,
        isCompleted: false
      });
    }

    // 4. Caste Certificate for SC/ST/OBC schemes
    if ((profile.category === 'SC' || profile.category === 'ST' || profile.category === 'OBC') && !profile.hasCasteCertificate) {
      gaps.push({
        id: 'gap-caste',
        title: l.gapCasteTitle,
        description: l.gapCasteDesc,
        impactScore: 25,
        subsidyUnlock: 175000,
        actionLabel: l.gapCasteAction,
        actionTab: 'documents',
        difficulty: l.medium,
        isCompleted: false
      });
    }

    // 5. Skill Certification
    if (!profile.hasSkillTrainingCertificate) {
      gaps.push({
        id: 'gap-skill',
        title: l.gapSkillTitle,
        description: l.gapSkillDesc,
        impactScore: 10,
        subsidyUnlock: 25000,
        actionLabel: l.gapSkillAction,
        externalUrl: 'https://kviconline.gov.in/edp/',
        difficulty: l.medium,
        isCompleted: false
      });
    }

    // If no gaps left, provide a congratulatory item
    if (gaps.length === 0) {
      gaps.push({
        id: 'gap-none',
        title: l.gapNoneTitle,
        description: l.gapNoneDesc,
        impactScore: 0,
        subsidyUnlock: 0,
        actionLabel: l.gapNoneAction,
        actionTab: 'documents',
        difficulty: l.quick,
        isCompleted: true
      });
    }

    return gaps;
  };

  const gaps = generateGapsForScheme();
  const currentMatchScore = activeMatch?.matchScore || 65;
  const potentialScore = Math.min(
    98, 
    currentMatchScore + gaps.filter(g => !g.isCompleted).reduce((sum, g) => sum + g.impactScore, 0)
  );
  const totalLockedSubsidy = gaps.filter(g => !g.isCompleted).reduce((sum, g) => sum + g.subsidyUnlock, 0);

  return (
    <div className="gap-analyzer-container" style={{ padding: '8px 0' }}>
      {/* Institutional Diagnostic Header */}
      <div className="tactile-card-3d" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                <ShieldCheck size={12} />
                <span>{l.badge}</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                AUDIT ENGINE
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {l.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              {l.subtitle}
            </p>
          </div>

          {/* 3D Dual-Dial Scorecard */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tactile-stat-pod-3d" style={{ minWidth: '130px', textAlign: 'center', padding: '12px 18px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block' }}>
                {l.currentScore}
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: currentMatchScore >= 75 ? '#10B981' : '#F59E0B', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {currentMatchScore}%
              </div>
            </div>

            <div className="tactile-stat-pod-3d" style={{ minWidth: '140px', textAlign: 'center', padding: '12px 18px', borderTop: '2px solid rgba(79, 70, 229, 0.4)' }}>
              <span style={{ fontSize: '0.68rem', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, display: 'block' }}>
                {l.potentialScore}
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {potentialScore}%
                <TrendingUp size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Selector Tabs */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          {l.selectScheme}
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {allSchemes.slice(0, 5).map((m) => {
            const isSelected = m.scheme.id === selectedSchemeId;
            return (
              <button
                key={m.scheme.id}
                onClick={() => setSelectedSchemeId(m.scheme.id)}
                className={`tactile-segment-btn ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.84rem'
                }}
              >
                <span>{m.scheme.name}</span>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    padding: '2px 8px', 
                    borderRadius: '6px', 
                    background: m.matchScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: m.matchScore >= 75 ? '#059669' : '#D97706',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {m.matchScore}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Diagnostic Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '24px' }}>
        {/* Left Column: Actionable Gaps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              <span>{l.identifiedGaps} {activeMatch?.scheme.name} ({gaps.filter(g => !g.isCompleted).length})</span>
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {l.sortedBy}
            </span>
          </div>

          {gaps.map((gap) => (
            <div 
              key={gap.id}
              className="tactile-card-3d"
              style={{
                padding: '20px 22px',
                borderLeft: gap.isCompleted ? '4px solid #10B981' : '4px solid #F59E0B'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {gap.isCompleted ? (
                    <CheckCircle2 size={20} style={{ color: '#10B981', flexShrink: 0 }} />
                  ) : (
                    <ShieldAlert size={20} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  )}
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {gap.title}
                  </h3>
                </div>

                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    padding: '3px 9px', 
                    borderRadius: '6px',
                    background: gap.difficulty.includes('5') || gap.difficulty.includes('५') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                    color: gap.difficulty.includes('5') || gap.difficulty.includes('५') ? '#059669' : '#DC2626',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {gap.difficulty}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {gap.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {gap.impactScore > 0 && (
                    <span style={{ fontSize: '0.82rem', color: '#4F46E5', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      +{gap.impactScore}% {l.matchScoreSuffix}
                    </span>
                  )}
                  {gap.subsidyUnlock > 0 && (
                    <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {l.unlocks} ₹{(gap.subsidyUnlock / 1000).toFixed(0)}k {l.subsidy}
                    </span>
                  )}
                </div>

                {/* Remediation Button */}
                {gap.actionTab ? (
                  <button
                    className="tactile-btn-primary-3d"
                    onClick={() => setActiveTab(gap.actionTab!)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{gap.actionLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : gap.externalUrl ? (
                  <a
                    href={gap.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactile-btn-secondary-3d"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{gap.actionLabel}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Opportunity Summary & Remediation Roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Unlock Potential Card */}
          <div className="tactile-card-3d" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Award size={20} style={{ color: '#4F46E5' }} />
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {l.impactSummaryTitle}
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
              {l.impactSummaryDescPre} <strong>{gaps.filter(g => !g.isCompleted).length}</strong> {l.impactSummaryDescPost}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l.additionalSubsidy}</span>
                <strong style={{ color: '#059669', fontSize: '1.15rem', fontFamily: 'var(--font-mono)' }}>+₹{totalLockedSubsidy.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l.targetFit}</span>
                <strong style={{ color: '#4F46E5', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{potentialScore}% ({l.highFit})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l.estTime}</span>
                <strong style={{ color: 'var(--text-primary)' }}>{l.estTimeVal}</strong>
              </div>
            </div>

            {/* Visual Progress Bar with 3D Specular Groove */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>{l.eligibilityProgress}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{currentMatchScore}% {l.of} 100%</span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                background: 'rgba(0,0,0,0.06)',
                borderRadius: '99px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    width: `${currentMatchScore}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #F59E0B 0%, #4F46E5 100%)',
                    borderRadius: '99px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }} 
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (activeMatch) setSelectedSchemeModal(activeMatch);
              }}
              className="tactile-btn-secondary-3d"
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '11px',
                fontSize: '0.85rem',
                justifyContent: 'center'
              }}
            >
              {l.inspectFull}
            </button>
          </div>

          {/* Institutional Advisory Box */}
          <div className="tactile-card-3d" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Lightbulb size={18} style={{ color: '#F59E0B' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {l.advisoryTitle}
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              {l.advisoryDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalyzer;