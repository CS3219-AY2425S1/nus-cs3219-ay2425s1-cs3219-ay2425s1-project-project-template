import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { useCrumbs } from '@/lib/hooks/use-crumbs';

export const QuestionsList = () => {
  const { crumbs } = useCrumbs();
  return (
    <WithNavBanner crumbs={crumbs}>
      <div>
        <span>Questions Page</span>
      </div>
    </WithNavBanner>
  );
};
