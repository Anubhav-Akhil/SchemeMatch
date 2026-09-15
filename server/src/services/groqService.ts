import { Scheme, UserProfile, DprRequest } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_FAST_MODEL = 'qwen/qwen3.8-27b';
const DEFAULT_REASONING_MODEL = 'openai/gpt-oss-120b';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
  }

  /**
   * Helper to make robust HTTP calls to Groq Cloud API
   */
  private async callGroq(
    messages: GroqMessage[],
    options: {
      model?: string;
      jsonMode?: boolean;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const model = options.model || DEFAULT_FAST_MODEL;
    const body: any = {
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1024
    };

    if (options.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Groq API returned status ${response.status}:`, errText);
        // Fallback to reasoning model if fast model had issues
        if (model !== DEFAULT_REASONING_MODEL) {
          return this.callGroq(messages, { ...options, model: DEFAULT_REASONING_MODEL });
        }
        throw new Error(`Groq API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err: any) {
      console.error('Groq request failed:', err.message);
      throw err;
    }
  }

  /**
   * Saathi AI Chat: Conversational Scheme Advisor grounded in Government Schemes
   */
  public async chatWithSaathi(
    userQuery: string,
    currentProfile?: Partial<UserProfile>,
    schemesList?: Scheme[]
  ): Promise<{
    text: string;
    hindiText?: string;
    extractedProfileUpdates?: Partial<UserProfile>;
    suggestedPrompts?: string[];
  }> {
    const schemeContext = (schemesList || []).slice(0, 8).map(s => (
      `- ${s.name} (${s.categoryTag}): Max Loan Rs.${s.maxLoanAmount.toLocaleString('en-IN')}, Subsidy: ${s.subsidyRate?.specialRural || s.subsidyRate?.specialUrban || 25}%, Target: ${s.targetGroups.join(', ')}`
    )).join('\n');

    const profileContext = currentProfile ? JSON.stringify({
      name: currentProfile.fullName,
      category: currentProfile.category,
      gender: currentProfile.gender,
      state: currentProfile.state,
      sector: currentProfile.sector,
      tradeType: currentProfile.tradeType,
      requiredLoan: currentProfile.requiredLoanAmount
    }) : 'Not provided yet';

    const systemPrompt = `You are "Saathi AI" (साथी AI), an empathetic, expert government scheme advisory copilot for marginalized and micro-entrepreneurs in India under the Ministry of Social Justice and Empowerment (MoSJE).
Your goal is to guide SC, ST, OBC, Divyang, Women, and Safai Karamchari entrepreneurs to national credit subsidies, lower interest loans, and bankable project advice.

Available Schemes Context:
${schemeContext}

Current User Profile:
${profileContext}

Instructions:
1. Respond warmly and authoritatively in English, with brief Hindi/Hinglish terms where appropriate for empathy.
2. Directly answer the user's question, mentioning relevant scheme names, estimated subsidies, and loan caps.
3. If the user mentions any personal or business details (like their age, gender, caste category SC/ST/OBC, state/city, loan amount, trade/business type), extract them into a JSON block so their profile updates.
4. Always respond in valid JSON with this exact schema:
{
  "text": "Your helpful response to the user in English",
  "hindiText": "Your helpful response in simple conversational Hindi (Devanagari)",
  "extractedProfileUpdates": {
    "category": "SC" | "ST" | "OBC" | "General" | "Minority" | "SafaiKaramchari" (only if detected),
    "gender": "Female" | "Male" | "Other" (only if detected),
    "locationType": "Rural" | "Urban" (only if detected),
    "sector": "Textiles" | "AgroAllied" | "Services" | "Manufacturing" | "ArtisanHandicraft" | "StreetVending" | "Sanitation" | "Retail" (only if detected),
    "tradeType": "string" (only if detected),
    "requiredLoanAmount": number (only if detected),
    "totalProjectCost": number (only if detected)
  },
  "suggestedPrompts": ["Next question prompt 1", "Next question prompt 2", "Next question prompt 3"]
}`;

    const userPrompt = `User question: "${userQuery}"`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], { jsonMode: true, temperature: 0.3 });

      const parsed = JSON.parse(rawJson);
      return {
        text: parsed.text || 'I am ready to help you find the best government schemes.',
        hindiText: parsed.hindiText || 'मैं आपकी सरकारी योजनाओं की सहायता के लिए तैयार हूँ।',
        extractedProfileUpdates: parsed.extractedProfileUpdates && Object.keys(parsed.extractedProfileUpdates).length > 0
          ? parsed.extractedProfileUpdates
          : undefined,
        suggestedPrompts: parsed.suggestedPrompts || [
          'Which scheme offers 35% subsidy?',
          'What documents do I need for Stand-Up India?',
          'How can I get loan for tailoring machine?'
        ]
      };
    } catch (err) {
      console.warn('Groq Saathi Chat fallback:', err);
      return {
        text: `Based on your request "${userQuery}", I recommend exploring PMEGP (up to 35% capital subsidy for SC/ST/Women) and Stand-Up India (Rs. 10L to 1 Cr loans). Would you like to check your full eligibility score?`,
        hindiText: `आपके प्रश्न के अनुसार, PMEGP (35% तक सब्सिडी) और स्टैंड-अप इंडिया आपके लिए सबसे उपयुक्त योजनाएं हैं।`,
        suggestedPrompts: [
          'Show me all eligible schemes',
          'Calculate my monthly EMI',
          'Check my document readiness'
        ]
      };
    }
  }

  /**
   * AI Profile Extraction: Extracts structured user profile from freeform text / voice input
   */
  public async extractProfileFromText(text: string): Promise<{
    fullName?: string;
    age?: number;
    gender?: 'Female' | 'Male' | 'Other';
    category?: 'SC' | 'ST' | 'OBC' | 'General' | 'Minority' | 'SafaiKaramchari';
    state?: string;
    locationType?: 'Rural' | 'Urban';
    sector?: 'Textiles' | 'AgroAllied' | 'Services' | 'Manufacturing' | 'ArtisanHandicraft' | 'StreetVending' | 'Sanitation' | 'Retail';
    tradeType?: string;
    requiredLoanAmount?: number;
    totalProjectCost?: number;
    annualFamilyIncome?: number;
    isDifferentlyAbled?: boolean;
    confidenceScore: number;
    summary: string;
  }> {
    const systemPrompt = `You are an expert AI entity extractor for Indian government welfare and entrepreneurship portals.
Analyze the provided user description (which may be in English, Hindi, or Hinglish) and extract all entrepreneur demographic, financial, and business attributes into a strictly formatted JSON object.

Allowed Enum Values:
- category: "SC", "ST", "OBC", "General", "Minority", "SafaiKaramchari"
- gender: "Female", "Male", "Other"
- locationType: "Rural", "Urban"
- sector: "Textiles", "AgroAllied", "Services", "Manufacturing", "ArtisanHandicraft", "StreetVending", "Sanitation", "Retail"

Important Rules:
- Convert amounts like "5 lakh", "5L", "500000", "5 लाख" into integer 500000.
- If totalProjectCost is not specified, set it to Math.round(requiredLoanAmount * 1.15).
- Detect disability keywords (Divyang, handicap, disabled) -> isDifferentlyAbled: true.
- Calculate a confidenceScore (0 to 100) based on how many key attributes were found.
- Provide a 1-sentence clean English summary.

Output format (Strict JSON):
{
  "fullName": string or null,
  "age": number or null,
  "gender": "Female" | "Male" | "Other" or null,
  "category": "SC" | "ST" | "OBC" | "General" | "Minority" | "SafaiKaramchari" or null,
  "state": string or null,
  "locationType": "Rural" | "Urban" or null,
  "sector": "Textiles" | "AgroAllied" | "Services" | "Manufacturing" | "ArtisanHandicraft" | "StreetVending" | "Sanitation" | "Retail" or null,
  "tradeType": string or null,
  "requiredLoanAmount": number or null,
  "totalProjectCost": number or null,
  "annualFamilyIncome": number or null,
  "isDifferentlyAbled": boolean,
  "confidenceScore": number,
  "summary": string
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ], { jsonMode: true, temperature: 0.1 });

      const parsed = JSON.parse(rawJson);
      // Clean up nulls
      const cleaned: any = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      }
      cleaned.confidenceScore = cleaned.confidenceScore || 85;
      cleaned.summary = cleaned.summary || 'Extracted profile details from user description.';
      return cleaned;
    } catch (err) {
      console.error('Groq profile extraction error:', err);
      // Heuristic fallback
      return {
        category: text.toLowerCase().includes('sc') ? 'SC' : 'OBC',
        gender: text.toLowerCase().includes('woman') || text.toLowerCase().includes('female') ? 'Female' : 'Male',
        locationType: text.toLowerCase().includes('village') || text.toLowerCase().includes('rural') ? 'Rural' : 'Urban',
        confidenceScore: 70,
        summary: 'Parsed basic parameters from user query.'
      };
    }
  }

  /**
   * Explainable Match Score: Generates deep, personalized rationale for why a user qualifies
   */
  public async explainMatch(
    scheme: Scheme,
    profile: UserProfile,
    score: number
  ): Promise<{
    rationale: string;
    subsidyBenefitExplanation: string;
    keyStrengthPoints: string[];
    actionableTips: string[];
  }> {
    const maxSub = scheme.subsidyRate?.maxSubsidyAmount || 500000;
    const subRate = scheme.subsidyRate?.specialRural || scheme.subsidyRate?.specialUrban || 25;
    const prompt = `Scheme: ${scheme.name} (${scheme.categoryTag})
Scheme Subsidies: Up to ${subRate}% subsidy (Max Rs.${maxSub.toLocaleString('en-IN')}), Interest: ${scheme.interestRatePerAnnum}
User: ${profile.fullName}, Category: ${profile.category}, Gender: ${profile.gender}, State: ${profile.state}, Sector: ${profile.sector}, Loan Needed: Rs.${profile.requiredLoanAmount.toLocaleString('en-IN')}
Calculated Match Score: ${score}%

Provide an explainable match evaluation in JSON format:
{
  "rationale": "Clear 2-sentence explanation of why the user matches this scheme",
  "subsidyBenefitExplanation": "Exact financial advantage the user receives under this scheme",
  "keyStrengthPoints": ["Strength 1", "Strength 2", "Strength 3"],
  "actionableTips": ["Tip 1 to expedite loan approval", "Tip 2 for bank interview"]
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: 'You are an RBI & MoSJE certified loan appraisal expert. Output JSON only.' },
        { role: 'user', content: prompt }
      ], { jsonMode: true, temperature: 0.2 });

      return JSON.parse(rawJson);
    } catch (err) {
      return {
        rationale: `You qualify for ${scheme.name} as a ${profile.category} entrepreneur in ${profile.sector}.`,
        subsidyBenefitExplanation: `Eligible for up to ${subRate}% capital subsidy amounting to Rs. ${maxSub.toLocaleString('en-IN')}.`,
        keyStrengthPoints: [
          `Category criteria (${profile.category}) matched with priority allocation`,
          `Loan requirement within permitted ceiling of Rs. ${scheme.maxLoanAmount.toLocaleString('en-IN')}`,
          `Sector alignment with National Priority Sector lending guidelines`
        ],
        actionableTips: [
          'Ensure Caste Certificate is digitally verified on the state portal',
          'Keep 3-year projected cash flow statement ready for the branch manager'
        ]
      };
    }
  }

  /**
   * AI DPR Narrative Generator
   */
  public async generateDprNarrative(
    dprReq: DprRequest,
    financials: any
  ): Promise<{
    executiveSummary: string;
    marketAnalysis: string;
    socioEconomicImpact: string;
    repaymentFeasibility: string;
  }> {
    const prompt = `Generate a formal banking project appraisal narrative for:
Business: ${dprReq.businessName}
Entrepreneur: Category ${dprReq.category}, Gender: ${dprReq.gender}, Location: ${dprReq.locationType}
Trade: ${dprReq.tradeType} (Sector: ${dprReq.sector})
Financials:
- Total Project Cost: Rs.${financials.totalProjectCost}
- Bank Loan Needed: Rs.${financials.termLoanAmount}
- Working Capital: Rs.${financials.workingCapitalAmount}
- Estimated Monthly Net Profit: Rs.${financials.netMonthlyProfit}
- Debt Service Coverage Ratio (DSCR): ${financials.dscr}

Output JSON format:
{
  "executiveSummary": "2-3 paragraphs formal banking appraisal summary",
  "marketAnalysis": "Demand drivers, target local customer base, and competitive edge",
  "socioEconomicImpact": "Job creation and livelihood elevation for marginalized community",
  "repaymentFeasibility": "Clear rationale on how DSCR ensures timely debt servicing without default"
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: 'You are an expert NABARD/SIDBI bank credit appraisal officer. Output JSON only.' },
        { role: 'user', content: prompt }
      ], { jsonMode: true, temperature: 0.2 });

      return JSON.parse(rawJson);
    } catch (err) {
      return {
        executiveSummary: `Project proposal for ${dprReq.businessName} involved in ${dprReq.tradeType}. The total outlay of Rs. ${financials.totalProjectCost} demonstrates sound commercial viability with high debt-servicing capability.`,
        marketAnalysis: `High localized demand for ${dprReq.tradeType} across ${dprReq.locationType} catchment areas with minimal organized competition.`,
        socioEconomicImpact: `Direct employment generation for marginalized families and sustainable income enhancement for the promoter.`,
        repaymentFeasibility: `With an average DSCR of ${financials.dscr}, the enterprise generates sufficient operating surplus to comfortably cover principal and interest obligations.`
      };
    }
  }
}
