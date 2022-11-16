import React from 'react';
import { imageList } from '@/utils/imageList';
import './index.less';

export default function LazyBrowser() {
  return (
    <div className='lazy-browser'>
      {imageList.map((item) => (
        <img className='image' loading='lazy' src={item} />
      ))}
    </div>
  );
}
