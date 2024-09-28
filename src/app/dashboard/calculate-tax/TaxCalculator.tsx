"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, LineChart, Line, PieChart, Pie } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface TaxResult {
  tax: number;
  soli: number;
  total: number;
}

interface TaxBracketFunction {
  (taxableIncome: number): TaxResult;
}

interface Deductions {
  basicAllowance?: number;
  childAllowance?: number;
  incomeRelatedExpenses?: number;
  specialExpenses?: number;
  extraordinaryBurdens?: number;
}

const DEFAULT_DEDUCTIONS: Deductions = {
  basicAllowance: 10908, // Single basic tax-free allowance
  childAllowance: 0, // Placeholder for child allowance to be provided by the user
  incomeRelatedExpenses: 1230, // Standard deduction
  specialExpenses: 0, // Default, user provides this
  extraordinaryBurdens: 0, // Default, user provides this
};

function applyDeductions(income: number, deductions: Deductions): number {
  return (
    income -
    ((deductions.basicAllowance || 0) +
      (deductions.childAllowance || 0) +
      (deductions.incomeRelatedExpenses || 0) +
      (deductions.specialExpenses || 0) +
      (deductions.extraordinaryBurdens || 0))
  );
}

function getNumberValues(value: ValueType): number[] {
  if (typeof value === "number") {
    return [value];
  } else if (typeof value === "string") {
    const parsedNumber = parseFloat(value);
    if (!isNaN(parsedNumber)) {
      return [parsedNumber];
    } else {
      return [];
    }
  } else if (Array.isArray(value)) {
    return value.reduce((acc, val) => {
      if (typeof val === "number") {
        acc.push(val);
      } else if (typeof val === "string") {
        const parsedNumber = parseFloat(val);
        if (!isNaN(parsedNumber)) {
          acc.push(parsedNumber);
        }
      }
      return acc;
    }, [] as number[]);
  } else {
    return [];
  }
}

const TAX_BRACKETS: Record<string, TaxBracketFunction> = {
  I: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    const taxableIncome = applyDeductions(income, deductions);
    return calculateProgressiveTax(taxableIncome);
  },
  II: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    deductions.childAllowance = (deductions.childAllowance || 0) + 4260; // Single parent allowance
    const taxableIncome = applyDeductions(income, deductions);
    return calculateProgressiveTax(taxableIncome);
  },
  III: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    const taxableIncome = applyDeductions(income / 2, deductions);
    const taxResult = calculateProgressiveTax(taxableIncome);
    return {
      tax: taxResult.tax * 2,
      soli: taxResult.soli * 2,
      total: taxResult.total * 2,
    };
  },
  IV: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    const taxableIncome = applyDeductions(income, deductions);
    return calculateProgressiveTax(taxableIncome);
  },
  V: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    const taxableIncome = applyDeductions(income, deductions);
    return calculateProgressiveTax(taxableIncome);
  },
  VI: (income: number, deductions: Deductions = DEFAULT_DEDUCTIONS) => {
    const taxableIncome = applyDeductions(income, deductions);
    return calculateProgressiveTax(taxableIncome);
  },
};

function calculateProgressiveTax(income: number): TaxResult {
  let tax = 0;
  if (income <= 11604) {
    tax = 0; // No tax on income below €11,604
  } else if (income <= 66760) {
    tax =
      (income - 11604) * ((42 - 14) / (66760 - 11604)) +
      0.14 * (income - 11604);
  } else if (income <= 277825) {
    tax = (income - 66760) * 0.42 + (66760 - 11604) * 0.14;
  } else {
    tax =
      (income - 277825) * 0.45 +
      (277825 - 66760) * 0.42 +
      (66760 - 11604) * 0.14;
  }

  const soli = tax * 0.055; // Solidarity surcharge is 5.5% of the tax
  const total = tax + soli;
  return { tax, soli, total };
}

const formSchema = z.object({
  income: z.number().min(0, "Income must be a positive number"),
  taxClass: z.enum(["I", "II", "III", "IV", "V", "VI"]),
  children: z.number().min(0, "Number of children must be a positive number"),
  spouseIncome: z.number().min(0, "Spouse income must be a positive number"),
  specialExpenses: z
    .number()
    .min(0, "Special expenses must be a positive number"),
  extraordinaryBurden: z
    .number()
    .min(0, "Extraordinary burden must be a positive number"),
});

export default function TaxCalculator() {
  const [result, setResult] = useState<TaxResult>({
    tax: 0,
    soli: 0,
    total: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      taxClass: "I",
      children: 0,
      spouseIncome: 0,
      specialExpenses: 0,
      extraordinaryBurden: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const basicAllowance = values.taxClass === "III" ? 21816 : 10908;
    const childAllowance = values.children * 8388;
    const standardIncomeExpenses = 1230;

    let taxableIncome =
      values.income + (values.taxClass === "III" ? values.spouseIncome : 0);
    const totalDeductions =
      basicAllowance +
      childAllowance +
      standardIncomeExpenses +
      values.specialExpenses +
      values.extraordinaryBurden;
    taxableIncome -= totalDeductions;

    const taxDetails = TAX_BRACKETS[values.taxClass](taxableIncome);
    setResult({
      tax: taxDetails.tax,
      soli: taxDetails.soli,
      total: taxDetails.total,
    });

    const netIncome = values.income - taxDetails.total;
    setChartData([
      { name: "Net Income", value: netIncome },
      { name: "Income Tax", value: taxDetails.tax },
      { name: "Solidarity Surcharge", value: taxDetails.soli },
      { name: "Deductions", value: totalDeductions },
    ]);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income (EUR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Class</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tax class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="I">Class I - Single</SelectItem>
                          <SelectItem value="II">
                            Class II - Single Parent
                          </SelectItem>
                          <SelectItem value="III">
                            Class III - Married (higher earner)
                          </SelectItem>
                          <SelectItem value="IV">
                            Class IV - Married (similar income)
                          </SelectItem>
                          <SelectItem value="V">
                            Class V - Married (lower earner)
                          </SelectItem>
                          <SelectItem value="VI">
                            Class VI - Multiple jobs
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("taxClass") === "III" && (
                  <FormField
                    control={form.control}
                    name="spouseIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouses Income (EUR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Children</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Expenses (Sonderausgaben)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="extraordinaryBurden"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Extraordinary Burden (Außergewöhnliche Belastungen)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Calculate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {result.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tax Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Income Tax:</strong> €{result.tax.toFixed(2)}
                </p>
                <p>
                  <strong>Solidarity Surcharge (5.5%):</strong> €
                  {result.soli.toFixed(2)}
                </p>
                <p>
                  <strong>Total (Tax + Soli):</strong> €
                  {result.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          )}

          {chartData.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Income Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        netIncome: {
                          label: "Net Income",
                          color: "hsl(var(--chart-1))",
                        },
                        incomeTax: {
                          label: "Income Tax",
                          color: "hsl(var(--chart-2))",
                        },
                        solidaritySurcharge: {
                          label: "Solidarity Surcharge",
                          color: "hsl(var(--chart-3))",
                        },
                        deductions: {
                          label: "Deductions",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                    >
                      <BarChart data={chartData} accessibilityLayer>
                        <Bar dataKey="value" />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) =>
                                `€${getNumberValues(value)}`
                              }
                            />
                          }
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        netIncome: {
                          label: "Net Income",
                          color: "hsl(var(--chart-1))",
                        },
                        incomeTax: {
                          label: "Income Tax",
                          color: "hsl(var(--chart-2))",
                        },
                        solidaritySurcharge: {
                          label: "Solidarity Surcharge",
                          color: "hsl(var(--chart-3))",
                        },
                        deductions: {
                          label: "Deductions",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                    >
                      <PieChart data={chartData} accessibilityLayer>
                        <Pie dataKey="value" nameKey="name" />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value: ValueType) =>
                                `€${getNumberValues(value)}`
                              }
                            />
                          }
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        netIncome: {
                          label: "Net Income",
                          color: "hsl(var(--chart-1))",
                        },
                        incomeTax: {
                          label: "Income Tax",
                          color: "hsl(var(--chart-2))",
                        },
                        solidaritySurcharge: {
                          label: "Solidarity Surcharge",
                          color: "hsl(var(--chart-3))",
                        },
                        deductions: {
                          label: "Deductions",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                    >
                      <LineChart data={chartData} accessibilityLayer>
                        <Line dataKey="value" />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value: ValueType) => `€${value}`}
                            />
                          }
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
