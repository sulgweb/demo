/*
 * @Author: xiaoyu
 * @Description:
 * @Date: 2022-06-12 23:08:21
 * @LastEditors: xiaoyu
 * @LastEditTime: 2022-06-29 00:24:59
 */
import { Button, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import ComporessWorker from './compress.worker?worker';

const allImgNum = 100;
const url =
  'https://pic3.zhimg.com/v2-58d652598269710fa67ec8d1c88d8f03_r.jpg?source=1940ef5c';

export default function Home() {
  const [showTime, setShowTime] = useState(Date.now());

  useEffect(() => {
    updateShowTime();
  }, []);

  const updateShowTime = () => {
    setShowTime(Date.now());
    requestAnimationFrame(updateShowTime);
  };

  // 主线程压缩图片
  const mainCompressImg = async () => {
    const res = await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.setAttribute('crossOrigin', 'Anonymous');
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
    // console.log(res);
    console.time('compress');
    for (let i = 0; i < allImgNum; i++) {
      const compressRes = compressImg(res);
      // console.log(compressRes);
    }
    console.timeEnd('compress');
    return res;
  };

  const compressImg = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.75);
  };

  // 子线程压缩图片
  const workerCompressImg = async () => {
    const res = await fetch(url).then((res) => res.blob());
    const workerList = [[], [], [], [], []];
    for (let i = 0; i < allImgNum / 5; i++) {
      workerList[0].push(res);
      workerList[1].push(res);
      workerList[2].push(res);
      workerList[3].push(res);
      workerList[4].push(res);
    }

    console.time('compressWorker');
    const pList = [];
    for (let item of workerList) {
      const compressP = new Promise((resolve, reject) => {
        const myWorker = new ComporessWorker();
        myWorker.postMessage({
          imageList: item,
        });
        myWorker.onmessage = (e) => {
          resolve(e.data.data);
        };
      });
      pList.push(compressP);
    }

    const pRes = await Promise.all(pList);
    console.log(pRes);
    console.timeEnd('compressWorker');
  };

  return (
    <div>
      <Button onClick={mainCompressImg}>压缩图片</Button>
      <Button onClick={workerCompressImg}>worker压缩图片</Button>
      <span>{showTime}</span>
    </div>
  );
}
