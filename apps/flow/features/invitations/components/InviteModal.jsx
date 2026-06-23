"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { applyServerErrors } from "@/lib/errors";

import { getAssignableRoleOptions } from "../constants";
import { useSendInvitation } from "../queries/invitations.query";
import { inviteDefaults, inviteSchema } from "../schemas";

export function InviteModal({ open, onClose }) {
  const { userRoles } = useAuthUser();
  const roleOptions = useMemo(
    () => getAssignableRoleOptions(userRoles),
    [userRoles],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: inviteDefaults,
    mode: "onBlur",
  });

  const roleValue = useWatch({ control, name: "role" });
  const { mutateAsync, isPending, error: serverError } = useSendInvitation();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (!open) reset(inviteDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={disabled}
      size="md"
      icon={<UserPlus className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Invite a team member"
      description="They will receive an email with a secure link to join your organisation."
      footer={
        <Button
          type="submit"
          form="invite-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={<UserPlus className="size-4" />}
        >
          Send invitation
        </Button>
      }
    >
      <form
        id="invite-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          required
          name="email"
          label="Email address"
          type="email"
          placeholder="colleague@example.com"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
          disabled={disabled}
        />

        <SingleSelectField
          required
          name="role"
          label="Role"
          options={roleOptions}
          register={register}
          setValue={setValue}
          value={roleValue}
          error={errors.role?.message}
          placeholder="Select a role"
          searchable={false}
          disabled={disabled}
        />

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-500">
          <span className="font-semibold text-neutral-700">
            Role permissions:{" "}
          </span>
          <span className="font-medium text-neutral-700">Admin</span> manages
          the team and settings.{" "}
          <span className="font-medium text-neutral-700">Member</span> has
          standard access.{" "}
          <span className="font-medium text-neutral-700">Apprentice</span> joins
          via the learning portal.
        </div>
      </form>
    </Modal>
  );
}
