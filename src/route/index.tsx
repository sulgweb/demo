/*
 * @Author: xiaoyu
 * @Description:
 * @Date: 2022-06-12 23:07:50
 * @LastEditors: xiaoyu
 * @LastEditTime: 2022-06-21 23:54:28
 */
import React, { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

const Excel = lazy(() => import('@/pages/Excel'));
const Compress = lazy(() => import('@/pages/Compress'));
const LazyBrowser = lazy(() => import('@/pages/LazyBrowser'));
const LazyIntersectionObserver = lazy(
  () => import('@/pages/LazyIntersectionObserver'),
);
const LazyScroll = lazy(() => import('@/pages/LazyScroll'));
const LazyModule = lazy(() => import('@/pages/LazyModule'));
const Barrage = lazy(() => import('@/pages/Barrage'));
const OrdinaryList = lazy(() => import('@/pages/OrdinaryList'));
const LimitVirtualList = lazy(() => import('@/pages/LimitVirtualList'));
const NotLimitVirtualList = lazy(() => import('@/pages/NotLimitVirtualList'));
const LRU = lazy(() => import('@/pages/LRU'));
const ChunkUpload = lazy(() => import('@/pages/ChunkUpload'));
const IosLoading = lazy(() => import('@/pages/IosLoading'));

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
      path: '/lazy-module',
      element: <LazyModule />,
      children: [],
    },
    {
      path: '/ordinary-list',
      element: <OrdinaryList />,
      children: [],
    },
    {
      path: '/limit-virtual-list',
      element: <LimitVirtualList />,
      children: [],
    },
    {
      path: '/not-limit-virtual-list',
      element: <NotLimitVirtualList />,
      children: [],
    },
    {
      path: '/barrage',
      element: <Barrage />,
      children: [],
    },
    {
      path: '/lru',
      element: <LRU />,
      children: [],
    },
    {
      path: '/chunk-upload',
      element: <ChunkUpload />,
      children: [],
    },
    {
      path: '/ios-loading',
      element: <IosLoading />,
      children: [],
    },
  ]);

  return <Suspense fallback={<div>loading...</div>}>{element}</Suspense>;
}
