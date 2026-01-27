import { Toaster as Sonner } from "sonner";

const Toaster = () => (
  <Sonner
    className="toaster group"
    position="top-right"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-slate-500",
        actionButton:
          "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
        cancelButton:
          "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-800",
      },
    }}
  />
);

export { Toaster };
