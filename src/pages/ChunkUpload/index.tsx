import React, { useState } from 'react';
import { Button, Switch, Upload } from 'antd';
import { chunkUpload, CHUNK_SIZE } from './helper';
import ChunkWorker from './chunk.worker?worker';
import { useShowTime } from '@/hooks/useShowTime';

export default function ChunkUpload() {
  const showTime = useShowTime();
  const [type, setType] = useState<'default' | 'wasm'>('default');
  // 切换类型(是否开启 wasm)
  const changtType = (value: boolean) => {
    setType(value ? 'wasm' : 'default');
  };

  // 主进程分片上传
  const customRequest = async (options) => {
    const { file } = options;
    const chunkList = [];
    const len = file.size / CHUNK_SIZE;
    for (let i = 0; i < len; i++) {
      chunkList.push({
        start: i * CHUNK_SIZE,
        end: Math.min((i + 1) * CHUNK_SIZE, file.size),
        chunkIndex: i,
      });
    }
    console.time(`main-${type}`);
    await chunkUpload({
      file,
      chunkList,
      totalChunk: chunkList.length,
      type,
    });
    console.timeEnd(`main-${type}`);
  };

  const handleWorker = async (data) => {
    return new Promise((resolve, reject) => {
      const myWorker = new ChunkWorker();
      myWorker.postMessage({ ...data, type });
      myWorker.onmessage = (e) => {
        if (e.data.message === 'chunkUploadDone') {
          myWorker.terminate();
          resolve(true);
        }
      };
    });
  };

  // 单 worker 分片上传
  const customSingleWorkerRequest = async (options) => {
    const { file } = options;
    const chunkList = [];
    const len = file.size / CHUNK_SIZE;
    for (let i = 0; i < len; i++) {
      chunkList.push({
        start: i * CHUNK_SIZE,
        end: Math.min((i + 1) * CHUNK_SIZE, file.size),
        chunkIndex: i,
      });
    }
    console.time(`singleWorker-${type}`);
    await handleWorker({ file, chunkList, totalChunk: chunkList.length });
    console.timeEnd(`singleWorker-${type}`);
  };

  // 多 worker 分片上传
  const customMultiWorkerRequest = async (options) => {
    const { file } = options;
    const workerNums = Math.max(navigator.hardwareConcurrency - 2, 1);
    const workerChunks = Array.from({ length: workerNums }, () => []);
    const len = Math.ceil(file.size / CHUNK_SIZE);
    for (let i = 0; i < len; i += workerNums) {
      for (let j = 0; j < workerNums; j++) {
        const chunkIndex = i + j;
        if (chunkIndex >= len) {
          break;
        }
        workerChunks[j].push({
          start: chunkIndex * CHUNK_SIZE,
          end: Math.min((chunkIndex + 1) * CHUNK_SIZE, file.size),
          chunkIndex,
        });
      }
    }
    console.time(`multiWorker-${type}`);
    await Promise.all(
      workerChunks.map((chunkList) =>
        handleWorker({ file, chunkList, totalChunk: len }),
      ),
    );
    console.timeEnd(`multiWorker-${type}`);
  };

  return (
    <>
      <div>showTime: {showTime}</div>
      <div>
        是否开启 wasm ?
        <Switch checked={type === 'wasm'} onChange={changtType} />
      </div>
      <div>
        <Upload customRequest={customRequest} showUploadList={false}>
          <Button>主进程分片上传</Button>
        </Upload>
      </div>
      <div>
        <Upload
          customRequest={customSingleWorkerRequest}
          showUploadList={false}>
          <Button>单worker分片上传</Button>
        </Upload>
      </div>
      <div>
        <Upload customRequest={customMultiWorkerRequest} showUploadList={false}>
          <Button>多worker分片上传</Button>
        </Upload>
      </div>
    </>
  );
}
