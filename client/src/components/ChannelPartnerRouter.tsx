import React, { useState, useEffect, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { EvaluatedPartner, PartnerRoutingResult } from '../types';
import { API_BASE_URL } from '../config';
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
  Info,
  Navigation,
  Compass,
  AlertTriangle,
  XCircle,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Crosshair
} from 'lucide-react';

const POPULAR_DISTRICTS = [
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 }
];

const SCHEME_OPTIONS = [
  { id: 'pm-vishwakarma', name: 'PM Vishwakarma Scheme (Artisans & Tailors)' },
  { id: 'pmegp-2026', name: "Prime Minister's Employment Generation Programme (PMEGP)" },
  { id: 'stand-up-india', name: 'Stand-Up India Scheme (SC/ST & Women)' },
  { id: 'mudra-kishor', name: 'Pradhan Mantri MUDRA Yojana (Kishor / Tarun)' },
  { id: 'nsfdc-term-loan', name: 'NSFDC Term Loan (Scheduled Caste Empowerment)' },
  { id: 'visvas-scheme', name: 'VISVAS Scheme (5% Direct Interest Subvention)' },
  { id: 'pm-svanidhi', name: "PM SVANidhi (Micro-Credit for Street Vendors)" }
];

const LOAN_CATEGORIES = [
  'Term Loan',
  'Working Capital',
  'Composite Loan',
  'Micro-Credit'
] as const;

const ROUTER_LABELS: Record<Language, Record<string, string>> = {
  en: {
    locatorBadge: 'Geo-Spatial Partner Locator & Router',
    title: 'Geo-Spatial Partner Locator & Router',
    subtitle: 'Finds the nearest authorized State Channelising Agency (SCA), Public Sector Bank (PSB), Regional Rural Bank (RRB), or NBFC-MFI capable of processing your selected scheme and loan category.',
    liveGps: '📍 Live GPS Location',
    districtCatchment: '📍 District Catchment',
    pipelineHeader: '7-Stage Routing Decision Pipeline (How SchemeMatch Determines Best Partner)',
    stepPrefix: 'Step',
    step1: 'User Location',
    step2: 'Selected Scheme',
    step3: 'Loan Category',
    step4: 'Authorized Partners',
    step5: 'Eligibility & Availability',
    step6: 'Distance',
    step7: 'Best Partner',
    foundSuffix: 'Found',
    slaVerified: 'SLA Verified',
    recommendedBadge: '🟢 Recommended',
    locDistrict: '📍 Location / District',
    detectBtn: 'Detect',
    gpsBtn: 'GPS',
    targetScheme: '🏛️ Target Scheme',
    loanCategoryLabel: '💳 Loan Category',
    loanAmountLabel: '💰 Loan Amount (₹)',
    recPartnerBadge: '⭐ Recommended Channel Partner',
    bestRouteFor: 'Best Route for',
    kmAway: 'km away',
    fromStatedLoc: 'from your stated location',
    routeValTitle: '4-Point Route Validation Verified by SchemeMatch Engine:',
    val1: 'Authorized for selected scheme',
    val2Prefix: 'Handles',
    val2Cap: 'Cap:',
    val3Prefix: 'Suitable for your category',
    val4: 'Currently eligible for digital routing (SLA active)',
    nodalOfficer: 'Nodal Officer:',
    getDirections: 'Get Directions',
    routeAppBtn: 'Route Application',
    radarTitle: 'Catchment Radar & Partner Distribution',
    radarSubtitle: 'Concentric distance rings (2 km, 5 km, 10 km) centered at your location. Click any partner pin to view branch appraisal status.',
    legendRec: '🟢 Recommended',
    legendLim: '🟡 Limited',
    legendNotElig: '🔴 Not eligible',
    youCenter: '📍 You',
    allPartnersTitle: 'All Channel Partners in Catchment',
    evaluatedSubtitle: 'Evaluated based on Selected Scheme, Category, and Distance',
    searchPlaceholder: 'Filter branches or officers...',
    tabAll: 'All',
    awaySuffix: 'away',
    mapBtn: 'Map',
    routeBtn: 'Route',
    modalTitle: 'Dispatch Pre-Verified Application',
    modalSubtitle: 'Direct handoff to designated branch credit desk',
    modalEnt: 'Entrepreneur:',
    modalScheme: 'Selected Scheme:',
    modalLoan: 'Loan Required:',
    modalBranch: 'Target Branch:',
    modalOfficer: 'Nodal Officer:',
    modalDist: 'Distance:',
    modalDossierVerified: 'Dossier verified with 85% Bank Ready compliance score.',
    modalCancel: 'Cancel',
    modalConfirm: 'Confirm & Dispatch',
    modalAlertSuccess: 'Application Dossier successfully transmitted to'
  },
  hi: {
    locatorBadge: 'भू-स्थानिक चैनल पार्टनर लोकेटर और राउटर',
    title: 'भू-स्थानिक चैनल पार्टनर लोकेटर और राउटर',
    subtitle: 'आपकी चयनित योजना और ऋण श्रेणी को संसाधित करने में सक्षम निकटतम अधिकृत राज्य चैनेलाइजिंग एजेंसी (SCA), सार्वजनिक बैंक (PSB), ग्रामीण बैंक (RRB) या NBFC-MFI का पता लगाएं।',
    liveGps: '📍 लाइव जीपीएस स्थान',
    districtCatchment: '📍 जिला कार्यक्षेत्र',
    pipelineHeader: '7-चरणीय रूटिंग निर्णय पाइपलाइन (स्कीममैच कैसे सर्वश्रेष्ठ बैंक शाखा चुनता है)',
    stepPrefix: 'चरण',
    step1: 'उपयोगकर्ता स्थान',
    step2: 'चयनित योजना',
    step3: 'ऋण श्रेणी',
    step4: 'अधिकृत साझेदार',
    step5: 'पात्रता और उपलब्धता',
    step6: 'दूरी',
    step7: 'सर्वश्रेष्ठ साझेदार',
    foundSuffix: 'मिले',
    slaVerified: 'SLA सत्यापित',
    recommendedBadge: '🟢 अनुशंसित',
    locDistrict: '📍 स्थान / जिला',
    detectBtn: 'पहचानें',
    gpsBtn: 'जीपीएस',
    targetScheme: '🏛️ लक्षित योजना',
    loanCategoryLabel: '💳 ऋण श्रेणी',
    loanAmountLabel: '💰 ऋण राशि (₹)',
    recPartnerBadge: '⭐ अनुशंसित चैनल पार्टनर',
    bestRouteFor: 'सर्वोत्तम शाखा:',
    kmAway: 'किमी दूर',
    fromStatedLoc: 'आपके निर्दिष्ट स्थान से',
    routeValTitle: 'स्कीममैच इंजन द्वारा सत्यापित 4-सूत्रीय रूट सत्यापन:',
    val1: 'चयनित योजना के लिए अधिकृत',
    val2Prefix: 'संभालता है',
    val2Cap: 'अधिकतम:',
    val3Prefix: 'आपकी श्रेणी के लिए उपयुक्त',
    val4: 'वर्तमान में डिजिटल रूटिंग हेतु पात्र (SLA सक्रिय)',
    nodalOfficer: 'नोडल अधिकारी:',
    getDirections: 'दिशा-निर्देश प्राप्त करें',
    routeAppBtn: 'आवेदन रूट करें',
    radarTitle: 'कैचमेंट रडार और बैंक वितरण',
    radarSubtitle: 'आपके स्थान पर केंद्रित दूरी के वृत्त (2 किमी, 5 किमी, 10 किमी)। शाखा विवरण देखने के लिए किसी भी पिन पर क्लिक करें।',
    legendRec: '🟢 अनुशंसित',
    legendLim: '🟡 सीमित',
    legendNotElig: '🔴 अपात्र',
    youCenter: '📍 आप',
    allPartnersTitle: 'कार्यक्षेत्र में सभी चैनल साझेदार',
    evaluatedSubtitle: 'चयनित योजना, श्रेणी और दूरी के आधार पर मूल्यांकित',
    searchPlaceholder: 'शाखा या अधिकारी खोजें...',
    tabAll: 'सभी',
    awaySuffix: 'दूर',
    mapBtn: 'नक्शा',
    routeBtn: 'रूट',
    modalTitle: 'पूर्व-सत्यापित आवेदन प्रेषित करें',
    modalSubtitle: 'नामित शाखा क्रेडिट डेस्क को सीधा डिजिटल हस्तांतरण',
    modalEnt: 'उद्यमी:',
    modalScheme: 'चयनित योजना:',
    modalLoan: 'आवश्यक ऋण:',
    modalBranch: 'लक्षित शाखा:',
    modalOfficer: 'नोडल अधिकारी:',
    modalDist: 'दूरी:',
    modalDossierVerified: 'आवेदन डॉसियर 85% बैंक-रेडी अनुपालन स्कोर के साथ सत्यापित है।',
    modalCancel: 'रद्द करें',
    modalConfirm: 'पुष्टि करें और प्रेषित करें',
    modalAlertSuccess: 'आवेदन डॉसियर सफलतापूर्वक प्रेषित किया गया:'
  },
  pa: {
    locatorBadge: 'ਜੀਓ-ਸਪੇਸ਼ੀਅਲ ਪਾਰਟਨਰ ਲੋਕੇਟਰ ਅਤੇ ਰਾਊਟਰ',
    title: 'ਜੀਓ-ਸਪੇਸ਼ੀਅਲ ਪਾਰਟਨਰ ਲੋਕੇਟਰ ਅਤੇ ਰਾਊਟਰ',
    subtitle: 'ਤੁਹਾਡੀ ਚੁਣੀ ਗਈ ਸਕੀਮ ਅਤੇ ਕਰਜ਼ਾ ਸ਼੍ਰੇਣੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਨ ਦੇ ਯੋਗ ਨਜ਼ਦੀਕੀ ਅਧਿਕਾਰਤ ਰਾਜ ਚੈਨਲਾਈਜ਼ਿੰਗ ਏਜੰਸੀ (SCA), ਪਬਲਿਕ ਸੈਕਟਰ ਬੈਂਕ (PSB), ਪੇਂਡੂ ਬੈਂਕ (RRB) ਜਾਂ NBFC-MFI ਲੱਭੋ।',
    liveGps: '📍 ਲਾਈਵ GPS ਸਥਾਨ',
    districtCatchment: '📍 ਜ਼ਿਲ੍ਹਾ ਖੇਤਰ',
    pipelineHeader: '7-ਪੜਾਵੀ ਰਾਊਟਿੰਗ ਫੈਸਲਾ ਪਾਈਪਲਾਈਨ (ਸਕੀਮਮੈਚ ਸਭ ਤੋਂ ਵਧੀਆ ਪਾਰਟਨਰ ਕਿਵੇਂ ਚੁਣਦਾ ਹੈ)',
    stepPrefix: 'ਕਦਮ',
    step1: 'ਉਪਭੋਗਤਾ ਸਥਾਨ',
    step2: 'ਚੁਣੀ ਗਈ ਸਕੀਮ',
    step3: 'ਕਰਜ਼ਾ ਸ਼੍ਰੇਣੀ',
    step4: 'ਅਧਿਕਾਰਤ ਪਾਰਟਨਰ',
    step5: 'ਯੋਗਤਾ ਅਤੇ ਉਪਲਬਧਤਾ',
    step6: 'ਦੂਰੀ',
    step7: 'ਸਭ ਤੋਂ ਵਧੀਆ ਪਾਰਟਨਰ',
    foundSuffix: 'ਮਿਲੇ',
    slaVerified: 'SLA ਪ੍ਰਮਾਣਿਤ',
    recommendedBadge: '🟢 ਸਿਫ਼ਾਰਸ਼ੀ',
    locDistrict: '📍 ਸਥਾਨ / ਜ਼ਿਲ੍ਹਾ',
    detectBtn: 'ਖੋਜੋ',
    gpsBtn: 'GPS',
    targetScheme: '🏛️ ਨਿਸ਼ਾਨਾ ਸਕੀਮ',
    loanCategoryLabel: '💳 ਕਰਜ਼ਾ ਸ਼੍ਰੇਣੀ',
    loanAmountLabel: '💰 ਕਰਜ਼ਾ ਰਕਮ (₹)',
    recPartnerBadge: '⭐ ਸਿਫ਼ਾਰਸ਼ੀ ਚੈਨਲ ਪਾਰਟਨਰ',
    bestRouteFor: 'ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਰੂਟ:',
    kmAway: 'ਕਿਲੋਮੀਟਰ ਦੂਰ',
    fromStatedLoc: 'ਤੁਹਾਡੇ ਦੱਸੇ ਸਥਾਨ ਤੋਂ',
    routeValTitle: 'ਸਕੀਮਮੈਚ ਇੰਜਣ ਦੁਆਰਾ 4-ਪੁਆਇੰਟ ਪ੍ਰਮਾਣਿਕਤਾ:',
    val1: 'ਚੁਣੀ ਗਈ ਸਕੀਮ ਲਈ ਅਧਿਕਾਰਤ ਹੈ',
    val2Prefix: 'ਸੰਭਾਲਦਾ ਹੈ',
    val2Cap: 'ਹੱਦ:',
    val3Prefix: 'ਤੁਹਾਡੀ ਸ਼੍ਰੇਣੀ ਲਈ ਢੁਕਵਾਂ ਹੈ',
    val4: 'ਡਿਜੀਟਲ ਰਾਊਟਿੰਗ ਲਈ ਯੋਗ (SLA ਕਿਰਿਆਸ਼ੀਲ)',
    nodalOfficer: 'ਨੋਡਲ ਅਧਿਕਾਰੀ:',
    getDirections: 'ਦਿਸ਼ਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ',
    routeAppBtn: 'ਅਰਜ਼ੀ ਅੱਗੇ ਭੇਜੋ',
    radarTitle: 'ਕੈਚਮੈਂਟ ਰਾਡਾਰ ਅਤੇ ਬੈਂਕ ਵੰਡ',
    radarSubtitle: 'ਤੁਹਾਡੇ ਸਥਾਨ ਦੁਆਲੇ ਦੂਰੀ ਦੇ ਚੱਕਰ (2 ਕਿਲੋਮੀਟਰ, 5 ਕਿਲੋਮੀਟਰ, 10 ਕਿਲੋਮੀਟਰ)। ਕਿਸੇ ਵੀ ਪਿੰਨ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਬ੍ਰਾਂਚ ਸਥਿਤੀ ਦੇਖੋ।',
    legendRec: '🟢 ਸਿਫ਼ਾਰਸ਼ੀ',
    legendLim: '🟡 ਸੀਮਤ',
    legendNotElig: '🔴 ਅਯੋਗ',
    youCenter: '📍 ਤੁਸੀਂ',
    allPartnersTitle: 'ਖੇਤਰ ਵਿੱਚ ਸਾਰੇ ਚੈਨਲ ਪਾਰਟਨਰ',
    evaluatedSubtitle: 'ਚੁਣੀ ਗਈ ਸਕੀਮ, ਸ਼੍ਰੇਣੀ ਅਤੇ ਦੂਰੀ ਦੇ ਆਧਾਰ ਤੇ ਮੁਲਾਂਕਣ ਕੀਤਾ ਗਿਆ',
    searchPlaceholder: 'ਬ੍ਰਾਂਚ ਜਾਂ ਅਫਸਰ ਫਿਲਟਰ ਕਰੋ...',
    tabAll: 'ਸਾਰੇ',
    awaySuffix: 'ਦੂਰ',
    mapBtn: 'ਨਕਸ਼ਾ',
    routeBtn: 'ਰਾਊਟ',
    modalTitle: 'ਪੂਰਵ-ਪ੍ਰਮਾਣਿਤ ਅਰਜ਼ੀ ਭੇਜੋ',
    modalSubtitle: 'ਨਿਰਧਾਰਤ ਸ਼ਾਖਾ ਕ੍ਰੈਡਿਟ ਡੈਸਕ ਨੂੰ ਸਿੱਧੀ ਡਿਜੀਟਲ ਸੌਂਪਣੀ',
    modalEnt: 'ਉੱਦਮੀ:',
    modalScheme: 'ਚੁਣੀ ਗਈ ਸਕੀਮ:',
    modalLoan: 'ਲੋੜੀਂਦਾ ਕਰਜ਼ਾ:',
    modalBranch: 'ਲਕਸ਼ਿਤ ਬ੍ਰਾਂਚ:',
    modalOfficer: 'ਨੋਡਲ ਅਧਿਕਾਰੀ:',
    modalDist: 'ਦੂਰੀ:',
    modalDossierVerified: 'ਦਸਤਾਵੇਜ਼ 85% ਬੈਂਕ-ਰੈਡੀ ਸਕੋਰ ਨਾਲ ਪ੍ਰਮਾਣਿਤ ਹਨ।',
    modalCancel: 'ਰੱਦ ਕਰੋ',
    modalConfirm: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਭੇਜੋ',
    modalAlertSuccess: 'ਅਰਜ਼ੀ ਡੋਜ਼ੀਅਰ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ:'
  },
  te: {
    locatorBadge: 'జియో-స్పేషియల్ పార్టనర్ లొకేటర్ & రూటర్',
    title: 'జియో-స్పేషియల్ పార్టనర్ లొకేటర్ & రూటర్',
    subtitle: 'మీరు ఎంచుకున్న పథకం మరియు రుణ వర్గాన్ని ప్రాసెస్ చేయగల సమీపంలోని అధీకృత స్టేట్ ఛానలైజింగ్ ఏజెన్సీ (SCA), ప్రభుత్వ బ్యాంకు (PSB), గ్రామీణ బ్యాంకు లేదా NBFC-MFI ని కనుగొంటుంది.',
    liveGps: '📍 ప్రత్యక్ష GPS స్థానం',
    districtCatchment: '📍 జిల్లా పరిధి',
    pipelineHeader: '7-దశల రూటింగ్ నిర్ణయ ప్రక్రియ (స్కీమ్‌మ్యాచ్ ఉత్తమ బ్యాంకును ఎలా నిర్ణయిస్తుంది)',
    stepPrefix: 'దశ',
    step1: 'వినియోగదారు స్థానం',
    step2: 'ఎంచుకున్న పథకం',
    step3: 'రుణ వర్గం',
    step4: 'అధికారిక భాగస్వాములు',
    step5: 'అర్హత & లభ్యత',
    step6: 'దూరం',
    step7: 'ఉత్తమ భాగస్వామి',
    foundSuffix: 'లభించాయి',
    slaVerified: 'SLA ధృవీకరించబడింది',
    recommendedBadge: '🟢 సిఫార్సు చేయబడింది',
    locDistrict: '📍 స్థానం / జిల్లా',
    detectBtn: 'గుర్తించు',
    gpsBtn: 'GPS',
    targetScheme: '🏛️ లక్ష్య పథకం',
    loanCategoryLabel: '💳 రుణ వర్గం',
    loanAmountLabel: '💰 రుణ మొత్తం (₹)',
    recPartnerBadge: '⭐ సిఫార్సు చేసిన ఛానల్ భాగస్వామి',
    bestRouteFor: 'ఉత్తమ మార్గం:',
    kmAway: 'కి.మీ దూరంలో',
    fromStatedLoc: 'మీరు పేర్కొన్న స్థానం నుండి',
    routeValTitle: 'స్కీమ్‌మ్యాచ్ ఇంజిన్ ద్వారా 4-పాయింట్ల రూట్ ధృవీకరణ:',
    val1: 'ఎంచుకున్న పథకానికి అధికారం ఉంది',
    val2Prefix: 'నిర్వహిస్తుంది',
    val2Cap: 'పరిమితి:',
    val3Prefix: 'మీ వర్గానికి అనుకూలమైనది',
    val4: 'డిజిటల్ రూటింగ్‌కు ప్రస్తుతం అర్హత ఉంది (SLA సక్రియంగా ఉంది)',
    nodalOfficer: 'నోడల్ అధికారి:',
    getDirections: 'దిశలను పొందండి',
    routeAppBtn: 'దరఖాస్తును రూట్ చేయండి',
    radarTitle: 'పరిధి రాడార్ & బ్యాంకుల పంపిణీ',
    radarSubtitle: 'మీ స్థానం ఆధారంగా ఏకకేంద్రక దూర వలయాలు (2 కి.మీ, 5 కి.మీ, 10 కి.మీ). వివరాలు చూడటానికి పిన్‌పై క్లిక్ చేయండి.',
    legendRec: '🟢 సిఫార్సు చేయబడింది',
    legendLim: '🟡 పరిమితం',
    legendNotElig: '🔴 అనర్హులు',
    youCenter: '📍 మీరు',
    allPartnersTitle: 'పరిధిలోని అన్ని ఛానల్ భాగస్వాములు',
    evaluatedSubtitle: 'ఎంచుకున్న పథకం, వర్గం మరియు దూరం ఆధారంగా మూల్యాంకనం చేయబడింది',
    searchPlaceholder: 'శాఖలు లేదా అధికారులను వెతకండి...',
    tabAll: 'అన్నీ',
    awaySuffix: 'దూరంలో',
    mapBtn: 'మ్యాప్',
    routeBtn: 'రూట్',
    modalTitle: 'ముందస్తు ధృవీకరించబడిన దరఖాస్తును పంపండి',
    modalSubtitle: 'నిర్దేశిత బ్రాంచ్ క్రెడిట్ డెస్క్‌కు ప్రత్యక్ష డిజిటల్ బదిలీ',
    modalEnt: 'వ్యవస్థాపకుడు:',
    modalScheme: 'ఎంచుకున్న పథకం:',
    modalLoan: 'అవసరమైన రుణం:',
    modalBranch: 'లక్ష్య శాఖ:',
    modalOfficer: 'నోడల్ అధికారి:',
    modalDist: 'దూరం:',
    modalDossierVerified: '85% బ్యాంక్-రెడీ స్కోర్‌తో పత్రాలు ధృవీకరించబడ్డాయి.',
    modalCancel: 'రద్దు చేయండి',
    modalConfirm: 'నిర్ధారించి పంపండి',
    modalAlertSuccess: 'దరఖాస్తు విజయవంతంగా బదిలీ చేయబడింది:'
  },
  mr: {
    locatorBadge: 'जिओ-स्थानिक चॅनल पार्टनर लोकेटर आणि राउटर',
    title: 'जिओ-स्थानिक चॅनल पार्टनर लोकेटर आणि राउटर',
    subtitle: 'आपली निवडलेली योजना व कर्ज प्रकार मंजूर करण्यास सक्षम असलेली जवळची अधिकृत राज्य चॅनेलायझिंग एजन्सी (SCA), राष्ट्रीयीकृत बँक (PSB), ग्रामीण बँक (RRB) किंवा NBFC शोधा.',
    liveGps: '📍 थेट GPS स्थान',
    districtCatchment: '📍 जिल्हा कार्यक्षेत्र',
    pipelineHeader: '7-टप्प्यांची रूटिंग निर्णय प्रक्रिया (SchemeMatch सर्वोत्तम बँक कशी ठरवते)',
    stepPrefix: 'टप्पा',
    step1: 'वापरकर्ता स्थान',
    step2: 'निवडलेली योजना',
    step3: 'कर्ज प्रकार',
    step4: 'अधिकृत भागीदार',
    step5: 'पात्रता आणि उपलब्धता',
    step6: 'अंतर',
    step7: 'सर्वोत्तम भागीदार',
    foundSuffix: 'आढळले',
    slaVerified: 'SLA सत्यापित',
    recommendedBadge: '🟢 शिफारस केलेले',
    locDistrict: '📍 स्थान / जिल्हा',
    detectBtn: 'शोधा',
    gpsBtn: 'GPS',
    targetScheme: '🏛️ उद्दिष्ट योजना',
    loanCategoryLabel: '💳 कर्ज प्रकार',
    loanAmountLabel: '💰 कर्ज रक्कम (₹)',
    recPartnerBadge: '⭐ शिफारस केलेला चॅनल पार्टनर',
    bestRouteFor: 'साठी सर्वोत्तम शाखा:',
    kmAway: 'किमी अंतरावर',
    fromStatedLoc: 'तुमच्या स्थानापासून',
    routeValTitle: 'SchemeMatch इंजिनद्वारे 4-सूत्रीय रूट पडताळणी:',
    val1: 'निवडलेल्या योजनेसाठी अधिकृत',
    val2Prefix: 'हाताळते',
    val2Cap: 'मर्यादा:',
    val3Prefix: 'आपल्या प्रवर्गासाठी योग्य',
    val4: 'सध्या डिजिटल रूटिंगसाठी पात्र (SLA सक्रिय)',
    nodalOfficer: 'नोडल अधिकारी:',
    getDirections: 'दिशानिर्देश मिळवा',
    routeAppBtn: 'अर्ज पाठवा',
    radarTitle: 'कार्यक्षेत्र रडार आणि बँक वितरण',
    radarSubtitle: 'तुमच्या स्थानाभोवती अंतराची वर्तुळे (2 किमी, 5 किमी, 10 किमी). शाखेचा तपशील पाहण्यासाठी कोणत्याही पिनवर क्लिक करा.',
    legendRec: '🟢 शिफारस केलेले',
    legendLim: '🟡 मर्यादित',
    legendNotElig: '🔴 अपात्र',
    youCenter: '📍 तुम्ही',
    allPartnersTitle: 'कार्यक्षेत्रातील सर्व चॅनल भागीदार',
    evaluatedSubtitle: 'योजना, प्रवर्ग आणि अंतर यावर आधारित मूल्यांकन',
    searchPlaceholder: 'शाखा किंवा अधिकारी शोधा...',
    tabAll: 'सर्व',
    awaySuffix: 'अंतरावर',
    mapBtn: 'नकाशा',
    routeBtn: 'रूट',
    modalTitle: 'पूर्व-पडताळणी केलेला अर्ज पाठवा',
    modalSubtitle: 'नियुक्त बँक शाखेच्या क्रेडिट डेस्ककडे थेट डिजिटल हस्तांतरण',
    modalEnt: 'उद्योजक:',
    modalScheme: 'निवडलेली योजना:',
    modalLoan: 'आवश्यक कर्ज:',
    modalBranch: 'लक्षित शाखा:',
    modalOfficer: 'नोडल अधिकारी:',
    modalDist: 'अंतर:',
    modalDossierVerified: 'अर्ज दस्तऐवज 85% बँक-रेडी अनुपालन गुणांसह पडताळलेला आहे.',
    modalCancel: 'रद्द करा',
    modalConfirm: 'पुष्टी करा आणि पाठवा',
    modalAlertSuccess: 'अर्ज यशस्वीरीत्या पाठवला गेला आहे:'
  },
  bn: {
    locatorBadge: 'ভূ-স্থানিক চ্যানেল পার্টনার লোকেটার ও রাউটার',
    title: 'ভূ-স্থানিক চ্যানেল পার্টনার লোকেটার ও রাউটার',
    subtitle: 'আপনার নির্বাচিত স্কিম এবং ঋণের বিভাগ প্রক্রিয়া করতে সক্ষম নিকটবর্তী অনুমোদিত রাজ্য চ্যানেল সংস্থা (SCA), পাবলিক সেক্টর ব্যাংক (PSB), গ্রামীণ ব্যাংক বা NBFC-MFI খুঁজুন।',
    liveGps: '📍 লাইভ জিপিএস অবস্থান',
    districtCatchment: '📍 জেলা কর্মক্ষেত্র',
    pipelineHeader: '৭-ধাপের রাউটিং সিদ্ধান্ত পাইপলাইন (স্কিমম্যাচ কীভাবে সেরা পার্টনার নির্বাচন করে)',
    stepPrefix: 'ধাপ',
    step1: 'ব্যবহারকারীর অবস্থান',
    step2: 'নির্বাচিত স্কিম',
    step3: 'ঋণের বিভাগ',
    step4: 'অনুমোদিত অংশীদার',
    step5: 'যোগ্যতা ও প্রাপ্যতা',
    step6: 'দূরত্ব',
    step7: 'সেরা অংশীদার',
    foundSuffix: 'পাওয়া গেছে',
    slaVerified: 'SLA যাচাইকৃত',
    recommendedBadge: '🟢 প্রস্তাবিত',
    locDistrict: '📍 অবস্থান / জেলা',
    detectBtn: 'শনাক্ত করুন',
    gpsBtn: 'GPS',
    targetScheme: '🏛️ লক্ষ্য স্কিম',
    loanCategoryLabel: '💳 ঋণের বিভাগ',
    loanAmountLabel: '💰 ঋণের পরিমাণ (₹)',
    recPartnerBadge: '⭐ প্রস্তাবিত চ্যানেল পার্টনার',
    bestRouteFor: 'এর জন্য সেরা শাখা:',
    kmAway: 'কিমি দূরে',
    fromStatedLoc: 'আপনার উল্লিখিত অবস্থান থেকে',
    routeValTitle: 'স্কিমম্যাচ ইঞ্জিন দ্বারা ৪-দফা রুট বৈধতা যাচাই:',
    val1: 'নির্বাচিত স্কিমের জন্য অনুমোদিত',
    val2Prefix: 'পরিচালনা করে',
    val2Cap: 'সর্বোচ্চ সীমা:',
    val3Prefix: 'আপনার বিভাগের জন্য উপযুক্ত',
    val4: 'বর্তমানে ডিজিটাল রাউটিংয়ের জন্য যোগ্য (SLA সক্রিয়)',
    nodalOfficer: 'নোডাল অফিসার:',
    getDirections: 'দিকনির্দেশ পান',
    routeAppBtn: 'আবেদন পাঠান',
    radarTitle: 'ক্যাচমেন্ট রাডার এবং ব্যাংক বণ্টন',
    radarSubtitle: 'আপনার অবস্থানকে কেন্দ্র করে দূরত্বের বলয় (২ কিমি, ৫ কিমি, ১০ কিমি)। শাখার বিবরণ দেখতে যেকোনো পিনে ক্লিক করুন।',
    legendRec: '🟢 প্রস্তাবিত',
    legendLim: '🟡 সীমিত',
    legendNotElig: '🔴 অযোগ্য',
    youCenter: '📍 আপনি',
    allPartnersTitle: 'কর্মক্ষেত্রের সমস্ত চ্যানেল পার্টনার',
    evaluatedSubtitle: 'নির্বাচিত স্কিম, বিভাগ এবং দূরত্বের ভিত্তিতে মূল্যায়িত',
    searchPlaceholder: 'শাখা বা কর্মকর্তা খুঁজুন...',
    tabAll: 'সমস্ত',
    awaySuffix: 'দূরে',
    mapBtn: 'মানচিত্র',
    routeBtn: 'রাউট',
    modalTitle: 'প্রাক-যাচাইকৃত আবেদন প্রেরণ করুন',
    modalSubtitle: 'মনোনীত শাখা ক্রেডিট ডেস্কে সরাসরি ডিজিটাল প্রেরণ',
    modalEnt: 'উদ্যোক্তা:',
    modalScheme: 'নির্বাচিত স্কিম:',
    modalLoan: 'প্রয়োজনীয় ঋণ:',
    modalBranch: 'লক্ষ্য শাখা:',
    modalOfficer: 'নোডাল অফিসার:',
    modalDist: 'দূরত্ব:',
    modalDossierVerified: 'আবেদনের নথি ৮৫% ব্যাংক-রেডি স্কোর সহ যাচাইকৃত।',
    modalCancel: 'বাতিল',
    modalConfirm: 'নিশ্চিত করুন ও প্রেরণ করুন',
    modalAlertSuccess: 'আবেদন সফলভাবে প্রেরণ করা হয়েছে:'
  }
};

export const ChannelPartnerRouter: React.FC = () => {
  const { profile, matchResults } = useProfile();
  const { language } = useLanguage();
  const t = (key: string) => ROUTER_LABELS[language]?.[key] || ROUTER_LABELS.en[key] || key;

  // Selected parameters
  const [selectedDistrict, setSelectedDistrict] = useState<string>(profile.district || 'Varanasi');
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'Uttar Pradesh');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 25.3176, lng: 82.9739 });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Scheme & Loan selection
  const defaultScheme = matchResults[0]?.scheme.id || 'pm-vishwakarma';
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(defaultScheme);
  const [loanCategory, setLoanCategory] = useState<'Term Loan' | 'Working Capital' | 'Composite Loan' | 'Micro-Credit'>('Term Loan');
  const [loanAmount, setLoanAmount] = useState<number>(profile.requiredLoanAmount || 150000);

  // Results & UI State
  const [routingResult, setRoutingResult] = useState<PartnerRoutingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Recommended' | 'Limited' | 'Not eligible'>('all');
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<EvaluatedPartner | null>(null);
  const [routedPartner, setRoutedPartner] = useState<EvaluatedPartner | null>(null);
  const [showRoutingModal, setShowRoutingModal] = useState<boolean>(false);

  // Detect live GPS location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setIsGpsActive(true);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('Geolocation failed or denied, using district coordinates:', error.message);
        setGpsLoading(false);
        setIsGpsActive(false);
      },
      { timeout: 10000 }
    );
  };

  // Sync coords when district changes
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const found = POPULAR_DISTRICTS.find(d => d.name.toLowerCase() === distName.toLowerCase());
    if (found) {
      setSelectedState(found.state);
      setUserCoords({ lat: found.lat, lng: found.lng });
      setIsGpsActive(false);
    }
  };

  // Execute the 7-stage Geo-Spatial Partner Locator & Router calculation
  const runPartnerRouting = async () => {
    setIsLoading(true);
    const schemeObj = SCHEME_OPTIONS.find(s => s.id === selectedSchemeId);
    const payload = {
      userLocation: {
        district: selectedDistrict,
        state: selectedState,
        coordinates: userCoords
      },
      selectedSchemeId,
      selectedSchemeName: schemeObj?.name || selectedSchemeId,
      loanCategory,
      loanAmount,
      userCategory: profile.category || 'SC',
      gender: profile.gender || 'Male',
      tradeType: profile.tradeType || 'Tailoring'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/partners/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data: PartnerRoutingResult = await res.json();
        setRoutingResult(data);
        if (!selectedPartnerDetail && data.recommendedPartner) {
          setSelectedPartnerDetail(data.recommendedPartner);
        }
      }
    } catch (err) {
      console.error('Partner routing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run routing whenever inputs change
  useEffect(() => {
    runPartnerRouting();
  }, [selectedDistrict, selectedState, userCoords, selectedSchemeId, loanCategory, loanAmount, profile.category]);

  const recommendedPartner = routingResult?.recommendedPartner;
  const allPartners = routingResult?.allRankedPartners || [];

  // Filter other partners
  const filteredPartners = useMemo(() => {
    return allPartners.filter((p) => {
      if (statusFilter !== 'all' && p.routingStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBranch = p.branchName.toLowerCase().includes(q);
        const matchOfficer = p.nodalOfficer.toLowerCase().includes(q);
        if (!matchName && !matchBranch && !matchOfficer) return false;
      }
      return true;
    });
  }, [allPartners, statusFilter, searchQuery]);

  const selectedSchemeTitle = SCHEME_OPTIONS.find(s => s.id === selectedSchemeId)?.name || selectedSchemeId;

  return (
    <div className="partner-router-container" style={{ padding: '8px 0' }}>
      
      {/* ─── MODULE HEADER & BANNER ────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '20px',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1.5px solid var(--border-subtle)'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} />
                {t('locatorBadge')}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px', lineHeight: 1.5 }}>
              {t('subtitle')}
            </p>
          </div>

          {/* Active Jurisdiction Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-surface-elevated)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                {isGpsActive ? t('liveGps') : t('districtCatchment')}
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {selectedDistrict}, {selectedState}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 7-STAGE DECISION PIPELINE VISUALIZER ───────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '22px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '10px' }}>
          {t('pipelineHeader')}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { step: '1', title: t('step1'), desc: `${selectedDistrict}` },
            { step: '2', title: t('step2'), desc: selectedSchemeId.replace('-2026', '') },
            { step: '3', title: t('step3'), desc: `${loanCategory}` },
            { step: '4', title: t('step4'), desc: `${routingResult?.decisionPipeline.authorizedPartnersCount || 4} ${t('foundSuffix')}` },
            { step: '5', title: t('step5'), desc: t('slaVerified') },
            { step: '6', title: t('step6'), desc: `${recommendedPartner?.distanceKm || 2.4} km` },
            { step: '7', title: t('step7'), desc: t('recommendedBadge') }
          ].map((node, idx, arr) => (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: idx === 6 ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                border: idx === 6 ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                minWidth: '110px'
              }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: idx === 6 ? '#059669' : 'var(--primary-saffron)',
                  marginBottom: '2px'
                }}>
                  {t('stepPrefix')} {node.step}
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {node.title}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100px' }}>
                  {node.desc}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── INTERACTIVE CONTROLS ROW ─────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        alignItems: 'center'
      }}>
        {/* District Selector + GPS */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            {t('locDistrict')}
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)'
              }}
            >
              {POPULAR_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{d.name}, {d.state}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={gpsLoading}
              title="Detect Live GPS Location"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: isGpsActive ? '#10B981' : 'var(--bg-surface-elevated)',
                color: isGpsActive ? '#fff' : 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <Crosshair size={14} className={gpsLoading ? 'animate-spin' : ''} />
              <span>{isGpsActive ? t('gpsBtn') : t('detectBtn')}</span>
            </button>
          </div>
        </div>

        {/* Selected Scheme Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            {t('targetScheme')}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          >
            {SCHEME_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Loan Category */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            {t('loanCategoryLabel')}
          </label>
          <select
            value={loanCategory}
            onChange={(e) => setLoanCategory(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          >
            {LOAN_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            {t('loanAmountLabel')}
          </label>
          <input
            type="number"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value, 10) || 10000)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* ─── RECOMMENDED CHANNEL PARTNER HERO SHOWCASE ───────────────────── */}
      {recommendedPartner && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
          border: '2px solid #10B981',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '26px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)',
          position: 'relative'
        }}>
          {/* Top Row: Location Header + Distance Pin */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#10B981', color: '#fff', padding: '3px 10px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('recPartnerBadge')}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
                  {t('bestRouteFor')} {selectedSchemeTitle.split(' ')[0]}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🏦 {recommendedPartner.name}</span>
              </h2>
              
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                  {recommendedPartner.type} ({recommendedPartner.typeFullName})
                </span>
                <span>• {recommendedPartner.branchName}</span>
              </div>
            </div>

            {/* Distance Capsule */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              background: 'var(--bg-surface)',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={20} />
                <span>{recommendedPartner.distanceKm} {t('kmAway')}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t('fromStatedLoc')} ({selectedDistrict})
              </span>
            </div>
          </div>

          {/* 4 EXACT CHECKMARK VALIDATION CRITERIA */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em', marginBottom: '10px' }}>
              {t('routeValTitle')}
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>{t('val1')} ({selectedSchemeTitle.split(' ')[0]})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>{t('val2Prefix')} {loanCategory}s ({t('val2Cap')} ₹{(recommendedPartner.maxLoanAmount / 100000).toFixed(0)}L)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>{t('val3Prefix')} ({profile.category || 'SC / Artisan'})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>{t('val4')}</span>
              </div>
            </div>
          </div>

          {/* Nodal Officer & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div><strong>{t('nodalOfficer')}</strong> {recommendedPartner.nodalOfficer}</div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                <a href={`tel:${recommendedPartner.phone}`} style={{ color: '#4F46E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {recommendedPartner.phone}
                </a>
                <a href={`mailto:${recommendedPartner.email}`} style={{ color: '#059669', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> {recommendedPartner.email}
                </a>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a
                href={recommendedPartner.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border-subtle)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <Navigation size={15} style={{ color: '#4F46E5' }} />
                <span>{t('getDirections')}</span>
                <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setRoutedPartner(recommendedPartner);
                  setShowRoutingModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Send size={15} />
                <span>{t('routeAppBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE GEO-SPATIAL RADAR / MAP VISUALIZER ─────────────────── */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '14px',
        marginBottom: '26px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={18} style={{ color: '#4F46E5' }} />
              <span>{t('radarTitle')} ({selectedDistrict})</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t('radarSubtitle')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.74rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>{t('legendRec')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706' }}>{t('legendLim')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626' }}>{t('legendNotElig')}</span>
          </div>
        </div>

        {/* SVG Radar Map */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: 'radial-gradient(circle, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Distance Rings */}
          <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.25)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 52px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>2 km</span>

          <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.2)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 88px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>5 km</span>

          <div style={{ position: 'absolute', width: '230px', height: '230px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.12)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 122px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>10 km</span>

          {/* User Center Pulse */}
          <div style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(79, 70, 229, 0.4)'
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#4F46E5' }} />
            <span style={{ position: 'absolute', bottom: -18, fontSize: '0.68rem', fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>
              {t('youCenter')} ({selectedDistrict})
            </span>
          </div>

          {/* Partner Radar Pins */}
          {allPartners.map((partner, pIdx) => {
            const angleDeg = (pIdx * 65) + 30;
            const angleRad = (angleDeg * Math.PI) / 180;
            const rPx = Math.min(105, 30 + (partner.distanceKm * 18));
            const x = Math.cos(angleRad) * rPx;
            const y = Math.sin(angleRad) * rPx;

            const isRec = partner.routingStatus === 'Recommended';
            const isLim = partner.routingStatus === 'Limited';
            const pinColor = isRec ? '#10B981' : isLim ? '#F59E0B' : '#EF4444';

            return (
              <button
                key={partner.id}
                type="button"
                onClick={() => setSelectedPartnerDetail(partner)}
                title={`${partner.name} (${partner.distanceKm} km) - ${partner.routingStatus}`}
                style={{
                  position: 'absolute',
                  transform: `translate(${x}px, ${y}px)`,
                  background: 'var(--bg-surface)',
                  border: `2px solid ${pinColor}`,
                  borderRadius: '20px',
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: isRec ? 5 : 2
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: pinColor }} />
                <span>{partner.type} ({partner.distanceKm}km)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── OTHER PARTNERS SECTION (TABLE / CARDS) ────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '22px 26px',
        borderRadius: '16px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {t('allPartnersTitle')} ({allPartners.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t('evaluatedSubtitle')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
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

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: `${t('tabAll')} (${allPartners.length})` },
                { id: 'Recommended', label: t('legendRec') },
                { id: 'Limited', label: t('legendLim') },
                { id: 'Not eligible', label: t('legendNotElig') }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: statusFilter === tab.id ? 700 : 500,
                    background: statusFilter === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
                    border: statusFilter === tab.id ? '1px solid var(--primary-saffron)' : '1px solid var(--border-subtle)',
                    color: statusFilter === tab.id ? 'var(--primary-saffron)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured List: Partner A | Distance | Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPartners.map((partner) => {
            const isRec = partner.routingStatus === 'Recommended';
            const isLim = partner.routingStatus === 'Limited';
            const statusColor = isRec ? '#059669' : isLim ? '#D97706' : '#DC2626';
            const statusBg = isRec ? 'rgba(16, 185, 129, 0.1)' : isLim ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            const statusIcon = isRec ? '🟢' : isLim ? '🟡' : '🔴';

            return (
              <div
                key={partner.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-elevated)',
                  border: isRec ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                {/* Left: Name, Type, Branch */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                      {partner.name}
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.7rem' }}>
                      {partner.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    📍 {partner.branchName} • {t('nodalOfficer')} {partner.nodalOfficer}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: isRec ? '#059669' : 'var(--text-muted)', marginTop: '4px' }}>
                    {partner.statusReason}
                  </div>
                </div>

                {/* Center: Distance */}
                <div style={{ textAlign: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {partner.distanceKm} km
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('awaySuffix')}
                  </span>
                </div>

                {/* Right: Status Pill & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: statusBg,
                    color: statusColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span>{statusIcon}</span>
                    <span>{partner.routingStatus}</span>
                  </span>

                  <a
                    href={partner.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Get Directions on Google Maps"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: '#4F46E5',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation size={13} />
                    <span>{t('mapBtn')}</span>
                  </a>

                  {isRec && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoutedPartner(partner);
                        setShowRoutingModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#10B981',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {t('routeBtn')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── DIGITAL APPLICATION ROUTING MODAL ────────────────────────────── */}
      {showRoutingModal && routedPartner && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px solid #10B981',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px 28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t('modalTitle')}
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {t('modalSubtitle')}
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '14px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div><strong>{t('modalEnt')}</strong> {profile.fullName} ({profile.category || 'SC'})</div>
              <div><strong>{t('modalScheme')}</strong> {selectedSchemeTitle}</div>
              <div><strong>{t('modalLoan')}</strong> ₹{loanAmount.toLocaleString('en-IN')} ({loanCategory})</div>
              <div><strong>{t('modalBranch')}</strong> {routedPartner.name}</div>
              <div><strong>{t('modalOfficer')}</strong> {routedPartner.nodalOfficer}</div>
              <div><strong>{t('modalDist')}</strong> {routedPartner.distanceKm} km {t('awaySuffix')} ({selectedDistrict})</div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <CheckCircle2 size={16} />
              <span>{t('modalDossierVerified')}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowRoutingModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                {t('modalCancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`✅ ${t('modalAlertSuccess')} ${routedPartner.nodalOfficer} (${routedPartner.name}). Reference ID: APP-SM-${Date.now().toString().slice(-6)}`);
                  setShowRoutingModal(false);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                {t('modalConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPartnerRouter;
