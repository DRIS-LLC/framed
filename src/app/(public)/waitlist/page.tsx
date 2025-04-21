"use client";

import { Container } from "@/components/container";
import { Button as DrisButton } from "@/components/dris/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith(".edu") || email.endsWith(".gov"), {
      message: "Only .edu or .gov email addresses are allowed",
    }),
  honeypot: z.string().optional(),
});

export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof waitlistSchema>) => {
    setIsSubmitting(true);

    console.log(data);

    if (data.honeypot) {
      setStatus("Caught you buddy");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", data.email);

    fetch("https://api.formscale.dev/s/zkuk6bay", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          setStatus("Form submitted! We'll notify you when it's out.");
        } else {
          return response.json().then((data) => {
            const responseData = data as { error: string | string[] };
            const error = responseData.error || "Submission failed. Please try again.";
            setStatus(Array.isArray(error) ? error.join(", ") : error.toLowerCase());
          });
        }
      })
      .catch((error) => {
        setStatus(error.message || "Network error. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Container>
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h1 className="text-2xl font-medium mb-2">Walker isn&apos;t at your school yet.</h1>
        <p className="text-sm text-muted-foreground">
          If you want to be notified when we launch, please join the waitlist.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2 relative mt-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="dris@nyu.edu" className="text-white w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrisButton variant="lilac" rounded="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Join"}
              <ArrowRightIcon />
            </DrisButton>
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="honey" className="text-white hidden" hidden />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <p className="text-sm text-muted-foreground mt-2">{status}</p>
      </div>
    </Container>
  );
}
