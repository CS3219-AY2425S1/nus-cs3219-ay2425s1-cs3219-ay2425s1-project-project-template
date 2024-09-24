import { observer } from 'mobx-react';

export const Root = observer(() => {
  return (
    <div id='main' className='bg-background flex size-full min-h-screen flex-col'>
      {/* Body */}
      <div className='container'>Main Layout</div>
    </div>
  );
});
