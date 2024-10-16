import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import { ROUTES } from '@/lib/routes';
import { requestMatch } from '@/services/match-service';

import { MatchFormData } from './logic';

interface MatchFormProps {
  topics: string[];
}

export const MatchForm = ({ topics }: MatchFormProps) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      selectedTopics: [],
      difficulty: '',
    },
  });

  const { handleSubmit, control } = form;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: MatchFormData) => {
    console.log('Form Submitted:', data);
    setLoading(true);
    setErrorMessage(null);

    const response = await requestMatch(data);

    if (!response) {
      setLoading(false);
      setErrorMessage('Error. Please try again later.');
    } else {
      const socketPort = response.socketPort;
      navigate(ROUTES.WAITING_ROOM, { state: { socketPort } });
    }
  };

  return (
    <Card className='text-card-foreground bg-primary-foreground border-border flex w-full max-w-[400px] flex-col items-center justify-center rounded-xl border shadow md:size-full md:max-h-[600px]'>
      <CardHeader className='mt-20 flex items-start justify-center'>
        <CardTitle className='text-3xl'>Find A Partner</CardTitle>
      </CardHeader>
      <CardContent className='w-full grow items-center justify-center '>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex size-full flex-col justify-center gap-2'
          >
            <FormField
              control={control}
              name='selectedTopics'
              rules={{ required: 'Please select at least one topic.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics</FormLabel>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    className='whitespace-nowrap md:w-[350px] '
                  >
                    <FormControl>
                      <MultiSelectorTrigger className='max-h-24 overflow-y-auto'>
                        <MultiSelectorInput placeholder='Select topic(s)' />
                      </MultiSelectorTrigger>
                    </FormControl>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {topics.map((topic) => {
                          return (
                            <MultiSelectorItem value={topic} key={topic}>
                              {topic}
                            </MultiSelectorItem>
                          );
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
              rules={{ required: 'Please select a difficulty level.' }}
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Difficulty</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='bg-white'>
                        <SelectValue placeholder='Select difficulty' />
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
            {errorMessage && <p className='mt-2 text-center text-red-500'>{errorMessage}</p>}
            <Button className='mt-5 w-full' type='submit'>
              {loading ? 'Finding Partner...' : 'Find Partner'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
