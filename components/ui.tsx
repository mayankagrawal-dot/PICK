"use client";

import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-cardline bg-white shadow-card ${className}`}
      {...props}
    />
  );
}

export function BigButton({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const base =
    "font-extrabold rounded-full cursor-pointer transition-transform active:translate-y-0.5 hover:-translate-y-0.5";
  const variants = {
    primary: "bg-pink text-ink text-[17px] px-8 py-[18px] shadow-btn active:shadow-btn-active",
    secondary: "bg-lavender text-ink text-[15px] px-6 py-3.5 shadow-btn active:shadow-btn-active",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function TextButton({
  className = "",
  danger = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      className={`bg-transparent border-none font-bold text-[13px] underline cursor-pointer p-1 ${
        danger ? "text-red-700" : "text-ink"
      } ${className}`}
      {...props}
    />
  );
}

export function Chip({
  className = "",
  selected = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      className={`border-2 border-ink rounded-full px-3.5 py-2 text-[13px] font-bold cursor-pointer transition-colors ${
        selected ? "bg-ink text-bg" : "bg-white hover:bg-lime"
      } ${className}`}
      {...props}
    />
  );
}
