"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/dris/button";
import { Input } from "@/components/dris/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .refine((url) => url.includes("linkedin.com"), {
      message: "URL must be from LinkedIn",
    }),
});

export default function OnboardingPage() {
  const { user } = useUser();
  //   const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   if (user?.unsafeMetadata.linkedinUrl) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      linkedinUrl: "",
    },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await user.update({
        unsafeMetadata: {
          linkedinUrl: data.linkedinUrl,
        },
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-medium mb-2">Complete Your Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.linkedin.com/in/yourprofile" className="text-white" {...field} />
                  </FormControl>
                  <FormDescription>This will help us connect you with relevant alumni.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="lilac" rounded="md" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Indexing profile..." : "Finish"}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
}
