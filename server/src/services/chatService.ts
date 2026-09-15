import { Scheme, UserProfile, SocialCategory, Gender, SectorType } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  timestamp: string;
  matchedSchemes?: Array<{
    id: string;
    name: string;
    subsidyHighlight: string;
  }>;
  suggestedPrompts?: string[];
  extractedProfileUpdates?: Partial<UserProfile>;
}

export class SaathiChatService {
  private schemes: Scheme[];

  constructor(schemes: Scheme[]) {
    this.schemes = schemes;
  }

  public processMessage(userQuery: string, currentProfile?: Partial<UserProfile>): ChatMessage {
    const q = userQuery.toLowerCase().trim();
    const updates: Partial<UserProfile> = {};
    const matchedSchemes: Array<{ id: string; name: string; subsidyHighlight: string }> = [];
    const suggestedPrompts: string[] = [];

    // Entity extraction
    // Category detection
    if (q.includes('sc') || q.includes('scheduled caste') || q.includes('dalit') || q.includes('harijan') || q.includes('अनुसूचित जाति')) {
      updates.category = 'SC';
    } else if (q.includes('st') || q.includes('scheduled tribe') || q.includes('adivasi') || q.includes('tribal') || q.includes('आदिवासी') || q.includes('अनुसूचित जनजाति')) {
      updates.category = 'ST';
    } else if (q.includes('obc') || q.includes('backward class') || q.includes('पिछड़ा वर्ग')) {
      updates.category = 'OBC';
    } else if (q.includes('safai') || q.includes('sanitation') || q.includes('scavenger') || q.includes('सफाई कर्मचारी')) {
      updates.category = 'SafaiKaramchari';
      updates.isSafaiKaramchariDependent = true;
    } else if (q.includes('minority') || q.includes('muslim') || q.includes('christian') || q.includes('sikh') || q.includes('अल्पसंख्यक')) {
      updates.category = 'Minority';
      updates.isMinority = true;
    }

    // Gender detection
    if (q.includes('mahila') || q.includes('woman') || q.includes('women') || q.includes('female') || q.includes('aurat') || q.includes('महिला')) {
      updates.gender = 'Female';
    } else if (q.includes('purush') || q.includes('man') || q.includes('male') || q.includes('पुरुष')) {
      updates.gender = 'Male';
    }

    // Disability detection
    if (q.includes('divyang') || q.includes('handicap') || q.includes('disabled') || q.includes('disability') || q.includes('दिव्यांग')) {
      updates.isDifferentlyAbled = true;
      updates.disabilityPercentage = 40;
    }

    // Location detection
    if (q.includes('gaao') || q.includes('gaon') || q.includes('rural') || q.includes('village') || q.includes('panchayat') || q.includes('ग्रामीण')) {
      updates.locationType = 'Rural';
    } else if (q.includes('city') || q.includes('urban') || q.includes('nagar') || q.includes('shahar') || q.includes('शहरी')) {
      updates.locationType = 'Urban';
    }

    // Sector / Trade detection
    if (q.includes('silai') || q.includes('tailor') || q.includes('cloth') || q.includes('garment') || q.includes('kapda') || q.includes('textile') || q.includes('कपड़ा')) {
      updates.sector = 'Textiles';
      updates.tradeType = 'Tailoring & Garments';
    } else if (q.includes('bunkar') || q.includes('weaver') || q.includes('handloom') || q.includes('loom') || q.includes('हथकरघा') || q.includes('कारीगर') || q.includes('artisan') || q.includes('craft')) {
      updates.sector = 'ArtisanHandicraft';
      updates.tradeType = 'Handloom / Artisan Craft';
    } else if (q.includes('vendor') || q.includes('thela') || q.includes('food cart') || q.includes('chaat') || q.includes('stall') || q.includes('फेरीवाला') || q.includes('स्ट्रीट वेंडर')) {
      updates.sector = 'StreetVending';
      updates.tradeType = 'Street Vending Stall';
    } else if (q.includes('sanitation') || q.includes('cleaning') || q.includes('tanker') || q.includes('सफाई')) {
      updates.sector = 'Sanitation';
      updates.tradeType = 'Mechanized Sanitation Services';
    } else if (q.includes('kisan') || q.includes('agro') || q.includes('krishi') || q.includes('dairy') || q.includes('poultry') || q.includes('farming') || q.includes('honey') || q.includes('मधुमक्खी')) {
      updates.sector = 'AgroAllied';
      updates.tradeType = 'Agro-Processing & Allied';
    }

    // Loan amount parsing
    const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)/i);
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

    // Determine dialogue response
    let responseText = '';
    let responseHindi = '';

    if (q.includes('pmegp') || q.includes('subsidy') || q.includes('subsidi') || q.includes('सब्सिडी')) {
      responseText = `Under the PMEGP scheme, marginalized entrepreneurs (SC, ST, OBC, Women, Differently-Abled, Minorities) receive a **35% capital subsidy in rural areas** and **25% in urban areas**. Your own contribution is just 5% of the total project cost. For manufacturing projects, loans go up to ₹50 Lakhs, and for services up to ₹20 Lakhs.`;
      responseHindi = `पीएमईजीपी योजना के तहत, विशेष श्रेणी के उद्यमियों (एससी, एसटी, ओबीसी, महिलाओं, दिव्यांगों) को **ग्रामीण क्षेत्रों में 35%** और **शहरी क्षेत्रों में 25%** सरकारी सब्सिडी मिलती है। आपका स्वयं का अंशदान परियोजना लागत का मात्र 5% होता है। विनिर्माण हेतु ₹50 लाख और सेवा क्षेत्र हेतु ₹20 लाख तक ऋण मिलता है।`;
      
      matchedSchemes.push({
        id: 'pmegp-2026',
        name: "Prime Minister's Employment Generation Programme (PMEGP)",
        subsidyHighlight: 'Up to 35% Capital Grant (Rural Special)'
      });
      suggestedPrompts.push('Generate Bank-Ready DPR for PMEGP', 'What documents are required for PMEGP?', 'How to apply online on KVIC portal?');

    } else if (q.includes('vishwakarma') || q.includes('artisan') || q.includes('craft') || q.includes('विश्वकर्मा')) {
      responseText = `The **PM Vishwakarma Scheme** offers holistic support for 18 traditional crafts. You get a **₹15,000 digital voucher for modern tools**, free skill training with **₹500 daily stipend**, and **collateral-free loan up to ₹3 Lakhs at only 5% interest rate** (backed by 8% direct government subvention).`;
      responseHindi = `**पीएम विश्वकर्मा योजना** 18 पारंपरिक शिल्पों के लिए सम्पूर्ण सहायता देती है। इसमें **आधुनिक औजारों हेतु ₹15,000 का ई-वाउचर**, **₹500/दिन वजीफे के साथ निःशुल्क प्रशिक्षण**, और **मात्र 5% ब्याज दर पर ₹3 लाख तक का संपार्श्विक-मुक्त ऋण** मिलता है।`;
      
      matchedSchemes.push({
        id: 'pm-vishwakarma',
        name: 'PM Vishwakarma Scheme for Traditional Artisans',
        subsidyHighlight: '₹15,000 Toolkit Grant + 5% Subsidized Loan'
      });
      suggestedPrompts.push('Which 18 trades are covered in PM Vishwakarma?', 'Check PM Vishwakarma document checklist');

    } else if (q.includes('svanidhi') || q.includes('street') || q.includes('thela') || q.includes('vendor') || q.includes('स्वनिधि')) {
      responseText = `**PM SVANidhi** provides collateral-free working capital for street vendors in 3 progressive tranches: **₹10,000 -> ₹20,000 -> ₹50,000**. You get a **7% interest subsidy** credited to your bank account via DBT and **up to ₹1,200 annual cashback** for accepting digital payments (₹100/month).`;
      responseHindi = `**पीएम स्वनिधि** रेहड़ी-पटरी विक्रेताओं को 3 चरणों में संपार्श्विक-मुक्त ऋण देती है: **₹10,000 -> ₹20,000 -> ₹50,000**। इसमें **7% ब्याज अनुदान** सीधे खाते में आता है और डिजिटल लेन-देन पर **₹1,200 तक वार्षिक कैशबैक** मिलता है।`;
      
      matchedSchemes.push({
        id: 'pm-svanidhi',
        name: 'PM SVANidhi for Street Vendors',
        subsidyHighlight: '7% Interest Subsidy + ₹1,200 Annual Cashback'
      });
      suggestedPrompts.push('How to get Certificate of Vending (CoV)?', 'What is the repayment period for PM SVANidhi?');

    } else if (q.includes('nsfdc') || q.includes('sc ') || (updates.category === 'SC' && (updates.gender === 'Female' || q.includes('mahila')))) {
      responseText = `For Scheduled Caste entrepreneurs, the **Ministry of Social Justice and Empowerment (MoSJE)** provides dedicated schemes through **NSFDC**:
1. **NSFDC Mahila Samriddhi Yojana**: Micro-finance up to ₹1,40,000 at only **4% per annum interest rate** for SC women.
2. **NSFDC Term Loan**: Up to ₹50 Lakhs covering 95% of project cost at 6% to 9% concessional interest rate.`;
      responseHindi = `अनुसूचित जाति के उद्यमियों के लिए, **सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE)** **एनएसएफडीसी** के माध्यम से विशेष योजनाएं चलाता है:
1. **महिला समृद्धि योजना**: एससी महिलाओं हेतु मात्र **4% वार्षिक ब्याज पर ₹1,40,000** तक का ऋण।
2. **एनएसएफडीसी मियादी ऋण**: परियोजना लागत का 95% तक 6% से 9% ब्याज पर ₹50 लाख तक का ऋण।`;

      matchedSchemes.push(
        {
          id: 'nsfdc-mahila-samriddhi',
          name: 'NSFDC Mahila Samriddhi Yojana for SC Women',
          subsidyHighlight: 'Ultra-low 4% Interest Rate'
        },
        {
          id: 'nsfdc-term-loan',
          name: 'NSFDC Term Loan for SC Entrepreneurs',
          subsidyHighlight: '95% Project Cost Financing at 6-9%'
        }
      );
      suggestedPrompts.push('Check NSFDC income criteria', 'How to apply via State Channelizing Agency (SCA)?');

    } else if (q.includes('udyam') || q.includes('registration') || q.includes('पंजीकरण')) {
      responseText = `**Udyam Registration** is the official MSME registration. It is **100% Free, paperless, and takes only 10 minutes** on [udyamregistration.gov.in](https://udyamregistration.gov.in). You only need your **Aadhaar number and linked mobile** (and PAN if available). It unlocks priority sector bank loans, collateral-free credit, and subsidy release.`;
      responseHindi = `**उद्यम पंजीकरण** आधिकारिक एमएसएमई पहचान है। यह [udyamregistration.gov.in](https://udyamregistration.gov.in) पर **100% निःशुल्क, कागज रहित और 10 मिनट में** हो जाता है। इसके लिए केवल **आधार नंबर और उससे जुड़ा मोबाइल** चाहिए। यह प्राथमिकता ऋण और सब्सिडी के लिए अनिवार्य है।`;
      suggestedPrompts.push('Is GST required for Udyam?', 'Verify my document readiness score');

    } else if (q.includes('visvas') || q.includes('विश्वास')) {
      responseText = `The **VISVAS Scheme** (Vanchit Ikai Samooh Aur Vargon Ki Aarthik Sahayata) by MoSJE provides **5% direct interest subvention** on standard bank loans and Mudra loans for SC and OBC micro-borrowers (up to ₹2 Lakh) and SHGs (up to ₹4 Lakh). If your bank charges 9.5%, your effective interest rate drops to just 4.5%!`;
      responseHindi = `सामाजिक न्याय मंत्रालय की **विश्वास योजना** अनुसूचित जाति और अन्य पिछड़ा वर्ग के उद्यमियों (₹2 लाख तक) और स्वयं सहायता समूहों (₹4 लाख तक) को बैंक ऋणों पर **5% सीधी ब्याज छूट** देती है। यदि बैंक 9.5% लेता है, तो आपकी शुद्ध ब्याज दर मात्र 4.5% रह जाती है!`;
      
      matchedSchemes.push({
        id: 'visvas-scheme',
        name: 'VISVAS Scheme (5% Interest Subvention)',
        subsidyHighlight: '5% Direct Interest Subvention via DBT'
      });
      suggestedPrompts.push('Can VISVAS be combined with Mudra Loan?', 'Who is the nodal agency for VISVAS?');

    } else {
      // General tailored response
      const cat = updates.category || currentProfile?.category || 'Marginalized';
      const sec = updates.sector || currentProfile?.sector || 'Enterprise';
      const loc = updates.locationType || currentProfile?.locationType || 'Rural';

      responseText = `Namaste! Based on your interest in **${sec}** as a **${cat}** entrepreneur in a **${loc}** area, our AI engine has mapped your profile. You are in a prime position to unlock up to **35% capital subsidy under PMEGP** and concessional 4%-6% credit under **MoSJE apex corporations** (NSFDC / NBCFDC / NDFDC). Would you like me to calculate your exact monthly EMI and generate a Bank-Ready Detailed Project Report (DPR)?`;
      responseHindi = `नमस्ते! **${loc === 'Rural' ? 'ग्रामीण' : 'शहरी'}** क्षेत्र में **${cat}** उद्यमी के रूप में **${sec}** हेतु हमारे एआई इंजन ने आपका मिलान किया है। आप **पीएमईजीपी के तहत 35% तक सब्सिडी** और **MoSJE शीर्ष निगमों** के माध्यम से 4%-6% रियायती ऋण प्राप्त कर सकते हैं। क्या आप अपनी सटीक ईएमआई और बैंक-प्रोजेक्ट रिपोर्ट देखना चाहते हैं?`;

      matchedSchemes.push(
        {
          id: 'pmegp-2026',
          name: "Prime Minister's Employment Generation Programme (PMEGP)",
          subsidyHighlight: '25% - 35% Capital Subsidy'
        },
        {
          id: 'mudra-kishor',
          name: 'PMMY Mudra Kishor / Tarun',
          subsidyHighlight: 'Collateral-Free Loan up to ₹10 Lakhs'
        }
      );
      suggestedPrompts.push('Calculate my monthly EMI and Subsidy', 'Check my Document Readiness', 'Generate Bank-Ready DPR');
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      hindiText: responseHindi,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      matchedSchemes: matchedSchemes.length > 0 ? matchedSchemes : undefined,
      suggestedPrompts,
      extractedProfileUpdates: Object.keys(updates).length > 0 ? updates : undefined
    };
  }
}
