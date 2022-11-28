import { Modal, Table, Button, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../request-api/api_client';
import '../../style/lecture.css'
import Header from '../Header';
import LectureDetailContainer from './LectureDetailContainer';
const LectureContainer = () => {

  const [listData, setListData] = useState();
  const [listSemesters, setListSemesters] = useState();
  const [semesterId, setSemesterId] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');
  const navigation = useNavigate();
  const _requestData = async () => {
    const { data } = await apiClient.get(`/api/lecture/list-observation-review?campusId=${campusId}&semesterId=${semesterId}&accountId=${userId}`)
    data.items = data.items.map((item, idx) => {
      var date = new Date(`${item.slotTime}`);
      item.slotTime =
        ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
      return item;
    })
    setListData(data.items);
  }

  const getSemesters = async () => {
    const { data } = await apiClient.get('/api/semester-list')
    setListSemesters(data);
  }

  useEffect(() => {
    getSemesters()
  }, [])
  useEffect(() => {
    _requestData();
  }, [semesterId])
  const showModal = (record) => {
    setOpen(true);
    setDetail(record);
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
      title: 'Tên GV được dự giờ',
      dataIndex: 'lectureName',
      key: 'lectureName',
    },
    {
      title: 'Ca học',
      dataIndex: 'slotName',
      key: 'slotName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'slotTime',
      key: 'slotTime',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Phòng',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Bộ môn',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      render: (text, record) => (
        <Button onClick={() => showModal(record)}>
          {"Chi tiết"}
        </Button>
      ),
    },
  ];

  const semesterColums = [
    {
      title: 'Kì học',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      render: (text, record) => (
        <Button style={{ width: 130 }} onClick={() => setSemesterId(record.value)} className='is-clickable' >
          {record.name}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Header />
      <p className='has-text-centered has-text-weight-bold is-size-3'>Danh sách đi dự giờ của giảng viên</p>
      <Drawer
        width={620}
        open={open}
        title={
          <div className='has-text-centered has-text-weight-bold is-size-4'>Phiếu đánh giá chi tiết</div>
        }
        onOk={handleOk}
        onClose={handleCancel}
        footer={null}
      >
        {detail.id && <LectureDetailContainer record={detail} onCancel={handleCancel} />}
      </Drawer>
      <div className='columns'>
        <div className='column ml-4 is-1 mr-6'>
          {listSemesters?.length > 0 && <Table columns={semesterColums} dataSource={listSemesters} pagination={false} />}

        </div>
        <div className='column'>
          {listData?.length > 0 && <Table columns={columns} dataSource={listData} />}
        </div>
      </div>
    </div>
  );
};

export default LectureContainer;