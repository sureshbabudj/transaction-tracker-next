import {
  Calculator,
  Calendar,
  Check,
  ChevronsUpDown,
  CreditCard,
  Loader2,
  Plus,
  Settings,
  Smile,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

interface ComboboxWithAddProps {
  options: Option[];
  onSelect: (value: string) => void;
  onAdd: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
}

export function ComboboxWithAdd({
  initialValue = "",
  onAdd,
  onSelect,
  options = [],
  placeholder = "Select a Category",
  isLoading = false,
}: ComboboxWithAddProps) {
  const [open, setOpen] = useState(false);
  const [newOption, setNewOption] = useState<string>("");
  const [value, setValue] = useState<string>(initialValue);
  const handleAddNew = () => {
    setOpen(false);
    onAdd(newOption);
  };
  const handleSelect = (value: string) => {
    setValue(value);
    setOpen(false);
    onSelect(value);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              {initialValue === "" ? placeholder : initialValue}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Command>
          <CommandInput
            onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e);
              setNewOption(e.currentTarget.value);
            }}
            placeholder="Type a command or search..."
          />
          <CommandList>
            <CommandEmpty>
              <Button onClick={handleAddNew} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {`Add "${newOption}"`}
              </Button>
            </CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
