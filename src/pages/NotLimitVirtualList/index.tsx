import React, { useState, useEffect } from 'react';
import { getData } from '@/helper';
import VirtualScroll from '@/components/VirtualScroll';
import './index.less';

export default function NotLimitVirtualList() {
  const [list, setList] = useState([]);
  const init = () => {
    setList(getData());
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {list.length > 0 && (
        <VirtualScroll list={list} containerHeight={'100%'}>
          {(item) => (
            <div className='list-item'>
              <p>{item.words}</p>
              <p>{item.content}</p>
              <div style={{ height: item.height }}></div>
            </div>
          )}
        </VirtualScroll>
      )}
    </>
  );
}
