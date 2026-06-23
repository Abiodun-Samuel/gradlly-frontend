"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { CreateOrganizationForm } from "./CreateOrganizationForm";

const FORM_ID = "create-org-form";

/**
 * The create-organisation modal. Uses the standard Modal chrome (sticky header,
 * scrollable body, sticky footer with an automatic Cancel button). Only the
 * primary action is supplied here, wired to the form via the `form` attribute.
 */
export function CreateOrganisationModal({ open, onOrgCreated, onClose }) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      size="lg"
      icon={<Building2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Set up your organisation"
      description="Tell us about your training provider to prepare your dashboard and link your ESFA records."
      footer={
        <Button
          type="submit"
          form={FORM_ID}
          color="green"
          size="sm"
          loading={busy}
          disabled={busy}
          startIcon={<Building2 className="size-4" />}
        >
          Create organisation
        </Button>
      }
    >
      <CreateOrganizationForm
        id={FORM_ID}
        onSuccess={onOrgCreated}
        onBusyChange={setBusy}
      />
    </Modal>
  );
}
