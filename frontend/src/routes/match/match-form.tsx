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
import { requestMatch } from '@/services/match-service';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

  const onSubmit = async (data: MatchFormData) => {
    console.log('Form Submitted:', data);
    try {
      setLoading(true);
      const response = await requestMatch(data);

      if (response.status === 200) {
        const { websocketUrl } = response.data;
        navigate('/match/waiting-room', { state: { websocketUrl } });
      }
    } catch (error) {
      console.error('Error requesting match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='bg-primary-foreground border-border flex max-w-sm flex-col justify-center border md:ml-auto md:max-h-[600px]'>
      <CardHeader className='flex items-center pb-10'>
        <CardTitle className='text-3xl'>Find A Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <FormField
              control={control}
              name='selectedTopics'
              rules={{ required: 'Please select at least one topic.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics</FormLabel>
                  <MultiSelector values={field.value} onValuesChange={field.onChange}>
                    <FormControl>
                      <MultiSelectorTrigger>
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

            <Button className='mt-5 w-full' type='submit'>
              {loading ? 'Finding Partner...' : 'Find Partner'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
