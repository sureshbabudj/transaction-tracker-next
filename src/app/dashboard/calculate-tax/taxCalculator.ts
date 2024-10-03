export type GermanTaxSchema = Section[];

export type Section = {
  serialNo: string;
  type?: string;
  options?: string[];
  label: string;
  helpText: string;
  helpLink: string;
  sections?: Section[];
  taxClassEffects?: TaxClassEffect[];
};

export type TaxClassEffect = {
  taxClass: string;
  effect: string;
};

export type Income = {
  amount: number;
  type: string; // e.g., "Employment Income", "Self-Employment Income", etc.
};

export type Expense = {
  amount: number;
  type: string; // e.g., "Work-Related Travel", "Home Office", etc.
};

export const personalInfoSchema: Section = {
  serialNo: "0",
  label: "Personal Information",
  type: "group",
  helpText: "Basic information about the taxpayer.",
  helpLink: "https://example.com/personal-info",
  sections: [
    {
      serialNo: "0.1",
      label: "Name",
      type: "text",
      helpText: "The name of the taxpayer.",
      helpLink: "https://example.com/name",
    },
    {
      serialNo: "0.2",
      label: "Date of Birth",
      type: "date",
      helpText: "The date of birth of the taxpayer.",
      helpLink: "https://example.com/date-of-birth",
    },
    {
      serialNo: "0.3",
      label: "Tax Identification Number",
      type: "text",
      helpText: "The tax identification number of the taxpayer.",
      helpLink: "https://example.com/tin",
    },
    {
      serialNo: "0.4",
      label: "Address",
      type: "text",
      helpText: "The address of the taxpayer.",
      helpLink: "https://example.com/address",
    },
    {
      serialNo: "0.5",
      label: "Marital Status",
      type: "select",
      options: ["Single", "Married", "Divorced", "Widowed"],
      helpText: "The Marital Status of the taxpayer.",
      helpLink: "https://example.com/contact-info",
    },
    {
      serialNo: "0.6",
      label: "Tax class",
      type: "select",
      options: ["I", "II", "III", "IV", "V", "VI"],
      helpText: "The tax class of the taxpayer.",
      helpLink: "https://example.com/contact-info",
    },
  ],
};

export const germanTaxSchema: GermanTaxSchema = [
  {
    serialNo: "1",
    label: "Incomes",
    type: "group",
    helpText: "Various sources of income that are taxable.",
    helpLink:
      "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
    sections: [
      {
        serialNo: "1.1",
        label: "Employment Income",
        helpText:
          "Income from salaries, wages, bonuses, and other compensation.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Standard withholding tax rate" },
          { taxClass: "II", effect: "Standard withholding tax rate" },
          { taxClass: "III", effect: "Lower withholding tax rate" },
          { taxClass: "IV", effect: "Standard withholding tax rate" },
          { taxClass: "V", effect: "Higher withholding tax rate" },
          { taxClass: "VI", effect: "Highest withholding tax rate" },
        ],
      },
      {
        serialNo: "1.2",
        label: "Self-Employment Income",
        helpText: "Earnings from freelance or business activities.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Standard tax rate" },
          { taxClass: "II", effect: "Standard tax rate" },
          { taxClass: "III", effect: "Standard tax rate" },
          { taxClass: "IV", effect: "Standard tax rate" },
          { taxClass: "V", effect: "Standard tax rate" },
          { taxClass: "VI", effect: "Standard tax rate" },
        ],
      },
      {
        serialNo: "1.3",
        label: "Investment Income",
        helpText: "Dividends, interest, and capital gains.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "25% flat rate" },
          { taxClass: "II", effect: "25% flat rate" },
          { taxClass: "III", effect: "25% flat rate" },
          { taxClass: "IV", effect: "25% flat rate" },
          { taxClass: "V", effect: "25% flat rate" },
          { taxClass: "VI", effect: "25% flat rate" },
        ],
      },
      {
        serialNo: "1.4",
        label: "Rental Income",
        helpText: "Earnings from renting out property.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Standard tax rate" },
          { taxClass: "II", effect: "Standard tax rate" },
          { taxClass: "III", effect: "Standard tax rate" },
          { taxClass: "IV", effect: "Standard tax rate" },
          { taxClass: "V", effect: "Standard tax rate" },
          { taxClass: "VI", effect: "Standard tax rate" },
        ],
      },
      {
        serialNo: "1.5",
        label: "Pension Income",
        helpText: "Retirement benefits and pensions.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Standard tax rate" },
          { taxClass: "II", effect: "Standard tax rate" },
          { taxClass: "III", effect: "Standard tax rate" },
          { taxClass: "IV", effect: "Standard tax rate" },
          { taxClass: "V", effect: "Standard tax rate" },
          { taxClass: "VI", effect: "Standard tax rate" },
        ],
      },
      {
        serialNo: "1.6",
        label: "Other Income",
        helpText: "Alimony, scholarships, and other taxable benefits.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Standard tax rate" },
          { taxClass: "II", effect: "Standard tax rate" },
          { taxClass: "III", effect: "Standard tax rate" },
          { taxClass: "IV", effect: "Standard tax rate" },
          { taxClass: "V", effect: "Standard tax rate" },
          { taxClass: "VI", effect: "Standard tax rate" },
        ],
      },
    ],
  },
  {
    serialNo: "2",
    label: "Expenses (Deductions)",
    type: "group",
    helpText: "Various expenses that can be deducted from taxable income.",
    helpLink:
      "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
    sections: [
      {
        serialNo: "2.1",
        label: "Income-Related Expenses (Werbungskosten)",
        type: "group",
        helpText: "Expenses directly related to earning income.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        sections: [
          {
            serialNo: "2.1.1",
            label: "Work-Related Travel",
            helpText: "Costs for commuting and business trips.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
          {
            serialNo: "2.1.2",
            label: "Home Office",
            helpText: "Expenses for a dedicated workspace at home.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible up to €1,250/year" },
              { taxClass: "II", effect: "Deductible up to €1,250/year" },
              { taxClass: "III", effect: "Deductible up to €1,250/year" },
              { taxClass: "IV", effect: "Deductible up to €1,250/year" },
              { taxClass: "V", effect: "Deductible up to €1,250/year" },
              { taxClass: "VI", effect: "Deductible up to €1,250/year" },
            ],
          },
          {
            serialNo: "2.1.3",
            label: "Training and Education",
            helpText: "Costs for further education and training.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
          {
            serialNo: "2.1.4",
            label: "Work Equipment",
            helpText: "Tools, computers, and other necessary equipment.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
          {
            serialNo: "2.1.5",
            label: "Professional Memberships",
            helpText: "Fees for professional associations.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
        ],
      },
      {
        serialNo: "2.2",
        label: "Special Expenses (Sonderausgaben)",
        type: "group",
        helpText: "Expenses that are specially recognized for tax deductions.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        sections: [
          {
            serialNo: "2.2.1",
            label: "Insurance Premiums",
            helpText: "Health, life, and liability insurance.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible up to €1,900/year" },
              { taxClass: "II", effect: "Deductible up to €1,900/year" },
              { taxClass: "III", effect: "Deductible up to €1,900/year" },
              { taxClass: "IV", effect: "Deductible up to €1,900/year" },
              { taxClass: "V", effect: "Deductible up to €1,900/year" },
              { taxClass: "VI", effect: "Deductible up to €1,900/year" },
            ],
          },
          {
            serialNo: "2.2.2",
            label: "Retirement Contributions",
            helpText: "Payments into pension schemes.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible up to €20,000/year" },
              { taxClass: "II", effect: "Deductible up to €20,000/year" },
              { taxClass: "III", effect: "Deductible up to €20,000/year" },
              { taxClass: "IV", effect: "Deductible up to €20,000/year" },
              { taxClass: "V", effect: "Deductible up to €20,000/year" },
              { taxClass: "VI", effect: "Deductible up to €20,000/year" },
            ],
          },
          {
            serialNo: "2.2.3",
            label: "Charitable Donations",
            helpText: "Contributions to recognized charities.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible up to 20% of income" },
              { taxClass: "II", effect: "Deductible up to 20% of income" },
              { taxClass: "III", effect: "Deductible up to 20% of income" },
              { taxClass: "IV", effect: "Deductible up to 20% of income" },
              { taxClass: "V", effect: "Deductible up to 20% of income" },
              { taxClass: "VI", effect: "Deductible up to 20% of income" },
            ],
          },
          {
            serialNo: "2.2.4",
            label: "Childcare Costs",
            helpText: "Expenses for daycare and babysitting.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              {
                taxClass: "I",
                effect: "Deductible up to €4,000/year per child",
              },
              {
                taxClass: "II",
                effect: "Deductible up to €4,000/year per child",
              },
              {
                taxClass: "III",
                effect: "Deductible up to €4,000/year per child",
              },
              {
                taxClass: "IV",
                effect: "Deductible up to €4,000/year per child",
              },
              {
                taxClass: "V",
                effect: "Deductible up to €4,000/year per child",
              },
              {
                taxClass: "VI",
                effect: "Deductible up to €4,000/year per child",
              },
            ],
          },
        ],
      },
      {
        serialNo: "2.3",
        label: "Extraordinary Burdens (Außergewöhnliche Belastungen)",
        type: "group",
        helpText:
          "Expenses that are considered extraordinary and can be deducted.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        sections: [
          {
            serialNo: "2.3.1",
            label: "Medical Expenses",
            helpText: "Costs not covered by insurance.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
          {
            serialNo: "2.3.2",
            label: "Disability-Related Costs",
            helpText: "Expenses related to disabilities.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
          {
            serialNo: "2.3.3",
            label: "Support Payments",
            helpText: "Financial support for dependents.",
            helpLink:
              "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",

            taxClassEffects: [
              { taxClass: "I", effect: "Deductible" },
              { taxClass: "II", effect: "Deductible" },
              { taxClass: "III", effect: "Deductible" },
              { taxClass: "IV", effect: "Deductible" },
              { taxClass: "V", effect: "Deductible" },
              { taxClass: "VI", effect: "Deductible" },
            ],
          },
        ],
      },
    ],
  },
  {
    serialNo: "3",
    label: "Redemptions (Tax Credits)",
    type: "group",
    helpText: "Tax credits that can reduce your tax liability.",
    helpLink:
      "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
    sections: [
      {
        serialNo: "3.1",
        label: "Child Allowance (Kinderfreibetrag)",
        helpText: "Tax-free allowance for children.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "N/A" },
          { taxClass: "II", effect: "Applicable" },
          { taxClass: "III", effect: "Applicable" },
          { taxClass: "IV", effect: "Applicable" },
          { taxClass: "V", effect: "Applicable" },
          { taxClass: "VI", effect: "N/A" },
        ],
      },
      {
        serialNo: "3.2",
        label:
          "Single Parent Allowance (Entlastungsbetrag für Alleinerziehende)",
        helpText: "Additional allowance for single parents.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "N/A" },
          { taxClass: "II", effect: "Applicable" },
          { taxClass: "III", effect: "N/A" },
          { taxClass: "IV", effect: "N/A" },
          { taxClass: "V", effect: "N/A" },
          { taxClass: "VI", effect: "N/A" },
        ],
      },
      {
        serialNo: "3.3",
        label: "Education Allowance",
        helpText: "For children in education.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Applicable" },
          { taxClass: "II", effect: "Applicable" },
          { taxClass: "III", effect: "Applicable" },
          { taxClass: "IV", effect: "Applicable" },
          { taxClass: "V", effect: "Applicable" },
          { taxClass: "VI", effect: "N/A" },
        ],
      },
      {
        serialNo: "3.4",
        label: "Home Ownership Allowance",
        helpText: "For first-time homebuyers.",
        helpLink:
          "https://www.bundesfinanzministerium.de/Web/EN/Issues/Taxation/Income-Tax/income-tax.html",
        taxClassEffects: [
          { taxClass: "I", effect: "Applicable" },
          { taxClass: "II", effect: "Applicable" },
          { taxClass: "III", effect: "Applicable" },
          { taxClass: "IV", effect: "Applicable" },
          { taxClass: "V", effect: "Applicable" },
          { taxClass: "VI", effect: "N/A" },
        ],
      },
    ],
    taxClassEffects: [],
  },
];

export const taxEffectGlossary: {
  [key: string]: { value: number | null; label: string };
} = {
  "Standard withholding tax rate": { value: 0.25, label: "25%" },
  "Lower withholding tax rate": { value: 0.2, label: "20%" },
  "Higher withholding tax rate": { value: 0.3, label: "30%" },
  "Highest withholding tax rate": { value: 0.35, label: "35%" },
  "25% flat rate": { value: 0.25, label: "25%" },
  Deductible: { value: null, label: "Deductible" },
  "Deductible up to €1,250/year": { value: 1250, label: "Up to €1,250/year" },
  "Deductible up to €1,900/year": { value: 1900, label: "Up to €1,900/year" },
  "Deductible up to €20,000/year": {
    value: 20000,
    label: "Up to €20,000/year",
  },
  "Deductible up to 20% of income": {
    value: 0.2,
    label: "Up to 20% of income",
  },
  "Deductible up to €4,000/year per child": {
    value: 4000,
    label: "Up to €4,000/year per child",
  },
};

export const findSection = (
  label: string,
  schema: Section[] = germanTaxSchema
): Section | undefined => {
  for (const sec of schema) {
    if (sec.type === "group" && sec.sections) {
      const found = findSection(label, sec.sections);
      if (found) {
        return found;
      }
    } else if (sec.label === label) {
      return sec;
    }
  }
  return undefined;
};

export const calculateTax = (
  incomes: Income[],
  expenses: Expense[],
  taxClass: string
): number => {
  let totalIncome = 0;
  let totalDeductions = 0;

  // Calculate total income based on tax class effects
  incomes.forEach((income) => {
    const section = findSection(income.type);
    if (section && section.taxClassEffects) {
      const effect = section.taxClassEffects.find(
        (eff) => eff.taxClass === taxClass
      );
      if (effect) {
        const taxEffect = taxEffectGlossary[effect.effect];
        if (taxEffect && taxEffect.value !== null) {
          totalIncome += income.amount * taxEffect.value;
        } else {
          totalIncome += income.amount;
        }
      }
    }
  });

  // Calculate total deductions based on tax class effects
  expenses.forEach((expense) => {
    const section = findSection(expense.type);
    if (section && section.taxClassEffects) {
      const effect = section.taxClassEffects.find(
        (eff) => eff.taxClass === taxClass
      );
      if (effect) {
        const taxEffect = taxEffectGlossary[effect.effect];
        if (taxEffect) {
          if (taxEffect.value !== null) {
            if (taxEffect.label.includes("Up to")) {
              totalDeductions += Math.min(expense.amount, taxEffect.value);
            } else {
              totalDeductions += expense.amount * taxEffect.value;
            }
          } else {
            totalDeductions += expense.amount;
          }
        }
      }
    }
  });

  // Calculate net taxable income
  const netTaxableIncome = totalIncome - totalDeductions;

  // Apply progressive tax rate to net taxable income
  let tax = 0;
  if (netTaxableIncome <= 9744) {
    tax = 0;
  } else if (netTaxableIncome <= 57918) {
    tax = (netTaxableIncome - 9744) * 0.14;
  } else if (netTaxableIncome <= 274612) {
    tax = (netTaxableIncome - 57918) * 0.42 + 6745.44;
  } else {
    tax = (netTaxableIncome - 274612) * 0.45 + 16737.68;
  }

  return tax;
};
