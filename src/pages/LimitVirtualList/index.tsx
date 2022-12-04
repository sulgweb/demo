import { createRef, useEffect, useState } from 'react';
import { getData } from '@/helper';
import './index.less';

export default function LimitVirtualList() {
  // 已知item高度、需要与item css高度保持一致
  const itemHeight = 100;
  const pageSize = 10;
  // 原始数据源
  const [dataSource, setDataSource] = useState([]);
  const scrollRef = createRef<HTMLDivElement>();
  const [totalCount, setTotalCount] = useState(0);
  const [beforeCount, setBeforeCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  // 真正渲染的数据
  const [showDataSource, setShowDataSource] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    sliceShowDataSource();
  }, [pageNum, dataSource.length]);

  // 数据初始化
  const init = () => {
    setDataSource(getData());
  };

  // 获取需要展示的数据
  const sliceShowDataSource = () => {
    const { showDataSource, beforeCount, totalCount } = getRenderData({
      pageNum: pageNum,
      pageSize: pageSize,
      dataSource: dataSource,
    });
    setShowDataSource(showDataSource);
    setBeforeCount(beforeCount);
    setTotalCount(totalCount);
  };

  // 获取最大页数
  const getMaxPageNum = () => {
    return getPageNum({
      scrollTop:
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight,
      pageSize: pageSize,
      itemHeight: itemHeight,
    });
  };

  // 1、监听用户scroll事件
  // 2、实时计算页码
  // 3、如果页码发生改变，进行数据切片，重新渲染数据
  // 4、如果页码没有发生改变，保持不动
  const onScroll = () => {
    const maxPageNum = getMaxPageNum();
    const scrollPageNum = getPageNum({
      scrollTop: scrollRef.current.scrollTop,
      pageSize: pageSize,
      itemHeight: itemHeight,
    });
    const currPageNum = Math.min(scrollPageNum, maxPageNum);
    // 如果当前页数保持不变
    if (currPageNum === pageNum) return;
    setPageNum(currPageNum);
  };

  // 计算分页
  const getPageNum = ({ scrollTop, pageSize, itemHeight }) => {
    const pageHeight = pageSize * itemHeight;
    return Math.max(Math.floor(scrollTop / pageHeight), 1);
  };

  // 数据切片
  const getRenderData = ({ pageNum, pageSize, dataSource }) => {
    const startIndex = (pageNum - 1) * pageSize;
    // 这里+2：想要保证顺畅的滑动，快速滑动不白屏，需要至少预留3页数据，前+中+后
    const endIndex = Math.min((pageNum + 2) * pageSize, dataSource.length);
    return {
      showDataSource: dataSource.slice(startIndex, endIndex),
      // 前置数量
      beforeCount: startIndex,
      totalCount: dataSource.length,
    };
  };

  return (
    <div className='limit-virtual-list'>
      {/* 容器层：固定高度 */}
      <div className='scroll' ref={scrollRef} onScroll={onScroll}>
        {/* 滚动层：实际滚动区域高度 */}
        <div style={{ height: `${totalCount * itemHeight}px` }}>
          {/* 通过translateY撑起滚动条 */}
          <div
            className='inner'
            style={{ transform: `translateY(${beforeCount * itemHeight}px)` }}>
            {/* 列表层：实际渲染的数据 */}
            {showDataSource.map((item, index) => {
              return (
                <div className='scroll-item' key={index}>
                  <p>{item.words}</p>
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
