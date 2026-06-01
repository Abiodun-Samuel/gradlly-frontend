import { Field } from "./EnrolFields";
import { T } from "./tokens";

export function EnrolStep1() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Learner details
      </p>
      <Field id="firstName" label="First name" />
      <Field id="lastName" label="Last name" />
      <Field id="dob" label="Date of birth" type="date" />
      <Field
        id="nino"
        label="National Insurance no."
        placeholder="AB 12 34 56 C"
      />
      <Field id="jobTitle" label="Job title" />
      <Field id="manager" label="Line manager name" />
    </div>
  );
}
