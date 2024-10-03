"use client";

import React from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getZodVlidationSchema(sections: Section[]) {
  const validationSchema: { [k: string]: any } = {};
  const recuriveFn = (sec: Section[]) =>
    sec.forEach((section) => {
      if (section.type === "group") {
        recuriveFn(section.sections || []);
      } else if (section.type === "select" && section.options?.length) {
        validationSchema[section.label] = z
          .string({ message: `Enter a valid string for ${section.label}` })
          .default(section.options[0]);
      } else if (section.type === "text") {
        validationSchema[section.label] = z
          .string({ message: `Enter a valid string for ${section.label}` })
          .default("");
      } else if (section.type === "date") {
        validationSchema[section.label] = z
          .date({ message: `Enter a valid date for ${section.label}` })
          .default(new Date());
      } else {
        validationSchema[section.label] = z
          .number({ message: `Enter a valid value for ${section.label}` })
          .default(0);
      }
    });
  recuriveFn(sections);
  return z.object(validationSchema);
}

export default function TaxForm() {
  const formFields = [personalInfoSchema].concat(germanTaxSchema);
  const validationSchema = getZodVlidationSchema(formFields);

  const handleSubmit = (formData: FormData) => {
    const { data, error } = validationSchema.safeParse(formData);

    if (!data) {
      console.log(error);
      return;
    }

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

    let fieldInput;
    switch (field.type) {
      case "select":
        fieldInput = (
          <div className="mb-4">
            <Label htmlFor={name.toLowerCase().replace(/\s/g, "-")}>
              {field.label}
            </Label>
            <input type="text" className="hidden" name={name} />
            <Select
              onValueChange={(value) => {
                const hiddenInput: HTMLInputElement | null =
                  document.querySelector(`input[name="${name}"]`);
                if (hiddenInput) {
                  hiddenInput.value = value;
                }
              }}
            >
              <SelectTrigger
                className="bg-white"
                id={name.toLowerCase().replace(/\s/g, "-")}
              >
                <SelectValue placeholder={`Select ${name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        break;
      default:
        fieldInput = (
          <div className="mb-4">
            <Label htmlFor={name.toLowerCase().replace(/\s/g, "-")}>
              {field.label}
            </Label>
            <Input
              className="bg-white"
              id={name.toLowerCase().replace(/\s/g, "-")}
              name={name}
              type={field.type === "date" ? "date" : "text"}
              placeholder={`Enter ${field.label}`}
            />
            {/* todo: error message display  */}
            {Number("2") === 1 && (
              <p className="text-red-500 text-xs">{name}</p>
            )}
          </div>
        );
        break;
    }
    return fieldInput;
  };

  const renderFields = (fields = formFields) => {
    return fields.map((field) => renderField(field));
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Calculate Tax for the year 2024</CardTitle>
        <CardDescription>Fill up below German tax fields...</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={(e) => {
            "use client";
            handleSubmit(e);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFields()}
          </div>
          <div className="flex gap-2 justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
