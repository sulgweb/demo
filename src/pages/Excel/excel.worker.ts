// excel.worker.ts
import ExcelJS from 'exceljs';

// onmessage事件
onmessage = function (e) {
  const {
    data: { columns, dataSource },
  } = e;
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表
  const worksheet = workbook.addWorksheet('sheet1');

  // 设置表格内容
  const _titleCell = worksheet.getCell('A1');
  _titleCell.value = 'Hello ExcelJS!';

  const workBookColumns = columns.map((item) => ({
    header: item.title,
    key: item.key,
    width: 32,
  }));
  worksheet.columns = workBookColumns;
  worksheet.addRows(dataSource);

  // 导出表格
  workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    // 将获取的数据通过postMessage发送到主线程
    self.postMessage({
      data: _file,
      name: 'worker test',
    });
    self.close();
  });
};
