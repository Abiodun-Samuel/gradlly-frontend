"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useUpdateProfile } from "@/features/auth/queries/auth.query";
import { applyServerErrors } from "@/lib/errors";
import { getFullName, getInitials } from "@/utils/helper";

import {
  GENDER_OPTIONS,
  LOCALE_OPTIONS,
  TITLE_OPTIONS,
  profileDefaultsFromUser,
  profileSchema,
  toProfilePayload,
} from "../schemas";

// Timezone options — derived from the platform list when available.
function buildTimezoneOptions() {
  try {
    const zones = Intl.supportedValuesOf?.("timeZone") ?? [];
    if (zones.length) return zones.map((z) => ({ value: z, text: z }));
  } catch {
    // fall through to a curated list
  }
  return [
    "Europe/London",
    "Europe/Dublin",
    "Europe/Paris",
    "Europe/Berlin",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Australia/Sydney",
  ].map((z) => ({ value: z, text: z }));
}

function FormSection({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function ProfileForm() {
  const { user } = useAuthUser();
  const timezoneOptions = useMemo(() => buildTimezoneOptions(), []);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultsFromUser(user),
    mode: "onBlur",
  });

  // The profile arrives asynchronously; hydrate the form once it is available.
  useEffect(() => {
    if (user) reset(profileDefaultsFromUser(user));
  }, [user, reset]);

  const titleValue = useWatch({ control, name: "title", defaultValue: "" });
  const genderValue = useWatch({ control, name: "gender", defaultValue: "" });
  const localeValue = useWatch({ control, name: "locale", defaultValue: "" });
  const timezoneValue = useWatch({
    control,
    name: "timezone",
    defaultValue: "",
  });

  const { mutateAsync, isPending, error: serverError } = useUpdateProfile();
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      await mutateAsync(toProfilePayload(values));
      reset(values); // clears the dirty state after a successful save
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = getFullName(user);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <ServerErrorAlert showFieldList error={serverError} />

      {/* Identity summary (read-only) */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              initials={initials}
              src={user?.avatarUrl}
              size="xl"
              className="ring-2 ring-primary-100"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-neutral-900">
                {fullName}
              </p>
              <p className="truncate text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <fieldset disabled={disabled} className="contents space-y-6">
        {/* Personal details */}
        <FormSection
          title="Personal details"
          description="Your name and contact information."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SingleSelectField
              name="title"
              label="Title"
              options={TITLE_OPTIONS}
              register={register}
              setValue={setValue}
              value={titleValue}
              error={errors.title?.message}
              placeholder="Select"
              searchable={false}
            />
            <InputField
              required
              name="firstName"
              label="First name"
              register={register}
              error={errors.firstName?.message}
            />
            <InputField
              required
              name="lastName"
              label="Last name"
              register={register}
              error={errors.lastName?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              name="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              register={register}
              error={errors.phone?.message}
            />
            <InputField
              name="dateOfBirth"
              label="Date of birth"
              type="date"
              register={register}
              error={errors.dateOfBirth?.message}
            />
            <SingleSelectField
              name="gender"
              label="Gender"
              options={GENDER_OPTIONS}
              register={register}
              setValue={setValue}
              value={genderValue}
              error={errors.gender?.message}
              placeholder="Select"
              searchable={false}
            />
          </div>

          <TextareaField
            name="bio"
            label="Bio"
            placeholder="A short introduction about yourself"
            maxLength={500}
            register={register}
            error={errors.bio?.message}
          />
        </FormSection>

        {/* Professional details */}
        <FormSection
          title="Professional details"
          description="How you fit within your organisation."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              name="jobTitle"
              label="Job title"
              register={register}
              error={errors.jobTitle?.message}
            />
            <InputField
              name="department"
              label="Department"
              register={register}
              error={errors.department?.message}
            />
          </div>
        </FormSection>

        {/* Preferences */}
        <FormSection
          title="Preferences"
          description="Language and timezone used across the platform."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SingleSelectField
              name="locale"
              label="Language"
              options={LOCALE_OPTIONS}
              register={register}
              setValue={setValue}
              value={localeValue}
              error={errors.locale?.message}
              placeholder="Select language"
              searchable={false}
            />
            <SingleSelectField
              name="timezone"
              label="Timezone"
              options={timezoneOptions}
              register={register}
              setValue={setValue}
              value={timezoneValue}
              error={errors.timezone?.message}
              placeholder="Select timezone"
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            color="green"
            loading={disabled}
            disabled={disabled || !isDirty}
            startIcon={<Save className="size-4" />}
          >
            Save changes
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
