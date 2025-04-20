"use client";

import { Container } from "@/components/container";
import { Button as DrisButton } from "@/components/dris/button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSearch } from "@/providers/search";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categories = [
  {
    name: "Internship opportunities",
  },
  {
    name: "Jobs in my field",
  },
  {
    name: "Coffee chats",
  },
  {
    name: "Events near me",
  },
  {
    name: "Cool startups",
  },
] as const;

const rotatingWords = ["Finance.", "Interns.", "Students.", "Startups.", "Coffee.", "Events."];

const searchSchema = z.object({
  query: z.string(),
});

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchQuery,
    },
  });

  useEffect(() => {
    form.reset({
      query: searchQuery,
    });
  }, [searchQuery]);

  const onSubmit = (data: z.infer<typeof searchSchema>) => {
    setIsSubmitting(true);
    setSearchQuery(data.query);
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    try {
      router.push("/search");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Container>
      <motion.h1
        className="text-5xl leading-14 text-center font-medium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        A Connection Network Built for{" "}
        <span className="relative inline-block">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              className="absolute inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {rotatingWords[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="opacity-0">{rotatingWords[0]}</span>
        </span>
      </motion.h1>
      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 relative mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="w-full p-5 resize-none h-36 bg-background/50 backdrop-blur-sm no-scrollbar overflow-auto disabled:opacity-50"
                    placeholder="Find a recruiter at Goldman Sachs to help me get an internship..."
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn("absolute bottom-4 right-4")}>
            <DrisButton size="icon" variant="lilac" rounded="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowRightIcon />}
            </DrisButton>
          </div>
        </motion.form>
      </Form>
      <motion.div
        className="flex justify-center items-center gap-2 relative mt-4 px-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <Button variant="outline" className="text-xs font-medium">
              {category.name}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
