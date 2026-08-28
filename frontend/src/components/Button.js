import Link from "next/link";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-orange-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
  secondary:
    "bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-secondary hover:bg-zinc-100 active:bg-zinc-200",
};

const disabledClasses = "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none translate-y-0";

export default function Button({
  variant = "primary",
  href,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-default px-6 py-3 font-medium transition-all duration-150";
  const classes = `${base} ${disabled ? disabledClasses : variants[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}