import React from 'react';
import { imageList } from '@/utils/imageList';
import './index.less';

export default function LazyBrowser() {
  return (
    <div className='lazy-browser'>
      {imageList.map((item) => (
        <div className='image' key={item}>
          <img loading='lazy' src={item} />
        </div>
      ))}
    </div>
  );
}
