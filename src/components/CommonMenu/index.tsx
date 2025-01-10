/*
 * @Description:
 * @Author: xiaoyu
 * @LastEditors: xiaoyu
 * @Date: 2022-06-20 20:57:56
 * @LastEditTime: 2022-06-21 23:54:59
 */
import React, { useEffect, useState } from 'react';
import './index.less';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CommonMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname) {
      setCurSelect(pathname);
    }
  }, [pathname]);

  const [curSelect, setCurSelect] = useState('');
  const items = [
    { label: '表格导出', key: '/excel' },
    { label: '图片压缩', key: '/compress' },
    { label: '懒加载（浏览器）', key: '/lazy-browser' },
    { label: '懒加载（scroll）', key: '/lazy-scroll' },
    {
      label: '懒加载（intersectionObserver）',
      key: '/lazy-intersection-observer',
    },
    { label: '模块懒加载', key: '/lazy-module' },
    { label: '普通列表', key: '/ordinary-list' },
    { label: '定高虚拟列表', key: '/limit-virtual-list' },
    { label: '不定高虚拟列表', key: '/not-limit-virtual-list' },
    { label: 'LRU', key: '/lru' },
    { label: '分片上传', key: '/chunk-upload' },
    { label: 'ios加载动画', key: '/ios-loading' },
    /*{
      label: 'AI-LOL防弹弹幕',
      key: '/barrage',
    },*/
  ];

  const handleSelect = (e) => {
    console.log(e);
    setCurSelect(e.key);
    navigate(e.key);
  };
  return (
    <div className='common-menu'>
      <Menu
        selectedKeys={[curSelect]}
        items={items}
        mode='inline'
        onSelect={handleSelect}
      />
    </div>
  );
}
