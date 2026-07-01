"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { applyServerErrors } from "@/lib/errors";

import { STEP_META } from "../constants";
import { useSaveRegistrationStep } from "../queries/registration.query";
import { STEP_DEFAULTS, STEP_SCHEMAS } from "../schemas";

// Renders the field set for a single wizard step. Prefills from the session's
// accumulated stepPayload where present (bank accountNumber comes back redacted,
// so it's intentionally not prefilled).
function StepFields({ step, register, errors, control }) {
  const values = useWatch({ control });

  if (step === "company_verification") {
    return (
      <InputField
        name="companiesHouseNumber"
        label="Companies House number"
        placeholder="12345678"
        register={register}
        error={errors.companiesHouseNumber?.message}
      />
    );
  }

  if (step === "paye_reference") {
    return (
      <InputField
        name="payeReference"
        label="PAYE reference"
        placeholder="123/AB45678"
        register={register}
        error={errors.payeReference?.message}
      />
    );
  }

  if (step === "das_account") {
    return (
      <div className="space-y-4">
        <CheckboxField
          name="hasDasAccount"
          label="We already have a DAS account"
          register={register}
        />
        {values.hasDasAccount ? (
          <InputField
            name="dasReference"
            label="DAS reference"
            placeholder="DAS-000000"
            register={register}
            error={errors.dasReference?.message}
          />
        ) : (
          <CheckboxField
            name="dasAccountCreated"
            label="We've just created a DAS account"
            register={register}
          />
        )}
      </div>
    );
  }

  if (step === "bank_details") {
    return (
      <div className="space-y-4">
        <InputField
          name="accountName"
          label="Account name"
          register={register}
          error={errors.accountName?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            name="sortCode"
            label="Sort code"
            placeholder="12-34-56"
            register={register}
            error={errors.sortCode?.message}
          />
          <InputField
            name="accountNumber"
            label="Account number"
            placeholder="12345678"
            inputMode="numeric"
            register={register}
            error={errors.accountNumber?.message}
          />
        </div>
      </div>
    );
  }

  // consent
  return (
    <div className="space-y-4">
      <InputField
        name="signatoryName"
        label="Signatory name"
        register={register}
        error={errors.signatoryName?.message}
      />
      <InputField
        name="contactEmail"
        label="Contact email (optional)"
        type="email"
        register={register}
        error={errors.contactEmail?.message}
      />
      <CheckboxField
        name="levyTransferConsent"
        label="I consent to receiving apprenticeship levy transfer funding."
        register={register}
        error={errors.levyTransferConsent?.message}
      />
      <CheckboxField
        name="dataProcessingConsent"
        label="I consent to Gradlly processing this data to set up my account."
        register={register}
        error={errors.dataProcessingConsent?.message}
      />
    </div>
  );
}

export function RegistrationStepForm({ token, step, stepPayload }) {
  const meta = STEP_META[step];

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(STEP_SCHEMAS[step]),
    defaultValues: {
      ...STEP_DEFAULTS[step],
      // Prefill previously-saved values for this step (redacted fields excluded).
      ...(stepPayload?.[step] ?? {}),
    },
    mode: "onBlur",
  });

  const { mutate, isPending, error } = useSaveRegistrationStep(token, {
    onError: (err) => applyServerErrors(err, setError),
  });

  const onSubmit = (payload) => mutate({ step, payload });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          {meta?.title}
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">{meta?.description}</p>
      </div>

      <StepFields
        step={step}
        register={register}
        errors={errors}
        control={control}
      />

      {error && !error.fieldErrors ? (
        <p className="text-sm text-danger-600" role="alert">
          {error.message}
        </p>
      ) : null}

      <Button type="submit" color="green" loading={isPending}>
        Save & continue
      </Button>
    </form>
  );
}
