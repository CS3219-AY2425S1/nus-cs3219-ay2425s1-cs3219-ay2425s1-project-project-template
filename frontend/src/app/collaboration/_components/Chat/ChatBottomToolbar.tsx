"use client";

import { TextAreaInput } from "@/components/form/TextAreaInput";
import { TextInput } from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChatBottomToolbarProps {
  isCollapsed: boolean;
}

const FormSchema = z.object({
  message: z.string().trim(),
});

export default function ChatBottomToolbar({
  isCollapsed,
}: ChatBottomToolbarProps) {
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
    if (formState.isSubmitting || data.message.length === 0) return;

    console.log(`send message submitted with: ${data.message}`);
  }, []);

  return (
    <CardFooter
      className={cn(
        "transition-all duration-300",
        "flex mt-auto h-fit whitespace-normal",
        isCollapsed && "opacity-0"
      )}
    >
      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start w-full space-x-2"
        >
          <TextAreaInput
            label={""}
            name="message"
            placeholder="Type your message..."
            className="bg-input-background-100 !mt-0 h-1 max-h-40"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </Form>
    </CardFooter>
  );
}
