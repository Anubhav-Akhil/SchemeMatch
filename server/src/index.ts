import express, { Request, Response } from 'express';
import cors from 'cors';
import schemesData from './data/schemes.json';
import { SAMPLE_PERSONAS } from './data/samplePersonas';
import { Scheme, UserProfile, DprRequest } from './types';
import { SchemeMatchingEngine } from './services/matchingEngine';
import { DprGeneratorService } from './services/dprGenerator';
import { DocumentService } from './services/documentService';
import { SaathiChatService } from './services/chatService';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const schemes: Scheme[] = schemesData as Scheme[];
const matchingEngine = new SchemeMatchingEngine(schemes);
const dprService = new DprGeneratorService();
const documentService = new DocumentService();
const chatService = new SaathiChatService(schemes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'SchemeMatch API',
    description: 'National Scheme Intelligence Platform for Marginalized Entrepreneurs',
    sponsoringMinistry: 'Ministry of Social Justice and Empowerment (MoSJE)',
    schemesIndexed: schemes.length,
    timestamp: new Date().toISOString()
  });
});

// Get all schemes (with optional filtering)
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, sector, location, maxLoan } = req.query;
  let filtered = [...schemes];

  if (category && typeof category === 'string') {
    filtered = filtered.filter((s) => s.targetGroups.includes(category) || s.eligibility.allowedCategories.includes(category as any));
  }
  if (sector && typeof sector === 'string') {
    filtered = filtered.filter((s) => s.eligibility.allowedSectors.includes(sector as any));
  }
  if (location && typeof location === 'string') {
    filtered = filtered.filter((s) => s.eligibility.allowedLocations.includes(location as any));
  }
  if (maxLoan && typeof maxLoan === 'string') {
    const loanNum = parseInt(maxLoan, 10);
    if (!isNaN(loanNum)) {
      filtered = filtered.filter((s) => s.minLoanAmount <= loanNum);
    }
  }

  res.json({
    count: filtered.length,
    schemes: filtered
  });
});

// Get single scheme by ID
app.get('/api/schemes/:id', (req: Request, res: Response) => {
  const scheme = schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }
  res.json(scheme);
});

// Get sample marginalized personas
app.get('/api/personas', (req: Request, res: Response) => {
  res.json({
    personas: SAMPLE_PERSONAS
  });
});

// AI Scheme Matching Engine
app.post('/api/match', (req: Request, res: Response) => {
  try {
    const profile: UserProfile = req.body;
    if (!profile || !profile.category || !profile.sector) {
      return res.status(400).json({ error: 'Incomplete user profile. Category and sector are required.' });
    }

    const matches = matchingEngine.matchSchemes(profile);
    const topMatches = matches.filter((m) => m.isEligible);
    const otherSchemes = matches.filter((m) => !m.isEligible);

    // Calculate aggregate highlights
    const totalPotentialSubsidy = topMatches.reduce((max, m) => Math.max(max, m.estimatedSubsidyAmount), 0);
    const lowestInterestRate = '4% p.a. (Concessional / Subsidized)';

    res.json({
      totalSchemesEvaluated: schemes.length,
      eligibleMatchesCount: topMatches.length,
      totalPotentialSubsidy,
      lowestInterestRate,
      topMatches,
      otherSchemes,
      evaluatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing scheme matching' });
  }
});

// Bank-Ready Detailed Project Report (DPR) Generator
app.post('/api/dpr/generate', (req: Request, res: Response) => {
  try {
    const dprReq: DprRequest = req.body;
    const model = dprService.generateFinancialModel(dprReq);
    res.json({
      model,
      generatedAt: new Date().toISOString(),
      complianceNote: 'Prepared according to standard RBI / KVIC / MoSJE micro-enterprise project appraisal standards.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating DPR' });
  }
});

// Document Readiness & Gap Analysis
app.post('/api/documents/analyze', (req: Request, res: Response) => {
  try {
    const { profile, uploadedDocIds } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'User profile is required for document analysis.' });
    }
    const report = documentService.analyzeReadiness(profile, uploadedDocIds || []);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error analyzing documents' });
  }
});

// Saathi AI Conversational Copilot
app.post('/api/chat', (req: Request, res: Response) => {
  try {
    const { query, profile } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }
    const reply = chatService.processMessage(query, profile);
    res.json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing chat query' });
  }
});

app.listen(PORT, () => {
  console.log(`SchemeMatch Backend Server running on port ${PORT}`);
});
