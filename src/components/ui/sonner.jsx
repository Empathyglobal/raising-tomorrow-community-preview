"use client";

import { Toaster as Sonner } from "sonner";

// NOTE: This project is not using next-themes' ThemeProvider.
// Keep this Toaster simple and self-contained so toasts always render.
const Toaster = (props) => {
  return (
    <Sonner
      theme="system"
      className="toaster group z-[9999]"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };