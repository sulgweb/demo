import { useEffect } from 'react';

const useImageLazyScroll = (domList) => {
  console.log(domList);
  const getTop = () => {
    // 元素滚动的距离
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    // 当前视窗的可视区域
    let clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    let len = domList.length;
    for (let i = 0; i < len; i++) {
      // 元素距离页面顶部的距离
      let { top } = domList[i].getBoundingClientRect();
      // 当图片到顶部的距离大于可视区域和滚动区域之和的时候，再将data-src的值赋值给src
      if (top < scrollTop + clientHeight) {
        // 当元素已经拥有src属性时，不再为其进行src属性赋值操作
        if (!domList[i].src) {
          domList[i].src = domList[i].dataset.src;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', getTop);
    return document.removeEventListener('scroll', getTop);
  }, []);
};

export default useImageLazyScroll;
