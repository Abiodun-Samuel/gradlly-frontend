import { cva } from "@/utils/helper";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-none tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700",
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
        danger: "bg-danger-50 text-danger-700",
        info: "bg-primary-50 text-primary-700",
        owner: "bg-primary-100 text-primary-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({ variant, className, children, ...props }) {
  return (
    <span className={badgeVariants({ variant, className })} {...props}>
      {children}
    </span>
  );
}

export { badgeVariants };
