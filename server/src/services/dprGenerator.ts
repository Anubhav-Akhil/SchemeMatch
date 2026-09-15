import { DprRequest, DprFinancialModel, SocialCategory, Gender, LocationType } from '../types';

export class DprGeneratorService {
  public generateFinancialModel(req: DprRequest): DprFinancialModel {
    const machinery = Math.max(10000, req.machineryAndEquipmentCost || 150000);
    const workspace = Math.max(0, req.workspaceOrCivilCost || 30000);
    const capitalExpenditure = machinery + workspace;

    const workingCapital = Math.max(10000, req.workingCapitalNeeds || 70000);
    const contingency = Math.max(0, req.contingencyBuffer || Math.round(capitalExpenditure * 0.05));
    const totalProjectCost = capitalExpenditure + workingCapital + contingency;

    // Margin Money % (Promoter Contribution)
    const isSpecial = ['SC', 'ST', 'OBC', 'SafaiKaramchari', 'DNT'].includes(req.category) || req.gender === 'Female';
    const promoterContributionPercent = isSpecial ? 5 : 10;
    const promoterContribution = Math.round((totalProjectCost * promoterContributionPercent) / 100);

    // Subsidy rate: 35% for rural special, 25% for urban special, 25% rural general, 15% urban general
    let subsidyPercent = 15;
    if (isSpecial) {
      subsidyPercent = req.locationType === 'Rural' ? 35 : 25;
    } else {
      subsidyPercent = req.locationType === 'Rural' ? 25 : 15;
    }

    const subsidyEligible = Math.round((totalProjectCost * subsidyPercent) / 100);

    // Bank Loans
    // Term loan covers capital expenditure minus subsidy portion minus promoter share
    const netCreditNeeded = totalProjectCost - promoterContribution - subsidyEligible;
    const termLoanRequired = Math.max(0, Math.round(netCreditNeeded * 0.75));
    const workingCapitalLoanRequired = Math.max(0, netCreditNeeded - termLoanRequired);
    const totalBankLoan = termLoanRequired + workingCapitalLoanRequired;

    // Debt repayment parameters
    const interestRatePercent = 9.0; // average 9%
    const tenureYears = 5;
    const moratoriumMonths = 6;
    const monthlyRate = interestRatePercent / 100 / 12;
    const repaymentMonths = (tenureYears * 12) - moratoriumMonths;

    let monthlyEmi = 0;
    if (termLoanRequired > 0 && repaymentMonths > 0) {
      monthlyEmi = Math.round(
        (termLoanRequired * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
        (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
      );
    }
    const annualPrincipalRepayment = Math.round(termLoanRequired / (tenureYears - (moratoriumMonths / 12)));

    // Monthly baseline estimations
    const monthlySalesBase = req.expectedMonthlyRevenue || Math.round(totalProjectCost * 0.35);
    const monthlyOpCostBase = req.expectedMonthlyOperatingCost || Math.round(monthlySalesBase * 0.65);

    // 3-Year Projections (Capacity utilization: Yr 1 @ 70%, Yr 2 @ 82%, Yr 3 @ 92%)
    const capacityFactors = [0.70, 0.82, 0.92];
    let totalDscr = 0;

    const projectionsThreeYears = capacityFactors.map((cap, idx) => {
      const year = idx + 1;
      const projectedSales = Math.round(monthlySalesBase * 12 * (cap / 0.70));
      const costOfMaterials = Math.round(projectedSales * 0.52);
      const directWages = Math.round(projectedSales * 0.16);
      const utilitiesAndRent = Math.round(projectedSales * 0.08);

      const grossProfit = projectedSales - costOfMaterials - directWages - utilitiesAndRent;

      // Outstanding loan balance for interest estimation
      const remainingPrincipal = Math.max(0, termLoanRequired - (annualPrincipalRepayment * (year - 1)));
      const interestExpense = Math.round((remainingPrincipal + workingCapitalLoanRequired) * (interestRatePercent / 100));

      // Depreciation: 15% Written Down Value
      const depreciation = Math.round(capitalExpenditure * 0.15 * Math.pow(0.85, year - 1));

      const netProfitBeforeTax = Math.max(0, grossProfit - interestExpense - depreciation);
      const taxProvision = Math.round(netProfitBeforeTax * 0.06); // presumptive small enterprise tax rate
      const netProfitAfterTax = netProfitBeforeTax - taxProvision;

      // DSCR = (Net Profit + Depreciation + Term Loan Interest) / (Term Loan Interest + Principal Repayment)
      const cashFlowAvailable = netProfitAfterTax + depreciation + interestExpense;
      const debtObligation = interestExpense + annualPrincipalRepayment;
      const dscr = debtObligation > 0 ? parseFloat((cashFlowAvailable / debtObligation).toFixed(2)) : 2.5;

      totalDscr += dscr;

      return {
        year,
        projectedSales,
        costOfMaterials,
        directWages,
        utilitiesAndRent,
        grossProfit,
        interestExpense,
        depreciation,
        netProfitBeforeTax,
        taxProvision,
        netProfitAfterTax,
        dscr
      };
    });

    const averageDscr = parseFloat((totalDscr / 3).toFixed(2));

    // Break-even calculation (Yr 1)
    const fixedCostsYr1 = projectionsThreeYears[0].directWages * 0.6 + projectionsThreeYears[0].utilitiesAndRent + projectionsThreeYears[0].interestExpense + projectionsThreeYears[0].depreciation;
    const variableCostsYr1 = projectionsThreeYears[0].costOfMaterials + (projectionsThreeYears[0].directWages * 0.4);
    const contributionMarginRatio = (projectionsThreeYears[0].projectedSales - variableCostsYr1) / projectionsThreeYears[0].projectedSales;
    const breakEvenSalesAnnual = Math.round(fixedCostsYr1 / (contributionMarginRatio || 0.4));
    const breakEvenPercentage = Math.round((breakEvenSalesAnnual / projectionsThreeYears[0].projectedSales) * 100);

    const annualNetCashFlow = projectionsThreeYears[0].netProfitAfterTax + projectionsThreeYears[0].depreciation;
    const paybackPeriodYears = annualNetCashFlow > 0 ? parseFloat((totalProjectCost / annualNetCashFlow).toFixed(1)) : 3.5;
    const returnOnInvestmentPercent = Math.round((projectionsThreeYears[0].netProfitAfterTax / totalProjectCost) * 100);

    let bankViabilityVerdict: 'Highly Bankable' | 'Bankable with Margin Support' | 'Needs Risk Mitigation' = 'Bankable with Margin Support';
    if (averageDscr >= 1.75 && breakEvenPercentage <= 60) {
      bankViabilityVerdict = 'Highly Bankable';
    } else if (averageDscr < 1.3 || breakEvenPercentage > 75) {
      bankViabilityVerdict = 'Needs Risk Mitigation';
    }

    return {
      summary: {
        businessName: req.businessName || 'Micro Enterprise Project',
        sector: req.sector,
        tradeType: req.tradeType || 'General Micro Business',
        category: req.category,
        gender: req.gender,
        locationType: req.locationType,
        totalProjectCost,
        capitalExpenditure,
        workingCapital,
        promoterContribution,
        promoterContributionPercent,
        subsidyEligible,
        subsidyPercent,
        termLoanRequired,
        workingCapitalLoanRequired,
        totalBankLoan
      },
      repaymentSchedule: {
        interestRatePercent,
        tenureYears,
        moratoriumMonths,
        monthlyEmi,
        annualDebtService: (monthlyEmi * 12)
      },
      projectionsThreeYears,
      viabilityMetrics: {
        averageDscr,
        breakEvenSalesAnnual,
        breakEvenPercentage,
        paybackPeriodYears,
        returnOnInvestmentPercent,
        bankViabilityVerdict
      }
    };
  }
}
