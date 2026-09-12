"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  NumericFormat,
  type NumericFormatProps,
  type OnValueChange,
} from "react-number-format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<NumericFormatProps, "value" | "onValueChange"> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  className?: string;
  disabled?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value: controlledValue,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number | undefined>(
      defaultValue,
    );
    const value = isControlled ? controlledValue : internalValue;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const valueRef = useRef<number | undefined>(value);
    valueRef.current = value;

    const updateValue = useCallback(
      (newValue: number | undefined) => {
        let val = newValue;
        if (
          val !== undefined &&
          decimalScale !== undefined &&
          decimalScale > 0
        ) {
          val = Number(val.toFixed(decimalScale));
        }
        const clampedValue =
          val === undefined ? undefined : Math.max(min, Math.min(max, val));

        valueRef.current = clampedValue;
        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        if (onValueChange) {
          onValueChange(clampedValue);
        }
      },
      [isControlled, min, max, onValueChange, decimalScale],
    );

    const handleIncrement = useCallback(() => {
      updateValue((valueRef.current ?? 0) + (stepper ?? 1));
    }, [updateValue, stepper]);

    const handleDecrement = useCallback(() => {
      updateValue((valueRef.current ?? 0) - (stepper ?? 1));
    }, [updateValue, stepper]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleDecrement();
      }
    };

    const handleChange: OnValueChange = (values, sourceInfo) => {
      if (sourceInfo.source === "event") {
        updateValue(values.floatValue);
      }
    };

    const handleBlur = () => {
      if (value !== undefined) {
        if (value < min) {
          updateValue(min);
        } else if (value > max) {
          updateValue(max);
        }
      }
    };

    return (
      <div className="flex items-center">
        <NumericFormat
          value={value ?? ""}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className={cn(
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative",
            className,
          )}
          getInputRef={inputRef}
          disabled={disabled}
          {...props}
        />
        <div className="flex flex-col">
          <Button
            type="button"
            aria-label="Increase value"
            className="px-2 h-5 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleIncrement}
            disabled={disabled || (value !== undefined && value >= max)}
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            type="button"
            aria-label="Decrease value"
            className="px-2 h-5 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleDecrement}
            disabled={disabled || (value !== undefined && value <= min)}
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";
