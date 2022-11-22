import React from 'react';
import LazyModuleItem from './item';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import './index.less';

const list = [...new Array(100).keys()];

export default function LazyModule() {
  return (
    <div className='lazy-module'>
      {list.map((item) => {
        return (
          <div key={item} className='item'>
            <LazyModuleItem />
          </div>
        );
      })}
    </div>
  );
}
