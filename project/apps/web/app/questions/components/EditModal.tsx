"use client";

import { useEffect, useState } from "react";
import { useZodForm } from "@/lib/form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateQuestionDto, updateQuestionSchema } from "@repo/dtos/questions";
import { Complexity, Category } from "@repo/dtos/questions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: UpdateQuestionDto) => void;
  initialValues: UpdateQuestionDto;
}

export default function EditModal({
  open,
  setOpen,
  onSubmit,
  initialValues,
}: EditModalProps) {
  const form = useZodForm({
    schema: updateQuestionSchema,
    defaultValues: {
      q_title: initialValues.q_title,
      q_desc: initialValues.q_desc,
      q_complexity: initialValues.q_complexity,
      q_category: initialValues.q_category,
    },
  });

  const categories = Object.values(Category);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialValues.q_category,
  );

  const toggleCategory = (category: Category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    form.setValue("q_category", updatedCategories);
  };

  const handleSubmit = (data: UpdateQuestionDto) => {
    const updatedData: UpdateQuestionDto = {
      ...data,
      id: initialValues.id,
    };

    onSubmit(updatedData);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        q_title: initialValues.q_title,
        q_desc: initialValues.q_desc,
        q_complexity: initialValues.q_complexity,
        q_category: initialValues.q_category,
        id: initialValues.id,
      });
      setSelectedCategories(initialValues.q_category);
    } else {
      form.reset();
      form.clearErrors();
      setSelectedCategories([]);
    }
  }, [open, form, initialValues]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="q_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="q_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-y max-h-64"
                      placeholder="Enter description"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Complexity Dropdown */}
            <FormField
              control={form.control}
              name="q_complexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Complexity</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Complexity).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories Multi-Select */}
            <FormField
              control={form.control}
              name="q_category"
              render={() => (
                <FormItem>
                  <FormLabel className="text-black">Categories</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Badge
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          variant={
                            selectedCategories.includes(cat)
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
