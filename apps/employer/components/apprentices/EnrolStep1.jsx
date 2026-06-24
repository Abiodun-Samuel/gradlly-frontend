import { Field } from "./EnrolFields";
import { T } from "./tokens";

export function EnrolStep1({ data, onChange }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Learner details
      </p>
      <Field
        id="firstName"
        label="First name"
        value={data.firstName}
        onChange={onChange}
      />
      <Field
        id="lastName"
        label="Last name"
        value={data.lastName}
        onChange={onChange}
      />
      <Field
        id="email"
        label="Email address"
        type="email"
        value={data.email}
        onChange={onChange}
      />
      <Field
        id="dob"
        label="Date of birth"
        type="date"
        value={data.dob}
        onChange={onChange}
      />
      <Field
        id="nino"
        label="National Insurance no."
        placeholder="AB 12 34 56 C"
        value={data.nino}
        onChange={onChange}
      />
      <Field
        id="jobTitle"
        label="Job title"
        value={data.jobTitle}
        onChange={onChange}
      />
      <Field
        id="manager"
        label="Line manager name"
        hint="Who will approve this apprentice's OTJ logs"
        value={data.manager}
        onChange={onChange}
      />
    </div>
  );
}
