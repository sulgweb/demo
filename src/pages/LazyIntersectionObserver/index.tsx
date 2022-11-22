import React, { useRef } from 'react';
import { imageList } from '@/utils/imageList';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import './index.less';

const loadingPath = location.origin + '/images/loading.gif';

const Item = ({ url }) => {
  const itemRef = useRef<HTMLDivElement>();
  const visible = useIntersectionObserver(itemRef);
  return (
    <div className='image' ref={itemRef}>
      {visible ? <img src={url} /> : <img src={loadingPath} />}
    </div>
  );
};

export default function LazyIntersecctionObserver() {
  return (
    <div className='lazy-intersection-observer'>
      {imageList.map((item) => (
        <Item url={item} key={item} />
      ))}
    </div>
  );
}
