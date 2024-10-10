import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormProvider, useForm } from 'react-hook-form';

import { Form } from 'react-router-dom';

interface MatchFormProps {
  topics: string[];
}

export const MatchForm = ({ topics }: MatchFormProps) => {
  const form = useForm({
    defaultValues: {
      selectedTopics: [],
      difficulty: '',
    },
  });

  console.log(topics);

  const { handleSubmit, control } = form;

  const onSubmit = (data: any) => {
    console.log('Form Submitted:', data);
  };

  return (
    <Card className='bg-primary-foreground border-border mx-auto flex size-full max-w-sm flex-col justify-center md:ml-auto md:mr-8 md:max-h-[600px]'>
      <CardHeader className='flex items-center pb-10'>
        <CardTitle className='text-3xl'>Find A Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
              <FormField
                control={control}
                name='selectedTopics'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topics</FormLabel>
                    <MultiSelector values={field.value} onValuesChange={field.onChange}>
                      <FormControl>
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder='Select Topics' />
                        </MultiSelectorTrigger>
                      </FormControl>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {topics.map((topic) => {
                            return <MultiSelectorItem value={topic}>{topic}</MultiSelectorItem>;
                          })}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='difficulty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a difficulty' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='easy'>Easy</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' type='submit'>
                Find Partner
              </Button>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
