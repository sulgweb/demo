/*
 * @Author: xiaoyu
 * @Description: 
 * @Date: 2022-06-12 22:57:03
 * @LastEditors: xiaoyu
 * @LastEditTime: 2022-06-22 00:11:09
 */
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.less'
import 'antd/dist/antd.css';
import CommonHeader from './components/CommonHeader';
import CommonMenu from './components/CommonMenu';
import Router from '@/route'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CommonHeader />
    <BrowserRouter>
      <div className='main-center'>

        <div className='main-center-box'>
          <CommonMenu />
          <div className='main-center-box-right'>
            <Suspense fallback={<div>loading...</div>}>
              <Router />
            </Suspense>
          </div>

        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
