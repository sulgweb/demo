/*
 * @Author: xiaoyu
 * @Description:
 * @Date: 2022-06-12 23:07:50
 * @LastEditors: xiaoyu
 * @LastEditTime: 2022-06-21 23:54:28
 */
import React, { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

const Excel = lazy(() => import('@/pages/Excel'));
const Compress = lazy(() => import('@/pages/Compress'));
const LazyBrowser = lazy(() => import('@/pages/LazyBrowser'));
const LazyIntersectionObserver = lazy(
  () => import('@/pages/LazyIntersectionObserver'),
);
const LazyScroll = lazy(() => import('@/pages/LazyScroll'));
const Barrage = lazy(() => import('@/pages/Barrage'));

export default function Router() {
  let element = useRoutes([
    {
      path: '/',
      element: <Navigate to='/excel' />,
      children: [],
    },
    {
      path: '/excel',
      element: <Excel />,
      children: [],
    },
    {
      path: '/compress',
      element: <Compress />,
      children: [],
    },
    {
      path: '/lazy-browser',
      element: <LazyBrowser />,
      children: [],
    },
    {
      path: '/lazy-intersection-observer',
      element: <LazyIntersectionObserver />,
      children: [],
    },
    {
      path: '/lazy-scroll',
      element: <LazyScroll />,
      children: [],
    },
    {
      path: '/barrage',
      element: <Barrage />,
      children: [],
    },
  ]);

  return element;
}
