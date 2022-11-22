const pageSize = 1000;
export function getData(start = 0) {
  const list = [];
  for (let i = start; i < start + pageSize; i++) {
    list.push({
      id: i,
      key: Math.random().toString(36).slice(-8),
      words: 'word-' + i,
      content: 'content-' + i,
      height: Math.random() * 300,
    });
  }
  return list;
}
