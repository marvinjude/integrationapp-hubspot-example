import React, { useState } from "react";
import { Input } from "./input";

export const TagInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    value: string[];
    setValue: (value: string[]) => void;
  }
>(({ className, value, setValue, ...props }, ref) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setValue([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setValue(value.filter((_: string, i: number) => i !== index));
  };

  return (
    <div>
      <Input
        ref={ref}
        className={className}
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        {...props}
      />
      <div className="flex flex-wrap my-2 text-sm">
        {value.map((tag: string, index: number) => (
          <span key={index} className="mr-2 bg-gray-100 rounded p-1">
            {tag}
            <button
              onClick={() => handleRemoveTag(index)}
              className="ml-1 px-1"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
});

TagInput.displayName = "TagInput";
