// import { useState, memo, useEffect, useRef } from "react";

// const MultiSelectForm = memo(({
//     label,
//     name,
//     options = [],
//     register = () => { },
//     setValue,
//     error,
//     placeholder = "Select options",
//     required = false,
//     disabled = false,
//     searchable = true,
//     maxHeight = "16rem",
//     expandParent = false,
//     defaultValue = []
// }) => {
//     const [selectedValues, setSelectedValues] = useState(defaultValue);
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [dropdownHeight, setDropdownHeight] = useState(0);
//     const dropdownRef = useRef(null);
//     const searchInputRef = useRef(null);
//     const dropdownContentRef = useRef(null);
//     const containerRef = useRef(null);
//     const prevDefaultValueRef = useRef(defaultValue);

//     // Sync internal state when defaultValue changes (with deep comparison)
//     useEffect(() => {
//         const hasChanged =
//             defaultValue.length !== prevDefaultValueRef.current.length ||
//             defaultValue.some((val, idx) => val !== prevDefaultValueRef.current[idx]);

//         if (hasChanged) {
//             setSelectedValues(defaultValue);
//             prevDefaultValueRef.current = defaultValue;
//         }
//     }, [defaultValue]);

//     // Register with react-hook-form
//     useEffect(() => {
//         if (register && name) {
//             register(name, {
//                 required: required ? `${label || 'This field'} is required` : false,
//             });
//         }
//     }, [register, name, required, label]);

//     // Update form value when selection changes
//     useEffect(() => {
//         if (setValue && name) {
//             setValue(name, selectedValues);
//         }
//     }, [selectedValues, setValue, name]);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//                 setSearchQuery("");
//             }
//         };

//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen]);

//     // Focus search input when dropdown opens
//     useEffect(() => {
//         if (isOpen && searchable && searchInputRef.current) {
//             searchInputRef.current.focus();
//         }
//     }, [isOpen, searchable]);

//     // Measure dropdown height and animate parent container
//     useEffect(() => {
//         if (expandParent) {
//             if (isOpen && dropdownContentRef.current) {
//                 const height = dropdownContentRef.current.offsetHeight;
//                 setDropdownHeight(height);
//             } else {
//                 setDropdownHeight(0);
//             }
//         }
//     }, [isOpen, searchQuery, options, expandParent]);

//     const toggleDropdown = () => {
//         if (!disabled) {
//             setIsOpen((prev) => !prev);
//         }
//     };

//     const handleSelect = (optionValue) => {
//         const newSelectedValues = selectedValues.includes(optionValue)
//             ? selectedValues.filter((value) => value !== optionValue)
//             : [...selectedValues, optionValue];

//         setSelectedValues(newSelectedValues);
//     };

//     const removeOption = (value, event) => {
//         event?.stopPropagation();
//         const newSelectedValues = selectedValues.filter((val) => val !== value);
//         setSelectedValues(newSelectedValues);
//     };

//     const clearAll = (event) => {
//         event?.stopPropagation();
//         setSelectedValues([]);
//     };

//     const selectedOptions = selectedValues
//         .map(value => options.find(option => option.value === value))
//         .filter(Boolean);

//     const isSelected = (value) => selectedValues.includes(value);

//     // Filter options based on search query
//     const filteredOptions = searchable && searchQuery
//         ? options.filter((option) =>
//             option.text.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//         : options;

//     return (
//         <div
//             ref={containerRef}
//             className="w-full transition-all duration-300 ease-in-out"
//             style={{
//                 paddingBottom: expandParent && isOpen ? `${dropdownHeight + 8}px` : '0px'
//             }}
//         >
//             <div ref={dropdownRef}>
//                 {label && (
//                     <label
//                         htmlFor={name}
//                         className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
//                     >
//                         {label}
//                         {required && <span className="text-red-500 ml-0.5" aria-label="required">*</span>}
//                     </label>
//                 )}

//                 <div className="relative inline-block w-full">
//                     {/* Main Control Wrapper */}
//                     <div className="flex items-center gap-2">
//                         {/* Main Select Area - Now a DIV instead of BUTTON */}
//                         <div
//                             id={name}
//                             onClick={toggleDropdown}
//                             aria-invalid={error ? "true" : "false"}
//                             aria-describedby={error ? `${name}-error` : undefined}
//                             className={`
//                                 flex-1 flex items-start justify-between rounded-lg px-4 py-2.5 text-left min-h-[2.75rem]
//                                 transition-colors duration-200
//                                 bg-white dark:bg-gray-800
//                                 border focus:outline-none focus:ring-1
//                                 ${error
//                                     ? "border-red-500 dark:border-red-400 focus:ring-red-200 dark:focus:ring-red-900"
//                                     : isOpen
//                                         ? "border-blue-500 dark:border-blue-400 ring-1 ring-blue-200 dark:ring-blue-900"
//                                         : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-400"
//                                 }
//                                 ${disabled
//                                     ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60"
//                                     : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
//                                 }
//                             `}
//                             role="combobox"
//                             aria-haspopup="listbox"
//                             aria-expanded={isOpen}
//                             aria-labelledby={label ? `${name}-label` : undefined}
//                             tabIndex={disabled ? -1 : 0}
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter' || e.key === ' ') {
//                                     e.preventDefault();
//                                     toggleDropdown();
//                                 }
//                             }}
//                         >
//                             {/* Selected Tags Container */}
//                             <div className="flex flex-wrap gap-1.5 flex-1 items-center mr-2">
//                                 {selectedOptions.length > 0 ? (
//                                     selectedOptions.map((option, index) => (
//                                         <div
//                                             key={`${option.value}-${index}`}
//                                             className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
//                                         >
//                                             <span className="max-w-[200px] truncate">
//                                                 {option.text}
//                                             </span>
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => removeOption(option.value, e)}
//                                                 className="ml-1 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
//                                                 aria-label={`Remove ${option.text}`}
//                                                 tabIndex={-1}
//                                             >
//                                                 <svg
//                                                     className="w-3 h-3"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth={2}
//                                                         d="M6 18L18 6M6 6l12 12"
//                                                     />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <span className="text-sm text-gray-400 dark:text-gray-500">
//                                         {placeholder}
//                                     </span>
//                                 )}
//                             </div>

//                             {/* Dropdown arrow */}
//                             <div className="flex items-center flex-shrink-0 pt-0.5">
//                                 <svg
//                                     className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
//                                         }`}
//                                     width="20"
//                                     height="20"
//                                     viewBox="0 0 20 20"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
//                                         stroke="currentColor"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                 </svg>
//                             </div>
//                         </div>

//                         {/* Clear All Button */}
//                         {selectedValues.length > 0 && !disabled && (
//                             <button
//                                 type="button"
//                                 onClick={clearAll}
//                                 className="flex items-center justify-center w-10 h-[2.75rem] rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 transition-colors duration-200"
//                                 aria-label="Clear all selections"
//                             >
//                                 <svg
//                                     width="16"
//                                     height="16"
//                                     viewBox="0 0 16 16"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M12 4L4 12M4 4L12 12"
//                                         stroke="currentColor"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                 </svg>
//                             </button>
//                         )}
//                     </div>

//                     {/* Dropdown Menu */}
//                     {isOpen && (
//                         <div
//                             ref={dropdownContentRef}
//                             className="absolute left-0 z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
//                             role="listbox"
//                             aria-labelledby={label ? `${name}-label` : undefined}
//                         >
//                             {/* Search Input */}
//                             {searchable && (
//                                 <div className="p-2 border-b border-gray-200 dark:border-gray-700">
//                                     <div className="relative">
//                                         <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                                             <svg
//                                                 className="w-4 h-4 text-gray-400 dark:text-gray-500"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <input
//                                             ref={searchInputRef}
//                                             type="text"
//                                             value={searchQuery}
//                                             onChange={(e) => setSearchQuery(e.target.value)}
//                                             placeholder="Search..."
//                                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-200"
//                                             onClick={(e) => e.stopPropagation()}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Options List */}
//                             <div
//                                 className="overflow-y-auto py-1"
//                                 style={{ maxHeight }}
//                             >
//                                 {filteredOptions.length > 0 ? (
//                                     filteredOptions.map((option, index) => {
//                                         const selected = isSelected(option.value);
//                                         return (
//                                             <button
//                                                 key={`${option.value}-${index}`}
//                                                 type="button"
//                                                 onClick={() => handleSelect(option.value)}
//                                                 className={`w-full text-left px-4 py-2.5 text-sm font-normal transition-colors duration-200 flex items-center ${selected
//                                                     ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
//                                                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                                                     }`}
//                                                 role="option"
//                                                 aria-selected={selected}
//                                             >
//                                                 {/* Checkbox */}
//                                                 <div className="mr-3 flex-shrink-0">
//                                                     <div
//                                                         className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selected
//                                                             ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
//                                                             : "border-gray-300 dark:border-gray-600"
//                                                             }`}
//                                                     >
//                                                         {selected && (
//                                                             <svg
//                                                                 className="w-3 h-3 text-white"
//                                                                 fill="none"
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 strokeWidth="2"
//                                                                 viewBox="0 0 24 24"
//                                                                 stroke="currentColor"
//                                                             >
//                                                                 <path d="M5 13l4 4L19 7" />
//                                                             </svg>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 <span className="flex-1 truncate">{option.text}</span>
//                                             </button>
//                                         );
//                                     })
//                                 ) : (
//                                     <div className="px-4 py-6 text-sm text-center text-gray-400 dark:text-gray-500">
//                                         <svg
//                                             className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={1.5}
//                                                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                             />
//                                         </svg>
//                                         <p className="font-medium">
//                                             {searchQuery ? "No results found" : "No options available"}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                     <p
//                         id={`${name}-error`}
//                         className="text-red-500 dark:text-red-400 text-xs mt-1"
//                         role="alert"
//                     >
//                         {error}
//                     </p>
//                 )}

//                 {/* Helper Text */}
//                 {selectedValues.length > 0 && !error && (
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                         {selectedValues.length} item{selectedValues.length !== 1 ? "s" : ""} selected
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// });

// MultiSelectForm.displayName = "MultiSelectForm";
// export default MultiSelectForm

import { useState, memo, useEffect, useRef } from "react";

// MultiSelectForm - Updated borders and height
const MultiSelectForm = memo(
  ({
    label,
    name,
    options = [],
    register = () => {},
    setValue,
    error,
    placeholder = "Select options",
    required = false,
    disabled = false,
    searchable = true,
    maxHeight = "16rem",
    expandParent = false,
    defaultValue = [],
  }) => {
    const [selectedValues, setSelectedValues] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownHeight, setDropdownHeight] = useState(0);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const containerRef = useRef(null);
    const prevDefaultValueRef = useRef(defaultValue);

    useEffect(() => {
      const hasChanged =
        defaultValue.length !== prevDefaultValueRef.current.length ||
        defaultValue.some(
          (val, idx) => val !== prevDefaultValueRef.current[idx],
        );

      if (hasChanged) {
        setSelectedValues(defaultValue);
        prevDefaultValueRef.current = defaultValue;
      }
    }, [defaultValue]);

    useEffect(() => {
      if (register && name) {
        register(name, {
          required: required ? `${label || "This field"} is required` : false,
        });
      }
    }, [register, name, required, label]);

    useEffect(() => {
      if (setValue && name) {
        setValue(name, selectedValues);
      }
    }, [selectedValues, setValue, name]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    useEffect(() => {
      if (expandParent) {
        if (isOpen && dropdownContentRef.current) {
          const height = dropdownContentRef.current.offsetHeight;
          setDropdownHeight(height);
        } else {
          setDropdownHeight(0);
        }
      }
    }, [isOpen, searchQuery, options, expandParent]);

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen((prev) => !prev);
      }
    };

    const handleSelect = (optionValue) => {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];

      setSelectedValues(newSelectedValues);
    };

    const removeOption = (value, event) => {
      event?.stopPropagation();
      const newSelectedValues = selectedValues.filter((val) => val !== value);
      setSelectedValues(newSelectedValues);
    };

    const clearAll = (event) => {
      event?.stopPropagation();
      setSelectedValues([]);
    };

    const selectedOptions = selectedValues
      .map((value) => options.find((option) => option.value === value))
      .filter(Boolean);

    const isSelected = (value) => selectedValues.includes(value);

    const filteredOptions =
      searchable && searchQuery
        ? options.filter((option) =>
            option.text.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : options;

    return (
      <div
        ref={containerRef}
        className="w-full transition-all duration-300 ease-in-out"
        style={{
          paddingBottom:
            expandParent && isOpen ? `${dropdownHeight + 8}px` : "0px",
        }}
      >
        <div ref={dropdownRef}>
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}

          <div className="relative inline-block w-full">
            <div className="flex items-center gap-2">
              <div
                id={name}
                onClick={toggleDropdown}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`
                                flex-1 flex items-start justify-between rounded-lg px-4 py-2.5
                                transition-all duration-200
                                bg-white text-gray-900 min-h-[2.75rem]
                                border-[1.5px] focus:outline-none
                                ${
                                  error
                                    ? "border-red-500 focus:border-red-600"
                                    : isOpen
                                      ? "border-blue-500"
                                      : "border-gray-200 focus:border-blue-500"
                                }
                                ${
                                  disabled
                                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                }
                            `}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${name}-label` : undefined}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDropdown();
                  }
                }}
              >
                <div className="flex flex-wrap gap-1.5 flex-1 items-center mr-2">
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((option, index) => (
                      <div
                        key={`${option.value}-${index}`}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-200"
                      >
                        <span className="max-w-[200px] truncate">
                          {option.text}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => removeOption(option.value, e)}
                          className="ml-1 flex items-center justify-center text-blue-600 hover:text-blue-800 focus:outline-none"
                          aria-label={`Remove ${option.text}`}
                          tabIndex={-1}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">{placeholder}</span>
                  )}
                </div>

                <div className="flex items-center flex-shrink-0 pt-0.5">
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {selectedValues.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center justify-center w-10 h-[2.75rem] rounded-lg border-[1.5px] border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 hover:bg-red-50 focus:outline-none transition-colors duration-200"
                  aria-label="Clear all selections"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {isOpen && (
              <div
                ref={dropdownContentRef}
                className="absolute left-0 z-50 w-full mt-1 bg-white rounded-lg shadow-lg border-[1.5px] border-gray-200 overflow-hidden"
                role="listbox"
                aria-labelledby={label ? `${name}-label` : undefined}
              >
                {searchable && (
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-9 pr-3 py-2 text-sm border-[1.5px] border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                <div className="overflow-y-auto py-1" style={{ maxHeight }}>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => {
                      const selected = isSelected(option.value);
                      return (
                        <button
                          key={`${option.value}-${index}`}
                          type="button"
                          onClick={() => handleSelect(option.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-normal transition-colors duration-200 flex items-center ${
                            selected
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          role="option"
                          aria-selected={selected}
                        >
                          <div className="mr-3 flex-shrink-0">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                selected
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="flex-1 truncate">{option.text}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-sm text-center text-gray-400">
                      <svg
                        className="w-10 h-10 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="font-medium">
                        {searchQuery
                          ? "No results found"
                          : "No options available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <p
              id={`${name}-error`}
              className="mt-1.5 text-xs text-red-600 font-medium"
              role="alert"
            >
              {error}
            </p>
          )}

          {selectedValues.length > 0 && !error && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedValues.length} item
              {selectedValues.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>
    );
  },
);

MultiSelectForm.displayName = "MultiSelectForm";
export default MultiSelectForm;
