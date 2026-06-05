"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useUpdateOrganization } from "@/features/organization/queries/organizations.query";
import {
  updateOrganizationDefaultsFromOrg,
  updateOrganizationSchema,
} from "@/features/organization/schemas";
import { useUploadFile } from "@/features/storage/queries/storage.query";
import { STORAGE_CATEGORY } from "@/features/storage/services/storage.service";
import { applyServerErrors } from "@/lib/errors";

const COUNTRY_OPTIONS = Country.getAllCountries().map((c) => ({
  value: c.name,
  text: c.name,
}));

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

export function UpdateOrganizationForm() {
  const { activeOrganisation } = useAuthUser();
  const org = activeOrganisation?.organisation;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: updateOrganizationDefaultsFromOrg(org),
    mode: "onBlur",
  });

  useEffect(() => {
    if (org) reset(updateOrganizationDefaultsFromOrg(org));
  }, [org, reset]);

  const countryValue = useWatch({ control, name: "country", defaultValue: "" });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useUpdateOrganization();
  const { mutateAsync: saveLogo, isPending: isSavingLogo } =
    useUpdateOrganization();
  const { upload, isUploading } = useUploadFile({
    category: STORAGE_CATEGORY.LOGO,
    silent: true,
  });
  const disabled = isSubmitting || isPending;
  const logoBusy = isUploading || isSavingLogo;

  const countryOptions = useMemo(() => COUNTRY_OPTIONS, []);

  // Upload the logo to S3, then persist its durable URL on the organisation.
  // Throwing reverts the Avatar's optimistic preview.
  const handleLogoSelect = async (file) => {
    const logoUrl = await upload(file);
    await saveLogo({ logoUrl });
  };

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);
      reset(values);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <ServerErrorAlert showFieldList error={serverError} />

      {/* Logo — uploads independently of the form fields below. */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar
            src={org?.logoUrl}
            initials={org?.name?.slice(0, 2) ?? ""}
            alt={`${org?.name ?? "Organisation"} logo`}
            size="2xl"
            shape="square"
            className="ring-2 ring-primary-100"
            uploadable
            onFileSelect={handleLogoSelect}
            loading={logoBusy}
          />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-neutral-900">
              Organisation logo
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Click the logo to upload a new one.
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              PNG, JPG, SVG or WEBP, up to 5&nbsp;MB.
            </p>
          </div>
        </CardContent>
      </Card>

      <fieldset disabled={disabled} className="contents space-y-6">
        {/* Identity */}
        <FormSection
          title="Organisation details"
          description="Your organisation's name and registration."
        >
          <InputField
            required
            name="name"
            label="Organisation name"
            autoComplete="organization"
            register={register}
            error={errors.name?.message}
          />
          {org?.ukprn ? (
            <InputField
              name="ukprn"
              label="UKPRN"
              value={org.ukprn}
              disabled
              readOnly
            />
          ) : null}
        </FormSection>

        {/* Contact */}
        <FormSection
          title="Contact"
          description="How people can reach your organisation."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              required
              name="orgEmail"
              label="Email"
              type="email"
              autoComplete="email"
              register={register}
              error={errors.orgEmail?.message}
            />
            <InputField
              name="orgPhone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              register={register}
              error={errors.orgPhone?.message}
            />
          </div>
          <InputField
            name="website"
            label="Website"
            type="url"
            placeholder="https://"
            register={register}
            error={errors.website?.message}
          />
        </FormSection>

        {/* Location */}
        <FormSection title="Location" description="Your registered address.">
          <InputField
            required
            name="address"
            label="Address"
            autoComplete="street-address"
            register={register}
            error={errors.address?.message}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SingleSelectField
              required
              name="country"
              label="Country"
              options={countryOptions}
              register={register}
              setValue={setValue}
              value={countryValue}
              error={errors.country?.message}
              placeholder="Select country"
            />
            <InputField
              required
              name="city"
              label="City"
              register={register}
              error={errors.city?.message}
            />
            <InputField
              required
              name="postcode"
              label="Postcode"
              autoComplete="postal-code"
              register={register}
              error={errors.postcode?.message}
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
