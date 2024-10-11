import { questionDetails as data } from '@/assets/questions';
import { DetailsCard } from '../questions/details/details-card';

export const Collab = () => {
  //load questionDetails
  const questionDetails = data[0];

  return (
    <div className='flex flex-1 overflow-hidden'>
      <DetailsCard questionDetails={questionDetails} />
      <div className='flex flex-1 flex-col' />
    </div>
  );
};
