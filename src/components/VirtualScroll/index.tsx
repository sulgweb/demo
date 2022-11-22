import { useEffect, useRef, useState } from 'react';
import Item from './item';

const VirtualScroll = ({
  list,
  containerHeight,
  defaultHeight = 100,
  bufferSize = 20,
  children,
}) => {
  const [state, setState] = useState({
    startOffset: 0,
    endOffset: 0,
    visibleData: [],
  });
  const [anchorItem, setAnchorItem] = useState({
    index: 0, // 锚点元素的索引值
    top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量(即 startOffset)
    bottom: 0, // 锚点元素的底部距离第一个元素的顶部的偏移量
  });
  const scrollDataRef = useRef({
    startIndex: 0,
    endIndex: 0,
    scrollTop: 0,
  });
  const cacheRef = useRef({});
  const visibleCountRef = useRef(0);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const anchorItemRef = useRef({
    index: 0,
    top: 0,
    bottom: 0,
  });

  const changeState = (data) => {
    const newState = {
      ...state,
      ...data,
    };
    setState(newState);
  };

  // 更新锚点位置
  const changeAnchorItem = (data) => {
    const newAnchorItem = {
      ...anchorItem,
      ...data,
    };
    anchorItemRef.current = newAnchorItem;
    setAnchorItem(newAnchorItem);
  };

  // 缓存位置数据
  const cachePosition = (node, index) => {
    const rect = node.getBoundingClientRect();
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const top = rect.top - wrapperRect.top;
    cacheRef.current[index] = {
      index,
      top,
      bottom: top + rect.height,
    };
  };

  // 处理滚动事件
  const handleScroll = (e) => {
    const curScrollTop = containerRef.current.scrollTop;
    if (
      (curScrollTop > scrollDataRef.current.scrollTop &&
        curScrollTop > anchorItemRef.current.bottom) ||
      (curScrollTop < scrollDataRef.current.scrollTop &&
        curScrollTop < anchorItemRef.current.top)
    ) {
      updateBoundaryIndex(curScrollTop);
      updateVisibleData();
    }
    scrollDataRef.current.scrollTop = curScrollTop;
  };

  // 计算 startIndex 和 endIndex
  const updateBoundaryIndex = (scrollTop) => {
    scrollTop = scrollTop || 0;
    // 用户正常滚动下，根据 scrollTop 找到新的锚点元素位置
    const newAnchorItem =
      cacheRef.current[
        Object.keys(cacheRef.current)?.find(
          (key) => cacheRef.current[key].bottom >= scrollTop,
        )
      ];
    if (!newAnchorItem) {
      return;
    }
    changeAnchorItem({ ...newAnchorItem });
    scrollDataRef.current.startIndex = newAnchorItem.index;
    scrollDataRef.current.endIndex =
      newAnchorItem.index + visibleCountRef.current;
  };

  // 更新渲染的数据
  const updateVisibleData = () => {
    const visibleData = list.slice(
      scrollDataRef.current.startIndex,
      scrollDataRef.current.endIndex,
    );
    changeState({
      startOffset: anchorItemRef.current.top,
      endOffset: (list.length - scrollDataRef.current.endIndex) * defaultHeight,
      visibleData,
    });
  };

  useEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    // 计算可渲染的元素个数
    visibleCountRef.current =
      Math.ceil(containerRect.height / defaultHeight) + bufferSize;
    scrollDataRef.current.endIndex =
      scrollDataRef.current.startIndex + visibleCountRef.current;
    updateVisibleData();
    list.map((item, index) => {
      cacheRef.current[index] = {
        index: index,
        top: index * defaultHeight,
        bottom: index * defaultHeight + defaultHeight,
      };
    });
    containerRef.current.addEventListener('scroll', handleScroll, false);
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll, false);
    };
  }, []);

  const { startOffset, endOffset, visibleData } = state;
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      ref={containerRef}>
      <div className='wrapper' ref={wrapperRef}>
        <div
          style={{
            paddingTop: `${startOffset}px`,
            paddingBottom: `${endOffset}px`,
          }}>
          {visibleData.map((item, index) => {
            return (
              <Item
                cachePosition={cachePosition}
                key={scrollDataRef.current.startIndex + index}
                item={item}
                index={scrollDataRef.current.startIndex + index}>
                {children}
              </Item>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default VirtualScroll;
