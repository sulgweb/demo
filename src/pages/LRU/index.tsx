import React, { useRef, useEffect, useState } from 'react';
import LRUCache from '@/utils/lru';
import { Button, Input } from 'antd';
import './index.less';

const DEFAULT_STORAGE_KEY = 'search';
export default function LRU() {
  const [value, setValue] = useState('');
  const LRUCacheRef = useRef(null);
  useEffect(() => {
    LRUCacheRef.current = new LRUCache({
      size: 5,
      storageKey: DEFAULT_STORAGE_KEY,
    });
  }, []);
  const changeValue = (e) => {
    setValue(e.target.value);
  };
  const putKey = () => {
    LRUCacheRef.current.put(value, true);
  };
  return (
    <div className='lru'>
      <div>
        <Input
          placeholder='请输入搜索内容'
          value={value}
          onChange={changeValue}
        />
      </div>
      <Button onClick={putKey}>search</Button>
    </div>
  );
}
