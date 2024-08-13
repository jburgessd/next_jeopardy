import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldPath, UseFormReturn } from "react-hook-form";
import { ArchiveSchema, cn } from "@/lib/utils";
import { z } from "zod";
import { ArchiveLists } from "@/types";
import { Button } from "./ui/button";

const formSchema = ArchiveSchema("");

interface HostFormFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  empty: string;
  description: string;
  list: ArchiveLists[];
  setListItem: (item: ArchiveLists) => void;
}

const HostFormControl = ({
  form,
  control,
  name,
  label,
  placeholder,
  empty,
  description,
  list,
  setListItem,
}: HostFormFieldProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between bg-clue-gradient border-black-0 border-2 text-white-0",
                    !value && "text-muted-foreground"
                  )}
                >
                  {value
                    ? list.find((li) => li.text === value)?.text
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-100" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-clue-gradient border-black-0 border-2 scrollbar-hide">
              <Command>
                <CommandInput placeholder="Search" />
                <CommandList>
                  <CommandEmpty>{empty}</CommandEmpty>
                  <CommandGroup>
                    {list.map((li) => (
                      <CommandItem
                        value={li.text}
                        key={li.text}
                        className="font-korinna hover:bg-slate-400 hover:bg-opacity-20 hover:cursor-pointer"
                        onSelect={(currList) => {
                          setListItem(
                            currList === value ? { text: "", href: "" } : li
                          );
                          setValue(currList === value ? "" : currList);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            li.text === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {li.text}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HostFormControl;
