import React, { useEffect, useRef } from 'react';
import { imageList } from '@/utils/imageList';
import './index.less';

const loadingPath = location.origin + '/images/loading.gif';
export default function LazyScroll() {
  const domRef = useRef([]);
  const lazyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTop();
    lazyScrollRef.current.addEventListener('scroll', getTop);
    return () => {
      if (lazyScrollRef.current) {
        lazyScrollRef.current.removeEventListener('scroll', getTop);
      }
    };
  }, []);

  const getTop = () => {
    // 当前视窗的可视区域
    let clientHeight = lazyScrollRef.current.clientHeight;
    let len = domRef.current.length;
    for (let i = 0; i < len; i++) {
      // 元素距离页面顶部的距离
      let { top } = domRef.current[i].getBoundingClientRect();
      // 当图片减去可视区域高度小于等于0的时候，将data-src的值赋值给src
      if (top - clientHeight <= 0) {
        if (domRef.current[i].src === loadingPath) {
          domRef.current[i].src = domRef.current[i].dataset.src;
        }
      }
    }
  };
  return (
    <div className='lazy-scroll' ref={lazyScrollRef}>
      {imageList.map((item, index) => (
        <img
          className='image'
          key={item}
          ref={(e) => (domRef.current[index] = e)}
          data-src={item}
          src={loadingPath}
        />
      ))}
    </div>
  );
}
