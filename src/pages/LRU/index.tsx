import React, { useRef, useEffect, useState } from 'react';
import LRUCache from '@/utils/lru';
import { Button, Input, Tag } from 'antd';
import './index.less';

const DEFAULT_STORAGE_KEY = 'search';
export default function LRU() {
  const [value, setValue] = useState('');
  const [cacheList, setCacheList] = useState([]);
  const LRUCacheRef = useRef(null);
  useEffect(() => {
    LRUCacheRef.current = new LRUCache({
      size: 5,
      storageKey: DEFAULT_STORAGE_KEY,
    });
    changeCacheList();
  }, []);
  const changeValue = (e) => {
    setValue(e.target.value);
  };
  const search = (data = null) => {
    const search = data || value;
    if (!search) {
      return;
    }
    LRUCacheRef.current.put(search, true);
    changeCacheList();
  };

  const tagSeach = (data) => {
    setValue(data);
    search(data);
  };

  const changeCacheList = () => {
    const newList = [...LRUCacheRef.current.cache].map((item) => item[0]);
    setCacheList(newList);
  };
  return (
    <div className='lru'>
      <div className='search'>
        <Input
          placeholder='请输入搜索内容'
          value={value}
          onChange={changeValue}
        />
        <Button onClick={() => search()}>search</Button>
      </div>

      <div className='history'>
        <div>搜索历史</div>
        <div>
          {cacheList.map((item) => (
            <Tag key={item} onClick={() => tagSeach(item)}>
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
