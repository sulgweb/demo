import React, { useState, useEffect } from 'react';
import { Button, Spin, Select } from 'antd';

const DEFAULT_DURATION = 300;

export default function IosLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(200);
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

  // 模拟请求
  const fetchData = async () => {
    const start = Date.now();
    setData(null);
    setStartTime(start);

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
        }, 200);
      }
    });
  };

  return (
    <div>
      <div>
        <Select
          style={{ marginBottom: 12, width: 120 }}
          value={duration}
          onChange={(value) => {
            console.log('value', value);
            setDuration(value);
          }}
          options={[
            { label: '100ms', value: 100 },
            { label: '200ms', value: 200 },
            { label: '500ms', value: 500 },
            { label: '1000ms', value: 1000 },
          ]}
        />
      </div>
      <div>
        <Button type='primary' onClick={fetchData}>
          请求
        </Button>
      </div>

      {isLoading && <Spin size='large' />}
      {data && <div>请求耗时:{data.duration}ms</div>}
    </div>
  );
}
