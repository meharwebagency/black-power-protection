"use client";

import * as React from "react";
import {
  useForm,
  FormProvider as RHFFormProvider,
  type UseFormReturn,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodSchema } from "zod";
import { cn } from "@/lib/utils";

interface FormProviderProps<T extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  className?: string;
}

function FormProvider<T extends FieldValues>({
  children,
  form,
  className,
}: FormProviderProps<T>) {
  return (
    <RHFFormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className={cn("space-y-6", className)}
        noValidate
      >
        {children}
      </form>
    </RHFFormProvider>
  );
}

interface FormFieldContextValue<T extends FieldValues> {
  name: FieldPath<T>;
}

const FormFieldContext = React.createContext<FormFieldContextValue<any> | null>(null);

const FormField = <T extends FieldValues>({
  children,
  ...props
}: { name: FieldPath<T> } & { children: React.ReactNode }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <div>{children}</div>
    </FormFieldContext.Provider>
  );
};

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  if (!fieldContext) throw new Error("useFormField must be used within <FormField>");

  return { name: fieldContext.name };
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

function FormItem({ className, children, ...props }: FormItemProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

function FormLabel({ className, required, children, ...props }: FormLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required && <span className="ms-1 text-destructive">*</span>}
    </label>
  );
}

function FormControl({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

function FormMessage({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-xs text-destructive", className)} {...props} />;
}

export {
  FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useFormField,
};
