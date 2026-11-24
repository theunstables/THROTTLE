import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { WAITLIST_FORM_URL } from "./config";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`control ${className}`} {...props} />;
}

export function WaitlistButton({
  children = "Join the Waitlist",
  className = "",
  external = false,
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  if (external) {
    return (
      <a className={`button button--primary ${className}`} href={WAITLIST_FORM_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    );
  }
  return (
    <a className={`button button--primary ${className}`} href="#waitlist" onClick={onClick}>
      {children}
      <ArrowDown size={17} aria-hidden="true" />
    </a>
  );
}