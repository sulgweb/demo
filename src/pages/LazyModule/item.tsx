import React, { useEffect, useState, useRef } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import axios from 'axios';
import { Spin } from 'antd';

export default function LazyModuleItem() {
  const itemRef = useRef(null);
  const visible = useIntersectionObserver(itemRef);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const init = () => {
    setLoading(true);
    axios
      .get('https://api.uomg.com/api/comments.163?format=text')
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        setData(res.data);
      });
  };
  useEffect(() => {
    if (visible) {
      init();
    }
  }, [visible]);
  return (
    <div ref={itemRef}>
      {!visible || loading ? <Spin /> : <div>{data}</div>}
    </div>
  );
}
