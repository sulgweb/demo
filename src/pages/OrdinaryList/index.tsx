import React, { useState, useEffect } from 'react';
import { getData } from '@/helper';
import './index.less';

export default function OrdinaryList() {
  const [list, setList] = useState([]);
  const init = () => {
    setList(getData());
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div className='ordinary-list'>
      {list.map((item) => {
        return (
          <div key={item.id} className='list-item'>
            <p>{item.words}</p>
            <p>{item.content}</p>
            <div style={{ height: item.height }}></div>
          </div>
        );
      })}
    </div>
  );
}
