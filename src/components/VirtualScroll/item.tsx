import { useEffect, useRef } from 'react';
// import './index.less';

const Item = (props) => {
  const { index, item, cachePosition, children } = props;
  const itemRef = useRef(null);
  useEffect(() => {
    if (cachePosition) {
      cachePosition(itemRef.current, index);
    }
  }, []);
  return (
    <div style={{ height: 'auto' }} ref={itemRef}>
      {children && children(item)}
    </div>
  );
};

export default Item;
