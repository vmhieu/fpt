import { Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../request-api/api_client';
import '../../style/lecture.css'
import Header from '../Header';
import TrainingChangeContainer from './TrainingChangeContainer';

const TrainingContainer = () => {
  
  const [listData, setListData] = useState();
  const [listSemesters, setListSemesters] = useState();
  const [semesterId, setSemesterId] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const campusId = localStorage.getItem('campusId');
  const userId = true ? 15 : localStorage.getItem('userId');
  const navigation = useNavigate();
  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/list-search-observation-plan?campusId=${campusId}&semesterId=${semesterId}`)
    data.items = data.items.map((item, idx) => {
      var createdAt = new Date(`${item.createdAt}`);
      var updatedAt = new Date(`${item.updatedAt}`);

        item.createdAt =
        ((createdAt.getMonth() > 8) ? (createdAt.getMonth() + 1) : ('0' + (createdAt.getMonth() + 1))) + '/' + ((createdAt.getDate() > 9) ? createdAt.getDate() : ('0' + createdAt.getDate())) + '/' + createdAt.getFullYear();
        item.updatedAt =
        ((updatedAt.getMonth() > 8) ? (updatedAt.getMonth() + 1) : ('0' + (updatedAt.getMonth() + 1))) + '/' + ((updatedAt.getDate() > 9) ? updatedAt.getDate() : ('0' + updatedAt.getDate())) + '/' + updatedAt.getFullYear();
        return item;
    })
    setListData(data.items);
  }

  const getSemesters = async () => {
    const {data} = await apiClient.get('/api/semester-list')
    setListSemesters(data);
    console.log("semesterList: ", data.items);
  }
  
  useEffect(() => {
    getSemesters()
  }, [])
  useEffect(() => {
    _requestData();
  }, [semesterId])
  const showModal = (record) => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Bộ môn',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'planStatus',
      key: 'planStatus',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      render: (text, record) => (
        <button onClick={() => showModal(record)}>
          {"Chi tiết"}
        </button>
       ),
    },
  ];

  const semesterColums = [
    {
      title: 'Kì học',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      render: (text, record) => (
        <button onClick={() => setSemesterId(record.value)} className='is-clickable' >
          {record.name}
        </button>
       ),
    },
  ]

  return (
    <div>
        <Header />
        <div className='columns'>
          <p className='column is-10 has-text-centered has-text-weight-bold is-size-3'>Danh sách kế hoạch theo kì</p>
          <button className='button is-info ml-6 mt-4' onClick={() => showModal()}>Thay đổi tiêu chí</button>
        </div>
        <Modal
          open={open}
          title="Thay đổi tiêu chí"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          >
          <TrainingChangeContainer data={listData} />
        </Modal>
        <div className='columns'>
          <div className='column ml-4 is-1 mr-6'>
              {listSemesters?.length > 0 && <Table columns={semesterColums} dataSource={listSemesters} pagination={false}/>}

          </div>
          <div className='column'>
              {listData?.length > 0 && <Table columns={columns} dataSource={listData} />}
          </div>
        </div>
    </div>
  );
};

export default TrainingContainer;