import { SupportedLanguage } from '../types';

export interface Translations {
  appTitle: string;
  appSubTitle: string;
  sponsoringMinistry: string;
  sihProblemStatement: string;
  tabs: {
    matcher: string;
    dpr: string;
    documents: string;
    comparison: string;
    roadmap: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    tagline: string;
    personaTitle: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
  wizard: {
    title: string;
    subtitle: string;
    personalTab: string;
    businessTab: string;
    docsTab: string;
    nameLabel: string;
    ageLabel: string;
    categoryLabel: string;
    genderLabel: string;
    locationLabel: string;
    incomeLabel: string;
    sectorLabel: string;
    loanLabel: string;
    projectCostLabel: string;
    marginLabel: string;
    matchButton: string;
    calculatingText: string;
  };
  results: {
    topMatchesTitle: string;
    matchScore: string;
    maxSubsidy: string;
    ownContribution: string;
    estimatedEmi: string;
    whyMatched: string;
    conditions: string;
    missingDocs: string;
    applyPortal: string;
    viewDetails: string;
    addToCompare: string;
    inComparison: string;
    listenAudio: string;
  };
  copilot: {
    title: string;
    subtitle: string;
    placeholder: string;
    sendBtn: string;
    listening: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appTitle: 'SchemeMatch',
    appSubTitle: 'AI Scheme Matching & Application Copilot for Marginalized Entrepreneurs',
    sponsoringMinistry: 'Ministry of Social Justice and Empowerment (MoSJE) & MSME',
    sihProblemStatement: 'AI-Driven Scheme Matching for Marginalized Entrepreneurs',
    tabs: {
      matcher: 'AI Scheme Matcher',
      dpr: 'Bank-Ready DPR Generator',
      documents: 'Document Readiness Scanner',
      comparison: 'Scheme Comparison',
      roadmap: 'Application Navigator'
    },
    hero: {
      badge: 'National Scheme Intelligence Platform',
      titleMain: 'Empowering Marginalized Entrepreneurs with',
      titleHighlight: 'Explainable AI Scheme Intelligence',
      tagline: 'Tailored government scheme discovery, capital subsidies up to 35%, 4% concessional credit, bank-acceptable Detailed Project Reports, and voice guidance.',
      personaTitle: 'Try Real Entrepreneur Scenarios:',
      stat1Label: 'Schemes Indexed',
      stat2Label: 'Max Capital Subsidy',
      stat3Label: 'Lowest Interest Rate',
      stat4Label: 'Apex Corporations'
    },
    wizard: {
      title: 'Personalized Eligibility Assessment',
      subtitle: 'Answer a few quick questions to unlock matching schemes, calculated subsidy amounts, and customized next steps.',
      personalTab: '1. Demographics & Category',
      businessTab: '2. Business & Capital',
      docsTab: '3. Existing Documents',
      nameLabel: 'Full Name',
      ageLabel: 'Age (Years)',
      categoryLabel: 'Social Category',
      genderLabel: 'Gender',
      locationLabel: 'Location Domicile',
      incomeLabel: 'Annual Household Income (₹)',
      sectorLabel: 'Business Sector / Trade',
      loanLabel: 'Required Loan Amount (₹)',
      projectCostLabel: 'Total Project Cost (₹)',
      marginLabel: 'Own Contribution Available (₹)',
      matchButton: 'Calculate Eligible Schemes & Subsidies',
      calculatingText: 'Evaluating 23+ Schemes with SchemeMatch AI...'
    },
    results: {
      topMatchesTitle: 'Top Recommended Schemes For You',
      matchScore: 'Match Probability',
      maxSubsidy: 'Eligible Capital Subsidy',
      ownContribution: 'Min. Margin Money',
      estimatedEmi: 'Est. Monthly EMI',
      whyMatched: 'Why You Matched (Explainable AI)',
      conditions: 'Conditions to Satisfy',
      missingDocs: 'Missing Documents',
      applyPortal: 'Official Portal Link',
      viewDetails: 'Deep-Dive Scheme Insights',
      addToCompare: 'Compare Scheme',
      inComparison: 'Added to Compare',
      listenAudio: 'Listen Voice Summary'
    },
    copilot: {
      title: 'SchemeMatch Voice Copilot',
      subtitle: 'Ask in English, Hindi, or Hinglish',
      placeholder: 'E.g., I am an SC woman weaver in Varanasi, need ₹2.5 Lakh loan...',
      sendBtn: 'Ask SchemeMatch',
      listening: 'Listening to your voice...'
    }
  },
  hi: {
    appTitle: 'SchemeMatch (स्कीममैच)',
    appSubTitle: 'हाशिए के उद्यमियों के लिए एआई-संचालित योजना चयन एवं आवेदन सहायता',
    sponsoringMinistry: 'सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) एवं MSME',
    sihProblemStatement: 'वंचित उद्यमियों के लिए एआई आधारित योजना चयन',
    tabs: {
      matcher: 'एआई योजना मिलान',
      dpr: 'बैंक-प्रोजेक्ट रिपोर्ट (DPR)',
      documents: 'दस्तावेज तैयारी स्कैनर',
      comparison: 'योजना तुलना',
      roadmap: 'आवेदन प्रक्रिया मार्गदर्शक'
    },
    hero: {
      badge: 'राष्ट्रीय योजना मार्गदर्शन मंच',
      titleMain: 'हाशिए पर रहने वाले उद्यमियों का सशक्तिकरण,',
      titleHighlight: 'पारदर्शी एआई योजना मार्गदर्शन के साथ',
      tagline: '35% तक पूंजीगत सब्सिडी, 4% से रियायती ब्याज दर, बैंक-स्वीकार्य विस्तृत परियोजना रिपोर्ट और अपनी भाषा में आवाज सहायता।',
      personaTitle: 'वास्तविक उद्यमी परिदृश्यों को आजमाएं:',
      stat1Label: 'सत्यापित योजनाएं',
      stat2Label: 'अधिकतम सरकारी सब्सिडी',
      stat3Label: 'न्यूनतम ब्याज दर',
      stat4Label: 'MoSJE शीर्ष निगम'
    },
    wizard: {
      title: 'व्यक्तिगत पात्रता मूल्यांकन',
      subtitle: 'कुछ आसान प्रश्नों के उत्तर दें और अपने लिए सबसे उपयुक्त योजनाओं, सब्सिडी राशि और अगले कदमों की जानकारी प्राप्त करें।',
      personalTab: '१. व्यक्तिगत विवरण व जाति वर्ग',
      businessTab: '२. व्यवसाय व ऋण आवश्यकता',
      docsTab: '३. उपलब्ध दस्तावेज',
      nameLabel: 'पूरा नाम',
      ageLabel: 'आयु (वर्ष)',
      categoryLabel: 'सामाजिक श्रेणी / वर्ग',
      genderLabel: 'लिंग',
      locationLabel: 'क्षेत्र प्रकार (ग्रामीण / शहरी)',
      incomeLabel: 'वार्षिक पारिवारिक आय (₹)',
      sectorLabel: 'व्यवसाय क्षेत्र / ट्रेड',
      loanLabel: 'अपेक्षित ऋण राशि (₹)',
      projectCostLabel: 'कुल परियोजना लागत (₹)',
      marginLabel: 'स्वयं का उपलब्ध अंशदान (₹)',
      matchButton: 'पात्र योजनाएं और सब्सिडी देखें',
      calculatingText: 'स्कीममैच एआई द्वारा 23+ योजनाओं का विश्लेषण किया जा रहा है...'
    },
    results: {
      topMatchesTitle: 'आपके लिए सर्वश्रेष्ठ अनुशंसित योजनाएं',
      matchScore: 'मिलान संभावना',
      maxSubsidy: 'अनुमानित सरकारी सब्सिडी',
      ownContribution: 'न्यूनतम स्वयं का अंशदान',
      estimatedEmi: 'अनुमानित मासिक किस्त (EMI)',
      whyMatched: 'मिलान के मुख्य कारण (एआई व्याख्या)',
      conditions: 'अनिवार्य शर्तें',
      missingDocs: 'अपेक्षित दस्तावेज',
      applyPortal: 'आधिकारिक सरकारी पोर्टल',
      viewDetails: 'योजना का विस्तृत विवरण',
      addToCompare: 'तुलना करें',
      inComparison: 'तुलना में शामिल',
      listenAudio: 'आवाज में विवरण सुनें'
    },
    copilot: {
      title: 'स्कीममैच एआई वॉयस को-पायलट',
      subtitle: 'हिंदी, अंग्रेजी या हिंग्लिश में पूछें',
      placeholder: 'जैसे: मैं वाराणसी से एससी महिला बुनकर हूं, मुझे ₹2.5 लाख ऋण चाहिए...',
      sendBtn: 'पूछें',
      listening: 'आपकी आवाज सुनी जा रही है...'
    }
  },
  ta: {
    appTitle: 'SchemeMatch (ஸ்கீம்ம್ಯಾட்ச்)',
    appSubTitle: 'விளிம்புநிலை தொழில்முனைவோருக்கான AI திட்ட பொருத்துதல் தளம்',
    sponsoringMinistry: 'சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் (MoSJE)',
    sihProblemStatement: 'விளிம்புநிலை தொழில்முனைவோருக்கான திட்ட பொருத்தம்',
    tabs: {
      matcher: 'AI திட்ட தேடல்',
      dpr: 'வங்கி திட்ட அறிக்கை (DPR)',
      documents: 'ஆவண தயார்நிலை ஸ்கேனர்',
      comparison: 'திட்ட ஒப்பீடு',
      roadmap: 'விண்ணப்ப வழிகாட்டி'
    },
    hero: {
      badge: 'தேசிய திட்ட நுண்ணறிவு தளம்',
      titleMain: 'விளிம்புநிலை தொழில்முனைவோருக்கான',
      titleHighlight: 'அறிவார்ந்த AI அரசு திட்ட தீர்வு',
      tagline: '35% வரை மானியம், 4% குறைந்த வட்டி கடன், உடனடி வங்கி DPR தயாரிப்பு மற்றும் குரல் உதவி.',
      personaTitle: 'உண்மையான தொழில்முனைவோர் சுயவிவரங்கள்:',
      stat1Label: 'திட்டங்கள்',
      stat2Label: 'அதிகபட்ச மானியம்',
      stat3Label: 'குறைந்த வட்டி',
      stat4Label: 'அரசு கழகங்கள்'
    },
    wizard: {
      title: 'தனிப்பயனாக்கப்பட்ட தகுதி மதிப்பீடு',
      subtitle: 'உங்களுக்கான அரசு திட்டங்கள் மற்றும் மானியங்களை கண்டறிய வினாக்களுக்கு பதிலளிக்கவும்.',
      personalTab: '1. சுயவிவரம் & பிரிவு',
      businessTab: '2. தொழில் & மூலதனம்',
      docsTab: '3. ஆவணங்கள்',
      nameLabel: 'முழு பெயர்',
      ageLabel: 'வயது',
      categoryLabel: 'சமூக பிரிவு',
      genderLabel: 'பாலினம்',
      locationLabel: 'வசிப்பிடம் (கிராமம் / நகரம்)',
      incomeLabel: 'குடும்ப ஆண்டு வருமானம் (₹)',
      sectorLabel: 'தொழில் துறை',
      loanLabel: 'தேவையான கடன் தொகை (₹)',
      projectCostLabel: 'மொத்த திட்ட மதிப்பீடு (₹)',
      marginLabel: 'சொந்த முதலீடு (₹)',
      matchButton: 'தகுதியான திட்டங்களை காண்க',
      calculatingText: 'திட்டங்கள் பகுப்பாய்வு செய்யப்படுகின்றன...'
    },
    results: {
      topMatchesTitle: 'உங்களுக்கான சிறந்த அரசு திட்டங்கள்',
      matchScore: 'பொருத்தம் சதவீதம்',
      maxSubsidy: 'அரசு மானிய தொகை',
      ownContribution: 'சொந்த பங்களிப்பு',
      estimatedEmi: 'மாதாந்திர தவணை (EMI)',
      whyMatched: 'பொருந்துவதற்கான காரணங்கள்',
      conditions: 'பூர்த்தி செய்ய வேண்டிய நிபந்தனைகள்',
      missingDocs: 'தேவைப்படும் ஆவணங்கள்',
      applyPortal: 'அதிகாரப்பூர்வ போர்டல்',
      viewDetails: 'முழு விவரங்கள்',
      addToCompare: 'ஒப்பிடுக',
      inComparison: 'ஒப்பீட்டில் சேர்க்கப்பட்டது',
      listenAudio: 'குரல் வழிகாட்டல்'
    },
    copilot: {
      title: 'SchemeMatch குரல் உதவியாளர்',
      subtitle: 'உங்கள் மொழியில் கேளுங்கள்',
      placeholder: 'எ.கா. நான் சுயதொழில் தொடங்க ₹2 லட்சம் கடன் வேண்டும்...',
      sendBtn: 'கேள்வி',
      listening: 'குரல் கேட்கிறது...'
    }
  },
  mr: {
    appTitle: 'SchemeMatch (स्कीममॅच)',
    appSubTitle: 'वंचित व दुर्बल घटकांतील उद्योजकांसाठी एआय योजना निवड व सहाय्य',
    sponsoringMinistry: 'सामाजिक न्याय व सक्षमीकरण मंत्रालय (MoSJE) व MSME',
    sihProblemStatement: 'दुर्बल घटकांतील उद्योजकांसाठी एआय योजना निवड',
    tabs: {
      matcher: 'एआय योजना शोध',
      dpr: 'बँक-प्रकल्प अहवाल (DPR)',
      documents: 'कागदपत्रे तपासणी',
      comparison: 'योजना तुलना',
      roadmap: 'अर्ज प्रक्रिया मार्गदर्शक'
    },
    hero: {
      badge: 'राष्ट्रीय योजना सहाय्य मंच',
      titleMain: 'वंचित घटकांतील नवउद्योजकांचे सक्षमीकरण,',
      titleHighlight: 'एआय आधारित शासकीय योजना सहाय्याने',
      tagline: '३५% पर्यंत अनुदान, ४% सवलतीचे व्याजदर, बँक-मान्य डीपीआर आणि आवाजी मार्गदर्शन.',
      personaTitle: 'उद्योजक उदाहरणे निवडा:',
      stat1Label: 'समाविष्ट योजना',
      stat2Label: 'कमाल सरकारी अनुदान',
      stat3Label: 'किमान व्याजदर',
      stat4Label: 'MoSJE महामंडळे'
    },
    wizard: {
      title: 'वैयक्तिक पात्रता तपासणी',
      subtitle: 'आपल्या व्यवसायानुसार योग्य शासकीय योजना आणि अनुदान शोधण्यासाठी माहिती भरा.',
      personalTab: '१. वैयक्तिक माहिती व प्रवर्ग',
      businessTab: '२. व्यवसाय व भांडवल',
      docsTab: '३. कागदपत्रे',
      nameLabel: 'पूर्ण नाव',
      ageLabel: 'वय',
      categoryLabel: 'सामाजिक प्रवर्ग',
      genderLabel: 'लिंग',
      locationLabel: 'परिसर (ग्रामीण / शहरी)',
      incomeLabel: 'वार्षिक कौटुंबिक उत्पन्न (₹)',
      sectorLabel: 'व्यवसाय क्षेत्र',
      loanLabel: 'आवश्यक कर्ज रक्कम (₹)',
      projectCostLabel: 'एकूण प्रकल्प खर्च (₹)',
      marginLabel: 'स्वतःचे भांडवल (₹)',
      matchButton: 'पात्र योजना व अनुदान तपासा',
      calculatingText: 'योजनांचे विश्लेषण सुरू आहे...'
    },
    results: {
      topMatchesTitle: 'आपल्यासाठी सर्वोत्तम शिफारस केलेल्या योजना',
      matchScore: 'पात्रता टक्केवारी',
      maxSubsidy: 'अपेक्षित सरकारी अनुदान',
      ownContribution: 'स्वतःचा वाटा',
      estimatedEmi: 'अंदाजे मासिक हप्ता (EMI)',
      whyMatched: 'योजना जुळण्याची कारणे',
      conditions: 'आवश्यक अटी',
      missingDocs: 'आवश्यक कागदपत्रे',
      applyPortal: 'अधिकृत पोर्टल',
      viewDetails: 'सविस्तर माहिती',
      addToCompare: 'तुलना करा',
      inComparison: 'तुलनेत जोडले',
      listenAudio: 'माहिती ऐका'
    },
    copilot: {
      title: 'SchemeMatch व्हॉईस सहाय्यक',
      subtitle: 'मराठी किंवा इंग्रजीत विचारा',
      placeholder: 'उदा. मला शिलाई कामासाठी २ लाख रुपये कर्ज हवे आहे...',
      sendBtn: 'विचारा',
      listening: 'आवाज ऐकला जात आहे...'
    }
  },
  bn: {
    appTitle: 'SchemeMatch (স্কিমম্যাচ)',
    appSubTitle: 'প্রান্তিক উদ্যোক্তাদের জন্য এআই ভিত্তিক সরকারি স্কিম নির্বাচন ও সহায়তা',
    sponsoringMinistry: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক (MoSJE)',
    sihProblemStatement: 'প্রান্তিক উদ্যোক্তাদের জন্য স্কিম নির্বাচন',
    tabs: {
      matcher: 'এআই স্কিম অনুসন্ধান',
      dpr: 'ব্যাংক প্রকল্প রিপোর্ট (DPR)',
      documents: 'নথি প্রস্তুতি স্ক্যানার',
      comparison: 'স্কিম তুলনা',
      roadmap: 'আবেদন নির্দেশিকা'
    },
    hero: {
      badge: 'জাতীয় স্কিম সহায়তা প্ল্যাটফর্ম',
      titleMain: 'প্রান্তিক ও ক্ষুদ্র উদ্যোক্তাদের ক্ষমতায়ন,',
      titleHighlight: 'স্মার্ট এআই সরকারি স্কিম প্ল্যাটফর্মে',
      tagline: '৩৫% পর্যন্ত সরকারি অনুদান, ৪% সুদের হারে ঋণ, তাত্ক্ষণিক ব্যাংক ডিপিআর এবং অডিও সহায়তা।',
      personaTitle: 'বাস্তব উদ্যোক্তা প্রোফাইল পরীক্ষা করুন:',
      stat1Label: 'অন্তর্ভুক্ত স্কিম',
      stat2Label: 'সর্বোচ্চ অনুদান',
      stat3Label: 'সর্বনিম্ন সুদের হার',
      stat4Label: 'MoSJE কর্পোরেশন'
    },
    wizard: {
      title: 'ব্যক্তিগত যোগ্যতা মূল্যায়ন',
      subtitle: 'আপনার ব্যবসায়ের উপযোগী সরকারি স্কিম এবং অনুদান খুঁজতে তথ্য দিন।',
      personalTab: '১. ব্যক্তিগত তথ্য ও শ্রেণি',
      businessTab: '২. ব্যবসা ও ঋণ চাহিদা',
      docsTab: '৩. প্রয়োজনীয় নথি',
      nameLabel: 'সম্পূর্ণ নাম',
      ageLabel: 'বয়স',
      categoryLabel: 'সামাজিক শ্রেণি',
      genderLabel: 'লিঙ্গ',
      locationLabel: 'এলাকা (গ্রামীণ / শহুরে)',
      incomeLabel: 'বার্ষিক পারিবারিক আয় (₹)',
      sectorLabel: 'ব্যবসায়িক ক্ষেত্র',
      loanLabel: 'প্রয়োজনীয় ঋণ (₹)',
      projectCostLabel: 'মোট প্রকল্প ব্যয় (₹)',
      marginLabel: 'নিজের বিনিয়োগ (₹)',
      matchButton: 'উপযুক্ত স্কিমসমূহ দেখুন',
      calculatingText: 'স্কিম বিশ্লেষণ করা হচ্ছে...'
    },
    results: {
      topMatchesTitle: 'আপনার জন্য সেরা প্রস্তাবিত সরকারি স্কিম',
      matchScore: 'উপযোগিতা স্কোর',
      maxSubsidy: 'সরকারি অনুদান',
      ownContribution: 'নিজস্ব অংশদান',
      estimatedEmi: 'আনুমানিক মাসিক কিস্তি (EMI)',
      whyMatched: 'স্কিম মেলার কারণসমূহ',
      conditions: 'প্রয়োজনীয় শর্তাবলী',
      missingDocs: 'ঘাটতি থাকা নথি',
      applyPortal: 'অফিসিয়াল পোর্টাল',
      viewDetails: 'বিস্তারিত জানুন',
      addToCompare: 'তুলনা করুন',
      inComparison: 'তুলনায় যুক্ত',
      listenAudio: 'অডিও শুনুন'
    },
    copilot: {
      title: 'SchemeMatch ভয়েস সহকারী',
      subtitle: 'আপনার ভাষায় প্রশ্ন করুন',
      placeholder: 'যেমন: আমি তাঁত শিল্পের জন্য ২ লাখ টাকা ঋণ চাই...',
      sendBtn: 'জানুন',
      listening: 'শোনা হচ্ছে...'
    }
  }
};
