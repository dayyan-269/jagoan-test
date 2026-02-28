import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { loginUser } from "@/handlers/authHandler";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().nonempty("Password harus diisi"),
});

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
   const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@email.com",
      password: "password",
    },
    mode: "onSubmit",
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    await loginUser(data.email, data.password);
    await navigate({to: "/dashboard"});
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#2da7bb] to-[#003e40] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-white p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Housing Dashboard</h2>
          <p className="text-md opacity-90">
            Selamat datang di Dashboard, disini anda akan dapat untuk mengelola
            data rumah, penghuni, dan data finansial.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-5">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Sign in to your account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4"
                onSubmit={loginForm.handleSubmit(handleLogin)}>
                <div className="grid gap-3">
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            id={field.name}
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="password"
                            aria-invalid={fieldState.invalid}>
                            Password
                          </FieldLabel>
                          <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full cursor-pointer">
                    Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
