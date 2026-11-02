import { SupportedLanguage, ChatFeatureMode } from '../types';

export interface SuggestionOption {
  mode: ChatFeatureMode;
  title: Record<SupportedLanguage, string>;
  sub: Record<SupportedLanguage, string>;
  prompt: Record<SupportedLanguage, string>;
}

export const SUGGESTIONS: SuggestionOption[] = [
  {
    mode: 'recommendation',
    title: {
      en: 'Find a scheme',
      hi: 'योजना खोजें',
      pa: 'ਸਕੀਮ ਲੱਭੋ',
      te: 'పథకం కనుగొనండి',
      mr: 'योजना शोधा',
      bn: 'স্কিম খুঁজুন'
    },
    sub: {
      en: 'Best schemes for your work & profile',
      hi: 'अपनी प्रोफ़ाइल हेतु सर्वश्रेष्ठ योजनाएं',
      pa: 'ਆਪਣੇ ਕੰਮ ਲਈ ਵਧੀਆ ਸਕੀਮਾਂ',
      te: 'మీ పని & ప్రొఫైల్ ఆధారంగా ఉత్తమ పథకాలు',
      mr: 'तुमच्या कामासाठी आणि प्रोफाइलसाठी सर्वोत्तम योजना',
      bn: 'আপনার কাজ ও প্রোফাইল অনুযায়ী সেরা স্কিম'
    },
    prompt: {
      en: 'Find a scheme based on my work and profile',
      hi: 'मेरी प्रोफाइल और कार्य के अनुसार सर्वोत्तम योजनाएं खोजें',
      pa: 'ਮੇਰੇ ਕੰਮ ਅਤੇ ਪ੍ਰੋਫਾਈਲ ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲੱਭੋ',
      te: 'నా పని మరియు ప్రొఫైల్ ఆధారంగా ఉత్తమ ప్రభుత్వ పథకాలను కనుగొనండి',
      mr: 'माझ्या कामाच्या आणि प्रोफाइलच्या आधारावर सर्वोत्तम सरकारी योजना शोधा',
      bn: 'আমার কাজ এবং প্রোফাইল অনুযায়ী সেরা সরকারি স্কিমগুলি খুঁজুন'
    }
  },
  {
    mode: 'documents',
    title: {
      en: 'Documents needed',
      hi: 'आवश्यक दस्तावेज़',
      pa: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
      te: 'అవసరమైన పత్రాలు',
      mr: 'आवश्यक कागदपत्रे',
      bn: 'প্রয়োজনীয় নথি'
    },
    sub: {
      en: 'Check personalized document checklist',
      hi: 'आवेदन हेतु दस्तावेज़ों की सूची',
      pa: 'ਕਰਜ਼ੇ ਲਈ ਜ਼ਰੂਰੀ ਕਾਗਜ਼ਾਤ ਸੂਚੀ',
      te: 'రుణ దరఖాస్తుకు అవసరమైన పత్రాల జాబితా',
      mr: 'कर्ज अर्जासाठी आवश्यक कागदपत्रांची यादी',
      bn: 'ঋণ আবেদনের জন্য প্রয়োজনীয় নথির তালিকা'
    },
    prompt: {
      en: 'What documents are needed to apply for loans?',
      hi: 'ऋण आवेदन के लिए आवश्यक दस्तावेज़ों की सूची क्या है?',
      pa: 'ਕਰਜ਼ਾ ਅਰਜ਼ੀ ਲਈ ਕਿਹੜੇ ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?',
      te: 'రుణ దరఖాస్తు కోసం ఏ పత్రాలు అవసరం?',
      mr: 'कर्ज अर्जासाठी कोणती आवश्यक कागदपत्रे लागतात?',
      bn: 'ঋণ আবেদনের জন্য কী কী প্রয়োজনীয় নথি দরকার?'
    }
  },
  {
    mode: 'emi',
    title: {
      en: 'Calculate EMI',
      hi: 'EMI गणना करें',
      pa: 'EMI ਗਣਨਾ ਕਰੋ',
      te: 'EMI లెక్కించండి',
      mr: 'EMI गणना करा',
      bn: 'EMI গণনা করুন'
    },
    sub: {
      en: 'Loan amount, subsidy & monthly EMI',
      hi: 'ऋण, सरकारी सब्सिडी व मासिक किस्त',
      pa: 'ਕਰਜ਼ਾ, ਸਬਸਿਡੀ ਅਤੇ ਮਾਸਿਕ ਕਿਸ਼ਤ',
      te: 'రుణ మొత్తం, సబ్సిడీ & నెలవారీ EMI',
      mr: 'कर्ज रक्कम, अनुदान आणि मासिक हप्ता',
      bn: 'ঋণের পরিমাণ, ভর্তুকি ও মাসিক কিস্তি'
    },
    prompt: {
      en: 'Calculate loan EMI, interest rate, and subsidy',
      hi: 'ऋण की EMI, ब्याज दर और सरकारी सब्सिडी की गणना करें',
      pa: 'ਕਰਜ਼ੇ ਦੀ EMI, ਵਿਆਜ ਦਰ ਅਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਦੀ ਗਣਨਾ ਕਰੋ',
      te: 'రుణం EMI, వడ్డీ రేటు మరియు ప్రభుత్వ సబ్సిడీని లెక్కించండి',
      mr: 'कर्जाचा EMI, व्याजदर आणि सरकारी अनुदानाची गणना करा',
      bn: 'ঋণের EMI, সুদের হার এবং সরকারি ভর্তুকি গণনা করুন'
    }
  },
  {
    mode: 'partners',
    title: {
      en: 'Where to apply',
      hi: 'कहाँ आवेदन करें',
      pa: 'ਕਿੱਥੇ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ',
      te: 'ఎక్కడ దరఖాస్తు చేయాలి',
      mr: 'कुठे अर्ज करावा',
      bn: 'কোথায় আবেদন করবেন'
    },
    sub: {
      en: 'Authorized banks & channel partners',
      hi: 'अधिकृत बैंक और चैनल पार्टनर खोजें',
      pa: 'ਅਧਿਕਾਰਤ ਬੈਂਕ ਤੇ ਚੈਨਲ ਪਾਰਟਨਰ',
      te: 'అధీకృత బ్యాంకులు & ఛానల్ భాగస్వాములు',
      mr: 'अधिकृत बँका आणि चॅनेल भागीदार',
      bn: 'অনুমোদিত ব্যাংক এবং চ্যানেল পার্টনার'
    },
    prompt: {
      en: 'Where to apply and authorized channel partners',
      hi: 'कहाँ आवेदन करें और अधिकृत चैनल पार्टनर कौन से हैं?',
      pa: 'ਕਿੱਥੇ ਅਰਜ਼ੀ ਦੇਣੀ ਹੈ ਅਤੇ ਅਧਿਕਾਰਤ ਚੈਨਲ ਪਾਰਟਨਰ ਕਿਹੜੇ ਹਨ?',
      te: 'ఎక్కడ దరఖాస్తు చేయాలి మరియు అధీకృత ఛానల్ భాగస్వాములు ఎవరు?',
      mr: 'कुठे अर्ज करावा आणि अधिकृत चॅनेल भागीदार कोण आहेत?',
      bn: 'কোথায় আবেদন করতে হবে এবং অনুমোদিত চ্যানেল পার্টনার কারা?'
    }
  }
];

export interface SaathiLangOption {
  code: SupportedLanguage;
  label: string;
  short: string;
}

export const SAATHI_LANGUAGES: SaathiLangOption[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'PA' },
  { code: 'te', label: 'తెలుగు', short: 'TE' },
  { code: 'mr', label: 'मराठी', short: 'MR' },
  { code: 'bn', label: 'বাংলা', short: 'BN' }
];

export const SAATHI_UI_LABELS: Record<SupportedLanguage, {
  heroHeadline: string;
  suggestionsTitle: string;
  inputPlaceholder: string;
  thinking: string;
  viewDetails: string;
  history: string;
  micOn: string;
  micOff: string;
  turnMicOffTitle: string;
  turnMicOnTitle: string;
  sendTitle: string;
  newChatTitle: string;
}> = {
  en: {
    heroHeadline: 'Ask our AI anything',
    suggestionsTitle: 'Suggestions on what to ask Our AI',
    inputPlaceholder: 'Ask about schemes, loans, documents...',
    thinking: 'AI is thinking...',
    viewDetails: 'View Details',
    history: 'History',
    micOn: 'Mic: ON',
    micOff: 'Mic: OFF',
    turnMicOffTitle: 'Click to turn Mic OFF',
    turnMicOnTitle: 'Click to turn Mic ON',
    sendTitle: 'Send message',
    newChatTitle: 'New Chat'
  },
  hi: {
    heroHeadline: 'हमारे AI से कुछ भी पूछें',
    suggestionsTitle: 'हमारे AI से क्या पूछें:',
    inputPlaceholder: 'अपनी योजनाओं या आवश्यकताओं के बारे में कुछ भी पूछें...',
    thinking: 'एआई उत्तर तैयार कर रहा है...',
    viewDetails: 'विवरण',
    history: 'इतिहास',
    micOn: 'माइक: चालू',
    micOff: 'माइक: बंद',
    turnMicOffTitle: 'माइक बंद करने के लिए क्लिक करें',
    turnMicOnTitle: 'माइक चालू करने के लिए क्लिक करें',
    sendTitle: 'संदेश भेजें',
    newChatTitle: 'नई चैट'
  },
  pa: {
    heroHeadline: 'ਸਾਡੇ AI ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ',
    suggestionsTitle: 'ਸਾਡੇ AI ਤੋਂ ਕੀ ਪੁੱਛਣਾ ਹੈ:',
    inputPlaceholder: 'ਆਪਣੀਆਂ ਸਕੀਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...',
    thinking: 'ਏਆਈ ਉੱਤਰ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...',
    viewDetails: 'ਵੇਰਵਾ',
    history: 'ਇਤਿਹਾਸ',
    micOn: 'ਮਾਈਕ: ਚਾਲੂ',
    micOff: 'ਮਾਈਕ: ਬੰਦ',
    turnMicOffTitle: 'ਮਾਈਕ ਬੰਦ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
    turnMicOnTitle: 'ਮਾਈਕ ਚਾਲੂ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
    sendTitle: 'ਸੁਨੇਹਾ ਭੇਜੋ',
    newChatTitle: 'ਨਵੀਂ ਗੱਲਬਾਤ'
  },
  te: {
    heroHeadline: 'మా AIని ఏదైనా అడగండి',
    suggestionsTitle: 'మా AIని ఏమి అడగవచ్చో సూచనలు:',
    inputPlaceholder: 'పథకాలు, రుణాలు, పత్రాల గురించి అడగండి...',
    thinking: 'AI ఆలోచిస్తోంది...',
    viewDetails: 'వివరాలు',
    history: 'చరిత్ర',
    micOn: 'మైక్: ఆన్',
    micOff: 'మైక్: ఆఫ్',
    turnMicOffTitle: 'మైక్ ఆఫ్ చేయడానికి క్లిక్ చేయండి',
    turnMicOnTitle: 'మైక్ ఆన్ చేయడానికి క్లిక్ చేయండి',
    sendTitle: 'సందేశం పంపండి',
    newChatTitle: 'కొత్త చాట్'
  },
  mr: {
    heroHeadline: 'आमच्या AI ला काहीही विचारा',
    suggestionsTitle: 'आमच्या AI ला काय विचारावे:',
    inputPlaceholder: 'योजना, कर्ज, कागदपत्रांबद्दल विचारा...',
    thinking: 'AI विचार करत आहे...',
    viewDetails: 'तपशील',
    history: 'इतिहास',
    micOn: 'माईक: चालू',
    micOff: 'माईक: बंद',
    turnMicOffTitle: 'माईक बंद करण्यासाठी क्लिक करा',
    turnMicOnTitle: 'माईक चालू करण्यासाठी क्लिक करा',
    sendTitle: 'संदेश पाठवा',
    newChatTitle: 'नवीन संभाषण'
  },
  bn: {
    heroHeadline: 'আমাদের AI কে যেকোনো কিছু জিজ্ঞাসা করুন',
    suggestionsTitle: 'আমাদের AI কে কী জিজ্ঞাসা করবেন:',
    inputPlaceholder: 'স্কিম, ঋণ, নথি সম্পর্কে জিজ্ঞাসা করুন...',
    thinking: 'AI চিন্তা করছে...',
    viewDetails: 'বিস্তারিত',
    history: 'ইতিহাস',
    micOn: 'মাইক: চালু',
    micOff: 'মাইক: বন্ধ',
    turnMicOffTitle: 'মাইক বন্ধ করতে ক্লিক করুন',
    turnMicOnTitle: 'মাইক চালু করতে ক্লিক করুন',
    sendTitle: 'বার্তা পাঠান',
    newChatTitle: 'নতুন কথোপকথন'
  }
};

export const getSaathiMessageDisplay = (msg: { text: string; hindiText?: string; punjabiText?: string; teluguText?: string; marathiText?: string; bengaliText?: string }, lang: SupportedLanguage): string => {
  if (lang === 'hi' && msg.hindiText) return msg.hindiText;
  if (lang === 'pa' && msg.punjabiText) return msg.punjabiText;
  if (lang === 'te' && msg.teluguText) return msg.teluguText;
  if (lang === 'mr' && msg.marathiText) return msg.marathiText;
  if (lang === 'bn' && msg.bengaliText) return msg.bengaliText;
  return msg.text;
};

