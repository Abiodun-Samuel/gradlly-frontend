"use client";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { toastSuccess } from "@/hooks/useToast";

import { EnrolStep1 } from "./EnrolStep1";
import { EnrolStep2 } from "./EnrolStep2";
import { EnrolStep3 } from "./EnrolStep3";
import { StepIndicator } from "./StepIndicator";
import { T } from "./tokens";

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

  const handleSubmit = () => {
    setDone(true);
    toastSuccess("Apprentice enrolment submitted successfully");
    setTimeout(() => {
      onClose();
      setStep(1);
      setDone(false);
    }, 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Enrol apprentice"
      description="Add a new learner to your apprenticeship programme"
      footer={
        !done && (
          <>
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : onClose())}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              {step > 1 ? "← Back" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={() =>
                step < 3 ? setStep((s) => s + 1) : handleSubmit()
              }
              className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all"
              style={{
                backgroundColor: step === 3 ? T.green : T.blue,
                color: "#fff",
              }}
            >
              {step === 3 ? "Submit enrolment" : "Next →"}
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
          {step === 1 && <EnrolStep1 />}
          {step === 2 && <EnrolStep2 />}
          {step === 3 && <EnrolStep3 />}
        </div>
      )}
    </Modal>
  );
}
