"use client";

import { X, Plus } from "lucide-react";
import { useState, useCallback } from "react";

const TagsInput = ({
  value = [],
  onChange,
  error,
  disabled = false,
  placeholder = "Add tags...",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = useCallback(() => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && tag.length <= 50) {
      onChange([...value, tag]);
      setInputValue("");
    }
  }, [inputValue, value, onChange]);

  const handleRemoveTag = useCallback(
    (tagToRemove) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    },
    [value, onChange],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAddTag();
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        handleRemoveTag(value[value.length - 1]);
      }
    },
    [handleAddTag, handleRemoveTag, inputValue, value],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[44px]">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              disabled={disabled}
              className="hover:text-blue-600 dark:hover:text-blue-300 disabled:opacity-50"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm disabled:opacity-50 dark:text-gray-100"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleAddTag}
            disabled={disabled}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Press Enter or comma to add tags. Max 50 characters per tag.
      </p>
    </div>
  );
};

export default TagsInput;
