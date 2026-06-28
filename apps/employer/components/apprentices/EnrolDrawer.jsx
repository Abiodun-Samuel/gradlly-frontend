"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { APPRENTICE_QUERY_KEYS } from "@/features/apprentices/queries/keys";
import { createApprentice } from "@/features/apprentices/services/apprentices.service";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import { createEnrolment } from "@/features/enrolments/services/enrolments.service";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { EnrolStep1 } from "./EnrolStep1";
import { EnrolStep2 } from "./EnrolStep2";
import { EnrolStep3 } from "./EnrolStep3";
import { StepIndicator } from "./StepIndicator";
import { T } from "./tokens";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  dob: "",
  nino: "",
  jobTitle: "",
  manager: "",
  standard: "6fb697ce-9786-4a58-bef7-040dffaa0c1e",
  provider: "",
  startDate: "",
  cohort: "",
};

function EnrolSuccess() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: T.greenLight }}
      >
        ✓
      </div>
      <p className="text-lg font-bold" style={{ color: T.green }}>
        Enrolment submitted
      </p>
      <p className="text-sm max-w-xs" style={{ color: T.subtle }}>
        Apprentice added to your roster. Commitment statement generated within
        24 hours.
      </p>
    </div>
  );
}

export function EnrolDrawer({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleClose = () => {
    onClose();
    setStep(1);
    setDone(false);
    setForm(INITIAL_FORM);
  };

  const submit = useMutation({
    mutationFn: async () => {
      const apprentice = await createApprentice({
        orgId,
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        },
      });
      await createEnrolment({
        orgId,
        body: {
          apprenticeId: apprentice.id,
          standardId: form.standard,
          ...(form.startDate && { plannedStartDate: form.startDate }),
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.list(orgId) });
      qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.list(orgId) });
      toastSuccess("Apprentice enrolment submitted successfully");
      setDone(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    },
    onError: (error) => {
      toastError(error.message || "Failed to submit enrolment.");
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title="Enrol apprentice"
      description="Add a new learner to your apprenticeship programme"
      footer={
        !done && (
          <>
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              {step > 1 ? "← Back" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={() =>
                step < 3 ? setStep((s) => s + 1) : submit.mutate()
              }
              disabled={submit.isPending}
              className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50"
              style={{
                backgroundColor: step === 3 ? T.green : T.blue,
                color: "#fff",
              }}
            >
              {submit.isPending
                ? "Submitting…"
                : step === 3
                  ? "Submit enrolment"
                  : "Next →"}
            </button>
          </>
        )
      }
    >
      {done ? (
        <EnrolSuccess />
      ) : (
        <div className="space-y-5">
          <StepIndicator current={step} total={3} />
          {step === 1 && <EnrolStep1 data={form} onChange={setField} />}
          {step === 2 && <EnrolStep2 data={form} onChange={setField} />}
          {step === 3 && <EnrolStep3 data={form} />}
        </div>
      )}
    </Modal>
  );
}
