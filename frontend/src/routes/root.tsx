import { observer } from 'mobx-react';

export const Root = observer(() => {
  return (
    <div id='main' className='bg-background relative flex min-h-screen flex-col'>
      {/* Body */}
      <div className='container relative' />
    </div>
  );
});
