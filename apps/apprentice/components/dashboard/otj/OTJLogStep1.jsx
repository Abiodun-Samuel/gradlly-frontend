"use client";

import { useWatch } from "react-hook-form";

import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";

const CATEGORY_OPTIONS = [
  { value: "taught_learning", text: "Taught learning" },
  { value: "applied_project", text: "Applied project" },
  { value: "mentoring_coaching", text: "Mentoring & coaching" },
  { value: "job_shadowing", text: "Job shadowing" },
  { value: "off_site_learning", text: "Off-site learning" },
  { value: "other", text: "Other" },
];

export function OTJLogStep1({ register, errors, control, setValue }) {
  const categoryValue = useWatch({ control, name: "category" });

  return (
    <div className="space-y-4">
      <InputField
        name="activityName"
        label="Activity description"
        placeholder="e.g. Completed unit testing module on Udemy"
        register={register}
        error={errors.activityName?.message}
        required
        autoFocus
      />

      <SingleSelectField
        name="category"
        label="Category"
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
        register={register}
        setValue={setValue}
        value={categoryValue}
        error={errors.category?.message}
        required
        searchable={false}
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          name="loggedDate"
          label="Date"
          type="date"
          register={register}
          error={errors.loggedDate?.message}
          required
        />
        <InputField
          name="hours"
          label="Hours"
          type="number"
          placeholder="0.0"
          min="0.5"
          max="24"
          step="0.5"
          register={register}
          error={errors.hours?.message}
          required
        />
      </div>
    </div>
  );
}
