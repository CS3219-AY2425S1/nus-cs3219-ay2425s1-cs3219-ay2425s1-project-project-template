import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, queryOptions, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { defer, LoaderFunctionArgs } from 'react-router-dom';
import { z } from 'zod';

import { requestMatch } from '@/services/match-service';
import { fetchTopics } from '@/services/question-service';

export interface MatchFormData {
  selectedTopics: string[];
  difficulty: string;
}

const getTopicsQueryConfig = () =>
  queryOptions({
    queryKey: ['topics'],
    queryFn: async () => fetchTopics(),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params: _ }: LoaderFunctionArgs) => {
    return defer({
      topics: queryClient.ensureQueryData(getTopicsQueryConfig()),
    });
  };

const formSchema = z.object({
  selectedTopics: z.string().min(1, 'Topic cannot be empty').array(),
  difficulty: z.string().min(1, 'Difficulty cannot be empty'),
});

type IRequestMatchFormSchema = z.infer<typeof formSchema>;

export const useRequestMatchForm = () => {
  const [socketPort, setSocketPort] = useState('');
  const form = useForm<IRequestMatchFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedTopics: [],
      difficulty: '',
    },
    mode: 'onSubmit',
  });
  const { selectedTopics: topic, difficulty } = form.watch();
  const { mutate, error, isPending, isSuccess } = useMutation({
    mutationKey: ['requestMatch', topic, difficulty],
    mutationFn: (data: IRequestMatchFormSchema) => {
      return requestMatch(data);
    },
    onSuccess(data, _variables, _context) {
      if (data && data.socketPort) {
        setSocketPort(data.socketPort);
        return;
      }

      console.error(`[MatchService::match::request]: Unexpected response: ${JSON.stringify(data)}`);
    },
  });

  const onSubmit = (data: IRequestMatchFormSchema) => {
    mutate(data);
  };

  return {
    form,
    socketPort,
    onSubmit: form.handleSubmit(onSubmit),
    matchRequestError: error,
    isMatchRequestPending: isPending,
    isMatchRequestSuccess: isSuccess,
  };
};
