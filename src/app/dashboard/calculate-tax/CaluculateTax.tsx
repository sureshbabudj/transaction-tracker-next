"use client";

import React, { useRef } from "react";
import {
  calculateTax,
  Expense,
  findSection,
  germanTaxSchema,
  Income,
  personalInfoSchema,
  Section,
} from "./taxCalculator";
import { z } from "zod";

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

export default function TaxForm() {
  const taxForm = useRef(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!taxForm.current) {
      return;
    }
    const formData = new FormData(taxForm.current);
    const data: { [k: string]: any } = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
      data[key] = value;
    });

    const incomes: Income[] = [];
    const expenses: Expense[] = [];

    for (const key in data) {
      const sec = findSection(key);
      if (sec) {
        const value = parseInt(data[key], 10);
        const amount = isNaN(value) ? 0 : value;
        if (sec.serialNo.startsWith("2")) {
          expenses.push({ type: key, amount });
        } else if (sec.serialNo.startsWith("1")) {
          incomes.push({ type: key, amount });
        }
      }
    }

    const result = calculateTax(incomes, expenses, data["Tax class"]);

    console.log(data, incomes, expenses, result);
  };

  const renderField = (field: Section) => {
    const name = field.label;

    if (field.type === "group") {
      return (
        <div className="m-2" key={field.serialNo}>
          {field.serialNo.split(".").length === 3 ? (
            <h4 className="text-md font-bold mb-5" key={field.serialNo}>
              {field.label}
            </h4>
          ) : (
            <h3 className="text-lg font-bold mb-4" key={field.serialNo}>
              {field.label}
            </h3>
          )}
          {field.sections && renderFields(field.sections)}
        </div>
      );
    }

    const fieldLabel = <label htmlFor={name}>{field.label}</label>;
    let fieldInput;
    switch (field.type) {
      case "text":
        fieldInput = <input type="text" name={name} />;
        break;
      case "select":
        fieldInput = (
          <select name={name}>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        break;
      case "date":
        fieldInput = <input type="date" name={name} />;
        break;
      default:
        fieldInput = <input type="number" name={name} />;
    }
    return (
      <div className="flex flex-col gap-2 mb-6" key={field.serialNo}>
        <div>{fieldLabel}</div>
        <div>{fieldInput}</div>
      </div>
    );
  };

  const renderFields = (
    fields = [personalInfoSchema].concat(germanTaxSchema)
  ) => {
    return fields.map((field) => renderField(field));
  };

  return (
    <div>
      <h1>Tax Form</h1>
      <form ref={taxForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderFields()}
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
