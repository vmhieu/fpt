import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import ModalPlanContainer from './ModalPlanContainer';
import '../../style/plan.css';
import { apiClient } from '../../request-api/api_client';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';



const PlanContainer = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [listPlan, setListPlan] = useState();
  const [listSemesters, setListSemesters] = useState();
  const [semesterId, setSemesterId] = useState(1);
  const userId = true ? 14 : localStorage.getItem('userId');

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/list-observation-slot?semesterId=${semesterId}&accountId=${userId}`)
     data.items = data.items.map((item, idx) => {
      var date = new Date(`${item.slotTime}`);
        item.slotTime =
        ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        return item;
    })
    setListPlan(data.items);
    console.log("convert: ", data.items);
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

  const showModal = () => {
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
      title: 'Tên GV',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'slotTime',
      key: 'slotTime',
    },
    {
      title: 'Ca học',
      dataIndex: 'slot',
      key: 'slot',
    },
    {
      title: 'Phòng học',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
    },
    {
      title: 'Tên môn',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Kết quả',
      key: 'result',
      dataIndex: 'result',
      render: (text, record) => (
       <button onClick={() => handleNavigation(record)}>
         {"Kết quả"}
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

  const handleNavigation = (record) => {
    navigation(`/plan/${record.id}`);
  }
  
  return (
    <>
    <Header />
    <div className='plan-container'>
      <div className='modal-plan'>
        <Button type="primary" onClick={showModal}>
          Tạo kế hoạch dự giờ
        </Button>
        <Modal
          open={open}
          title="Tạo kế hoạch dự giờ"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          >
          <ModalPlanContainer />
        </Modal>
      </div>
      <div className='columns'>
          <div className='column ml-4 is-1 mr-6'>
              {listSemesters?.length > 0 && <Table columns={semesterColums} dataSource={listSemesters} pagination={false}/>}
          </div>
          <div className='column'>
              {listPlan?.length > 0 && <Table columns={columns} dataSource={listPlan} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default PlanContainer;




