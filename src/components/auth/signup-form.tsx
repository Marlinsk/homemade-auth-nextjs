"use client"

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { signUp } from "@/server/auth";
import { signUpSchema } from "@/schemas/auth";
import React from "react";

type SignUpFormData = z.infer<typeof signUpSchema>;

type SignUpFormProps = React.ComponentPropsWithoutRef<"form">;

export const SignUpForm: React.FC<SignUpFormProps> = ({ className, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [errorMessage, setErrorMessage] = React.useState("");

  const router = useRouter();

  const onSubmit = async ({ name, email, password, confirmPassword }: SignUpFormData) => {
    const response = await signUp(name, email, password, confirmPassword);
    if (response.success) router.push('/');
    if (response.error) setErrorMessage(response.error);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Join us by creating your account below.
        </p>
      </div>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password ? (<p className="text-sm text-red-500">{errors.password.message}</p>) : (<p className="text-sm text-muted-foreground">Must be at least 6 characters long.</p>)}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword ? (<p className="text-sm text-red-500">{errors.confirmPassword.message}</p>) : (<p className="text-sm text-muted-foreground">Repeat the same password for confirmation.</p>)}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <Button variant="outline" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
        Sign up with GitHub
      </Button>
      <div className="text-center text-sm">
        Already an account?{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
  )
}