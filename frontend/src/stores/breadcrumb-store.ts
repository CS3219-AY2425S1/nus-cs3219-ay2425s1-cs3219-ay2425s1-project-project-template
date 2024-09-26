import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type BreadCrumb = {
  path: string;
  title: string;
};

const breadcrumbContext = createContext<{
  breadcrumbs: Array<BreadCrumb>;
  setCrumbs?: Dispatch<SetStateAction<Array<BreadCrumb>>>;
}>({ breadcrumbs: [] });

export const useBreadCrumbs = () => {
  return useContext(breadcrumbContext);
};

export const BreadCrumbProvider = breadcrumbContext.Provider;
