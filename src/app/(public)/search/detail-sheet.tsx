"use client";

import { Button } from "@/components/dris/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AlumniDetail } from "@/types/alumni";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CableIcon, CopyIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const dmSchema = z.object({
  subject: z.string(),
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function DetailSheet({ alumni }: { alumni: AlumniDetail }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dm, setDm] = useState<string | null>(null);
  const { user } = useUser();

  const router = useRouter();

  const form = useForm<z.infer<typeof dmSchema>>({
    resolver: zodResolver(dmSchema),
    defaultValues: {
      subject: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof dmSchema>) => {
    setIsSubmitting(true);

    console.log(data);

    try {
      const response = await fetch(`${BACKEND_URL}/search/dm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${await getToken()}`,
          credentials: "include",
        },
        body: JSON.stringify({
          alumniLinkedinUrl: alumni.linkedinUrl,
          linkedinUrl: user?.unsafeMetadata.linkedinUrl || "https://www.linkedin.com/in/driselamri",
          subject: data.subject,
          schoolId: user?.unsafeMetadata.schoolId || "cm9pxeayk0000yh19tbk421qq",
        }),
      });

      const responseData = (await response.json()) as { data: { dm: string } };
      const dmData = responseData.data;

      if (!dmData.dm) {
        throw new Error("No DM found");
      }

      setDm(dmData.dm);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    navigator.clipboard.writeText(dm || "");
    router.push(alumni.linkedinUrl);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="silver" size="icon" rounded="md">
          <CableIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-2">
        <SheetHeader>
          <SheetTitle className="text-2xl font-medium">
            <Link href={alumni.linkedinUrl} target="_blank" className="hover:underline">
              {alumni.name}
            </Link>
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {alumni?.headline} | {alumni?.location}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          {!dm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4 relative">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Give me a job" className="text-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="lilac" rounded="md" type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Generating..." : "Generate Cold DM"}
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowRightIcon />}
                </Button>
              </form>
            </Form>
          ) : (
            <>
              <Textarea
                className="w-full p-5 resize-none h-36 bg-background/50 backdrop-blur-sm no-scrollbar overflow-auto disabled:opacity-50"
                defaultValue={dm || ""}
                required
              />
              <Button variant="lilac" rounded="md" className="w-full" onClick={handleSend}>
                Send DM
                <CopyIcon />
              </Button>
              <span className="text-sm text-muted-foreground mt-2">Edit your DM to make it more personalized.</span>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
