/*
 * @Author: xiaoyu
 * @Description:
 * @Date: 2022-06-12 23:08:21
 * @LastEditors: xiaoyu
 * @LastEditTime: 2022-06-29 00:24:59
 */
import { Button, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import ExcelWorker from './excel.worker?worker';

const dataSource = [];

for (let i = 1; i < 30000; i++) {
  dataSource.push({
    key: i,
    name: `name-${i}`,
    age: 18,
    tag: '小羽同学',
    value1: `value1-${i}`,
    value2: `value2-${i}`,
    value3: `value3-${i}`,
  });
}

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '标签',
    dataIndex: 'tag',
    key: 'tag',
  },
  {
    title: 'value1',
    dataIndex: 'value1',
    key: 'value1',
  },
  {
    title: 'value2',
    dataIndex: 'value2',
    key: 'value2',
  },
  {
    title: 'value3',
    dataIndex: 'value3',
    key: 'value3',
  },
];

export default function Excel() {
  const [showTime, setShowTime] = useState(Date.now());

  useEffect(() => {
    updateShowTime();
  }, []);

  const updateShowTime = () => {
    setShowTime(Date.now());
    requestAnimationFrame(updateShowTime);
  };
  // 主线程导出Excel
  const mainExportExcel = () => {
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
      FileSaver.saveAs(_file, 'ExcelJS.xlsx');
    });
  };

  // 子线程导出Excel
  const workerExportExcel = async () => {
    const _file = await new Promise((resolve, reject) => {
      const myWorker = new ExcelWorker();
      myWorker.postMessage({
        columns,
        dataSource,
      });
      myWorker.onmessage = (e) => {
        resolve(e.data.data); // 关闭worker线程
        myWorker.terminate();
      };
    });
    FileSaver.saveAs(_file, 'ExcelJS.xlsx');
  };

  return (
    <div>
      <Button onClick={mainExportExcel}>导出全部</Button>
      <Button onClick={workerExportExcel}>worker导出全部</Button>
      <span>{showTime}</span>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}
