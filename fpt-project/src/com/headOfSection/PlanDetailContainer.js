import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import Header from '../Header';
import '../../style/plan.css';


const PlanDetailContainer = () => {
  const id = window.location.pathname.split("/")[2];
  const [listData, setListData] = useState();

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/result-observation-slot?oSlotId=${id}`)
    setListData(data.items);
  }
  
  useEffect(() => {
    _requestData();
  }, [])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên GV đánh giá',
      dataIndex: 'lectureName',
      key: 'lectureName',
    },
    {
      title: 'Advantage',
      dataIndex: 'advantage',
      key: 'advantage',
    },
    {
      title: 'Disadvantage',
      dataIndex: 'disadvantage',
      key: 'disadvantage',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'point',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
    },
    
  ];

  return (
    <div>
      <Header />
      {listData?.length > 0 && <Table columns={columns} dataSource={listData} />}
      {listData?.length > 0 && <div className='columns '>
        <div className='column is-1' style={{marginLeft: "40rem"}}>
            <button className='button is-danger'>
              Không đạt
            </button>
        </div>
        <div className='column'>
            <button className='button is-success'>
              Đạt yêu cầu
            </button>
        </div>
      </div>}
    </div>
  );
};

export default PlanDetailContainer;