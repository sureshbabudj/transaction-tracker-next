"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Rabbit, Bird, Turtle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommonTransaction, parseCSV } from "@/app/utils/parseCSV";

export interface ProcessedTransactions {
  transactions: CommonTransaction[];
  accountHolderName: string;
  bankType: string;
}

interface Props {
  postMessage: (status: boolean, data: ProcessedTransactions | null) => void;
}

export function UploadForm({ postMessage }: Props) {
  const [bankType, setBankType] = useState<string>("");
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const banks = [
    {
      desc: "Choose for Commerzbank",
      icon: Rabbit,
      value: "commerzbank",
      label: "Commerzbank",
    },
    { desc: "Choose for Revolt", icon: Bird, value: "revolt", label: "Revolt" },
    { desc: "Choose for Wise", icon: Turtle, value: "wise", label: "Wise" },
  ];

  const handleFileUpload = (
    file: File
  ): Promise<CommonTransaction[] | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvData = e.target?.result as string;
          const parsedTransactions = await parseCSV(
            csvData,
            bankType,
            accountHolderName
          );
          resolve(parsedTransactions);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!bankType) newErrors.bankType = "Bank type is required.";
    if (!accountHolderName)
      newErrors.accountHolderName = "Account holder name is required.";
    if (!file) newErrors.file = "File is required.";
    else if (file.type !== "text/csv")
      newErrors.file = "Please upload a valid CSV file.";
    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    try {
      const transactions = await handleFileUpload(file!);
      if (!transactions) throw "No transactions found.";
      postMessage(true, { transactions, accountHolderName, bankType });
    } catch (error) {
      postMessage(false, null);
    }
  };

  return (
    <form className="grid w-full items-start gap-6" onSubmit={handleSubmit}>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Upload CSV</legend>
        <div className="grid gap-3">
          <Label htmlFor="model">Model</Label>
          <Select onValueChange={setBankType}>
            <SelectTrigger
              id="model"
              className="items-start [&_[data-description]]:hidden"
            >
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem value={bank.value} key={bank.value}>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <bank.icon className="size-5" />
                    <div className="grid gap-0.5">
                      <p>
                        {bank.label}
                        <span className="font-medium text-foreground">
                          {" "}
                          Bank
                        </span>
                      </p>
                      <p className="text-xs" data-description>
                        {bank.desc}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bankType && (
            <p className="text-red-500 text-xs">{errors.bankType}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="account-holder-name">Account Holder Name</Label>
            <Input
              id="account-holder-name"
              type="text"
              placeholder="Account Holder Name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-xs">{errors.accountHolderName}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="file-upload">Upload File</Label>
            <Input
              id="file-upload"
              type="file"
              placeholder="Upload File"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {errors.file && (
              <p className="text-red-500 text-xs">{errors.file}</p>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Button type="submit">Submit</Button>
        </div>
      </fieldset>
    </form>
  );
}
