import React, { useRef, useState, useEffect } from 'react';
import { startDetectFrame, setAttributes } from './helper';
import { Button } from 'antd';
import './index.less';
import TestVideo from './test.mp4';

const SVG_DEFAULT_WIDTH = 1280;
const SVG_DEFAULT_HEIGHT = 720;
const BARRAGE_STREAM_HEIGHT = 50;

function ResultItem(props) {
  const SCORE_THRESHOLD = 0.3;
  const {
    data: { cls, score, position },
  } = props;
  const top = position[1] * 100 + '%';
  const left = position[0] * 100 + '%';
  const width = (position[2] - position[0]) * 100 + '%';
  const height = (position[3] - position[1]) * 100 + '%';
  return (
    score > SCORE_THRESHOLD && (
      <div className='result-box-item' style={{ top, left, width, height }}>
        {/* <div>
          {cls}:{score}
        </div> */}
      </div>
    )
  );
}

export default function Barrage() {
  const videoRef = useRef<HTMLVideoElement>();
  const timerRef = useRef(null);
  const barrageStreamRef = useRef(null);
  const [visable, setVisabel] = useState(false);
  const [borderList, setBorderList] = useState([]);
  const [boxData, setBoxData] = useState({
    boxWidth: 0,
    boxHeight: 0,
    boxTop: 0,
    boxLeft: 0,
  });
  const boxDataRef = useRef({
    boxWidth: 0,
    boxHeight: 0,
    boxTop: 0,
    boxLeft: 0,
  });
  const [barrageMask, setBarrageMask] = useState<any>();
  const [barrageStream, setBarrageStream] = useState([]);

  const changBarrageStream = (list) => {
    barrageStreamRef.current = list;
    setBarrageStream([...list]);
  };

  useEffect(() => {
    if (visable) {
      setTimeout(() => {
        startDetectFrame(videoRef?.current, updateBorderList);
      }, 2000);
    }
  }, [visable]);

  const handleStart = () => {
    setVisabel(true);
  };

  const updateBorderList = (e) => {
    console.log(e);
    const list = e.map((item) => {
      const { position } = item;
      return {
        x: position[0] * SVG_DEFAULT_WIDTH,
        y: position[1] * SVG_DEFAULT_HEIGHT + 50,
      };
    });
    const svg = createSvg(list);
    console.log(svg);
    setBarrageMask(svg);
    // setBorderList(e);
  };

  const onChangeBox = (data) => {
    clearInterval(timerRef.current);
    const params = {
      boxWidth: data.curWidth,
      boxHeight: data.curHeight,
      boxTop: data.top,
      boxLeft: data.left,
    };
    setBoxData(params);
    const streamList = [];
    const len = Math.floor(data.curHeight / 24);
    for (let i = 0; i < len; i++) {
      const barrageList = [];
      streamList.push(barrageList);
    }
    barrageStreamRef.current = streamList;
    timerRef.current = setInterval(() => {
      const num = Math.floor(Math.random() * len);
      barrageStreamRef.current[num].push({
        id: randomString(8),
        value: '小羽同学的弹幕',
      });
      changBarrageStream(barrageStreamRef.current);
      setTimeout(() => {
        barrageStreamRef.current[num].splice(0, 1);
        changBarrageStream(barrageStreamRef.current);
      }, 5000);
    }, 50);
    setBarrageStream(streamList);
    boxDataRef.current = params;
  };

  // video可以播放
  const onCanPlay = (e) => {
    e.target.clientWidth;
    onChangeBox({
      curWidth: e.target.clientWidth,
      curHeight: e.target.clientHeight,
      top: 0,
      left: 0,
    });
  };

  // 创建svg标签
  const createSvg = (list) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
      'viewBox',
      `0 0 ${SVG_DEFAULT_WIDTH} ${SVG_DEFAULT_HEIGHT}`,
    );
    const { mask, maskName } = handleMask(list);
    const svgPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    setAttributes(svgPath, {
      x: 0,
      y: 0,
      width: SVG_DEFAULT_WIDTH,
      height: SVG_DEFAULT_HEIGHT,
      mask: `url(#${maskName})`,
    });
    svg.appendChild(svgPath);
    svg.appendChild(mask);
    const s = new XMLSerializer().serializeToString(svg);
    // 通过window.btoa() 方法用于创建一个 base-64 编码的字符串
    const img = `data:image/svg+xml;base64,${window.btoa(s)}`;
    return img;
    // setBarrageMask(svg)
    // document.body.appendChild(svg);
  };

  const handleMask = (list) => {
    const maskName = 'barrageMask-' + Date.now();
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', maskName);
    const maskBg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    setAttributes(maskBg, {
      fill: 'white',
      x: 0,
      y: 0,
      width: SVG_DEFAULT_WIDTH,
      height: SVG_DEFAULT_HEIGHT,
    });
    mask.appendChild(maskBg);
    list.map((item) => {
      const maskCircle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      setAttributes(maskCircle, {
        fill: 'black',
        cx: item.x,
        cy: item.y,
        r: 160,
      });
      mask.appendChild(maskCircle);
    });

    return { mask, maskName };
  };

  function randomString(length) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  return (
    <div>
      <Button onClick={handleStart}>开始</Button>
      {visable && (
        <div className='camera-box'>
          <video
            src={TestVideo}
            ref={videoRef}
            width='800'
            controls
            autoPlay
            muted={false}
            onCanPlay={onCanPlay}></video>
          <div
            className='line-box'
            style={{
              top: boxData.boxTop,
              left: boxData.boxLeft,
              width: boxData.boxWidth,
              height: boxData.boxHeight,
            }}>
            <div className='result-box'>
              {borderList.map((item) => (
                <ResultItem data={item} />
              ))}
            </div>
          </div>
          <div
            className='barrage-box'
            style={{
              width: boxData.boxWidth,
              height: boxData.boxHeight,
              WebkitMaskImage: `url("${barrageMask}")`,
            }}>
            {barrageStream.map((barrage, index) => (
              <div
                key={'barrage-' + index}
                className='barrage-stream'
                style={{ top: 50 * index }}>
                {barrage.map((item) => (
                  <div className='barrage-stream-item' key={item.id}>
                    {item.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
