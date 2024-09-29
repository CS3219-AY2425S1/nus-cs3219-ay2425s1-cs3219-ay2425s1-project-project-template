import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CATEGORY_ENUM,
  CreateQuestionData,
  createQuestionSchema,
} from '@/types/question';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

type QuestionFormProps = {
  onSubmit: (data: CreateQuestionData) => void;
};

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const form = useForm<CreateQuestionData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: '',
      description: '',
      examples: [{ input: '', output: '' }],
      constraints: [],
      categories: [],
      difficulty: 'Easy',
      link: '',
    },
  });
  const examplesControl = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const constraintsControl = useFieldArray({
    control: form.control,
    name: 'constraints',
  });

  const categoriesControl = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Two Sum' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the problem...'
                  {...field}
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {examplesControl.fields.map((field, index) => (
          <div key={field.id} className='flex flex-col gap-2'>
            <div className='text-sm font-medium'>Example {index + 1}</div>
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name={`examples.${index}.input`}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormControl>
                      <Input
                        placeholder='Input'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {examplesControl.fields.length > 1 && (
                <Button
                  variant='secondary'
                  size='icon'
                  type='button'
                  onClick={() => examplesControl.remove(index)}
                  className='flex-shrink-0'
                >
                  <Trash className='w-4 h-4' />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`examples.${index}.output`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Output' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => examplesControl.append({ input: '', output: '' })}
        >
          Add Example
        </Button>

        {/* Constraints */}
        {constraintsControl.fields.length == 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium'>Constraints</p>
            <p className='text-sm text-gray-500'>No constraints added</p>
          </div>
        )}

        {constraintsControl.fields.map((field, index) => (
          <FormItem key={field.id}>
            <FormLabel>Constraint {index + 1}</FormLabel>
            <div className='flex gap-2'>
              <FormControl>
                <Input placeholder='Add constraint' {...field} />
              </FormControl>

              <Button
                variant='secondary'
                size='icon'
                type='button'
                className='flex-shrink-0'
                onClick={() => constraintsControl.remove(index)}
              >
                <Trash className='w-4 h-4' />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        ))}
        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => constraintsControl.append({ constraint: '' })}
        >
          Add Constraint
        </Button>

        {/* Categories */}
        {categoriesControl.fields.length == 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium'>Categories</p>
            <p className='text-sm text-gray-500'>No categories added</p>
          </div>
        )}
        {categoriesControl.fields.map((field, index) => (
          <FormItem className='flex-grow'>
            <FormLabel>Category {index + 1}</FormLabel>
            <div key={field.id} className='flex gap-2'>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ENUM.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <Button
                variant='secondary'
                size='icon'
                type='button'
                className='flex-shrink-0'
                onClick={() => categoriesControl.remove(index)}
              >
                <Trash className='w-4 h-4' />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        ))}
        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => categoriesControl.append({ category: '' })}
        >
          Add Category
        </Button>

        <FormField
          control={form.control}
          name='difficulty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Easy'>Easy</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='Hard'>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Leetcode</FormLabel>
              <FormControl>
                <Input
                  type='url'
                  placeholder='E.g. https://leetcode.com/problems/two-sum/'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function QuestionDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuestionData) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
          <DialogDescription>Create a new question</DialogDescription>
        </DialogHeader>
        <QuestionForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
