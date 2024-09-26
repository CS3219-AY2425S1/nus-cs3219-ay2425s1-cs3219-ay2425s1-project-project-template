import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { getBreadCrumbs } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useRouterLocation } from '@/lib/hooks';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadCrumb, BreadCrumbProvider } from '@/stores/breadcrumb-store';

export const AuthedLayout = () => {
  const [breadcrumbs, setCrumbs] = useState<Array<BreadCrumb>>([]);
  const {
    location: { pathname },
  } = useRouterLocation();

  useEffect(() => {
    setCrumbs(getBreadCrumbs(pathname));
  }, [pathname]);
  const isLast = useCallback((index: number) => index === breadcrumbs.length - 1, [breadcrumbs]);

  return (
    <div
      id='main'
      className={cn(
        'flex w-full flex-col overscroll-contain',
        'h-[calc(100dvh-64px)]' // The nav is 64px
      )}
    >
      <BreadCrumbProvider
        value={{
          breadcrumbs,
          setCrumbs,
        }}
      >
        {breadcrumbs.length > 0 && (
          <div className='bg-secondary/50 flex w-full p-4 px-6'>
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map(({ path, title }, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          to={path}
                          className={cn(isLast(index) && 'text-secondary-foreground')}
                        >
                          {title}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {!isLast(index) && <BreadcrumbSeparator />}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </BreadCrumbProvider>
      <Outlet />
    </div>
  );
};
