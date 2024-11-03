'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type ComboboxProps = {
  options: Array<Option>;
  placeholderText: string;
  noOptionsText: string;
  setValuesCallback?: (values: Array<string>) => void;
};

export const ComboboxMulti = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & ComboboxProps
>(({ className, options, placeholderText, noOptionsText, setValuesCallback, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<Array<string>>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedValues.length ? (
            <span>
              {selectedValues.length} option{selectedValues.length > 1 && 's'} selected
            </span>
          ) : (
            placeholderText
          )}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={ref} className={cn('w-[200px] p-0', className)} {...props}>
        <Command>
          <CommandInput placeholder={placeholderText} />
          <CommandList>
            <CommandEmpty>{noOptionsText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className='hover:cursor-pointer'
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedValues((values) => {
                      const finalState = values.includes(currentValue)
                        ? values.filter((v) => v !== currentValue)
                        : [...values, currentValue];

                      if (setValuesCallback) {
                        setValuesCallback(finalState);
                      }

                      return finalState;
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
