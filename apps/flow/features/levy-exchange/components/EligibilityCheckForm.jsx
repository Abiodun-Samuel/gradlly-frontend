"use client";

import { useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";

import {
  ELIGIBILITY_REGIONS,
  ELIGIBILITY_SECTORS,
  EMPLOYEE_COUNT_BANDS,
} from "../constants";
import { useCheckLevyEligibility } from "../queries/levy-exchange.query";

export function EligibilityCheckForm() {
  const [form, setForm] = useState({
    employeeCountBand: "10_49",
    sector: "construction",
    region: "north_west",
    hasDasAccount: false,
  });

  const { mutate, data, isPending, isError, error } = useCheckLevyEligibility();

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  const statusColor =
    data?.status === "eligible"
      ? "green"
      : data?.status === "check_with_advisor"
        ? "yellow"
        : "red";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="eyebrow">Eligibility</p>
          <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
            Check levy transfer eligibility
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <SingleSelectField
              name="employeeCountBand"
              label="Employee count"
              value={form.employeeCountBand}
              setValue={setField}
              options={EMPLOYEE_COUNT_BANDS}
            />
            <SingleSelectField
              name="sector"
              label="Sector"
              value={form.sector}
              setValue={setField}
              options={ELIGIBILITY_SECTORS}
            />
            <SingleSelectField
              name="region"
              label="Region"
              value={form.region}
              setValue={setField}
              options={ELIGIBILITY_REGIONS}
            />
            <div className="flex items-end sm:col-span-2">
              <CheckboxField
                name="hasDasAccount"
                label="Already has a DAS account"
                checked={form.hasDasAccount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hasDasAccount: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" loading={isPending}>
                Check eligibility
              </Button>
            </div>
          </form>
          {isError ? (
            <p className="mt-4 text-sm text-danger-600">
              {error?.message ?? "Eligibility check failed."}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {data ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <p className="eyebrow">Result</p>
              <TextBadge variant="light" color={statusColor} size="xs">
                {data.status?.replace(/_/g, " ")}
              </TextBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.estimatedFundingBand ? (
              <p className="text-sm text-neutral-600">
                Estimated funding band:{" "}
                <span className="font-semibold text-neutral-900">
                  £{data.estimatedFundingBand.min.toLocaleString()} – £
                  {data.estimatedFundingBand.max.toLocaleString()}
                </span>
              </p>
            ) : null}
            {data.nextSteps?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600">
                {data.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
