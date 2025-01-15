import React, { useState, useEffect } from 'react';
import { Button, Spin, Select } from 'antd';
import "./index.less"

const DEFAULT_DURATION = 200;
const DEFAULT_LOADING_SHOW_TIME = 500;

export default function IosLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(50);
  const [data, setData] = useState(null);

  const mockRequest = () => {
    const start = Date.now();
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            code: 200,
            message: 'success',
            duration: Date.now() - start,
          }),
        duration,
      );
    });
  };

  // 请求
  const fetchData = async () => {
    const start = Date.now();
    setData(null);

    // 在请求开始后xxx ms开始显示 loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(true);
    }, DEFAULT_DURATION);

    mockRequest().then((res) => {
      const end = Date.now();
      const _duration = end - start;
      if (_duration < DEFAULT_DURATION) {
        clearTimeout(loadingTimer);
        setIsLoading(false);
        setData(res);
      } else {
        setTimeout(() => {
          setData(res);
          setIsLoading(false);
        }, DEFAULT_LOADING_SHOW_TIME + DEFAULT_DURATION - _duration);
      }
    });
  };

  const defaultfetchData = async () => {
    setIsLoading(true);
    mockRequest().then((res) => {
      setIsLoading(false);
      setData(res);
    });
  }


  return (
    <div className='ios-loading'>
      <div>
        <Select
          style={{ marginBottom: 12, width: 120 }}
          value={duration}
          onChange={(value) => {
            setDuration(value);
          }}
          options={[
            { label: '50ms', value: 50 },
            { label: '100ms', value: 100 },
            { label: '150ms', value: 150 },
            { label: '200ms', value: 200 },
            { label: '500ms', value: 500 },
            { label: '1000ms', value: 1000 },
          ]}
        />
      </div>
      <div>
        <Button type='primary' onClick={fetchData}>
          延时动画请求
        </Button>
        <Button onClick={defaultfetchData}>
          默认请求
        </Button>
      </div>

      {isLoading && <div className='loading'><Spin size='large' /></div>}
      <div>请求耗时:{data?.duration}ms</div>
    </div>
  );
}
