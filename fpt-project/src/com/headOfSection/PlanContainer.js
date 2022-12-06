import { Button, Modal, Table, Drawer, Select, Popconfirm, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ModalPlanContainer from './ModalPlanContainer';
import '../../style/plan.css';
import { apiClient } from '../../request-api/api_client';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { openNotificationWithIcon } from '../../request/notification';



const PlanContainer = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [listPlan, setListPlan] = useState();
  const [listSemesters, setListSemesters] = useState();
  const [semesterId, setSemesterId] = useState(1);
  const userId = localStorage.getItem('userId');
  const [count, setCount] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [isDoneAccount, setIsDoneAccount] = useState(false);
  const [slot, setSlot] = useState([]);
  const [room, setRoom] = useState([]);
  const [subject, setSubject] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const campusId = localStorage.getItem('campusId');

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/list-observation-slot?semesterId=${semesterId}&accountId=${userId}`)
     data.items = data.items.map((item, idx) => {
      var date = new Date(`${item.slotTime}`);
        item.slotTime =
        ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        let accountName1 = accounts.find(o => o.value == item.accountId1)?.name;
        var accountName2 = accounts.find(o => o.value == item.accountId2)?.name;
        var roomName = room.find(o => o.value == item.roomId)?.name;
        var subjectCode = subject.find(o => o.value == item.subjectId)?.name;
        var slotName = slot.find(o => o.value == item.slotId)?.name;
        return {...item, accountName1: accountName1, accountName2: accountName2, roomName: roomName, subjectCode: subjectCode, slotName: slotName};
    })
    setListPlan(data.items);
  }
  const getSlot = async () => {
    const {data} = await apiClient.get('/api/slot-list')
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setSlot(rooms);
  }
  const getSubjects = async () => {
    const {data} = await apiClient.get(`/api/subject-dropdown-list?id=${campusId}&code=`)
    var subjects = data;
    subjects = subjects.map((item, idx) => {
      return {...item, label: item.name}
    })
    setSubject(subjects);
  }
  const getRooms = async () => {
    const {data} = await apiClient.get(`/api/room-dropdown-list?id=${campusId}&name=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setRoom(rooms);
  }
  const getAccounts = async () => {
    const {data} = await apiClient.get(`/api/list-account?id=${campusId}&email=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setAccounts(rooms);
    setIsDoneAccount(true)
  }

  const getSemesters = async () => {
    const {data} = await apiClient.get('/api/semester-list')
    setListSemesters(data);
  }
  
  useEffect(() => {
    getSemesters();
    getSlot();
    getRooms();
    getSubjects();
    getAccounts();
    setIsDone(true)
  }, [])
  
  useEffect(() => {
    if(isDone & isDoneAccount){
      _requestData();
      setCount(semesterId)
    }
  }, [semesterId, isDone, isDoneAccount])

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
      title: 'Thời gian',
      dataIndex: 'slotTime',
      key: 'slotTime',
    },
    {
      title: 'Ca học',
      dataIndex: 'slotName',
      key: 'slotName',
      render: (text, record, idx) => (
        isUpdate && idx == index ? 
        <Select className='select-box' style={{width: '100%'}} defaultValue={text} options={slot} onChange={(e) => handleSlotChange(e, record)}/>
        : <div>{text}</div>
       ),
       width: '10%'
    },
    {
      title: 'Phòng học',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text, record, idx) => (
        isUpdate && idx == index ? 
        <Select className='select-box' style={{width: '100%'}} defaultValue={text} options={room} onChange={(e) => handleRoomChange(e, record)}/>
        : <div>{text}</div>
       ),
       width: '10%'

    },
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      render: (text, record, idx) => (
        isUpdate && idx == index ? 
        <Select className='select-box' style={{width: '100%'}} defaultValue={text} options={subject} onChange={(e) => handleSubjectChange(e, record)}/>
        : <div>{text}</div>
       ),
       width: '10%'

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
      title: 'Tên GV1',
      dataIndex: 'accountName1',
      key: 'accountName1',
    },
    {
      title: 'Tên GV2',
      dataIndex: 'accountName2',
      key: 'accountName2',
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
       <Button onClick={() => handleNavigation(record)}>
         {"Kết quả"}
       </Button>
      ),
    },
    {
      title: 'Cập nhật',
      render: (text, record, idx) => (
        isUpdate && idx == index ? 
          <Button type="primary" variant="outlined" onClick={handleClickOpen}>
            Xác nhận
          </Button>
        :
          <Button type="primary" onClick={() => updateSlot(record, idx)}>
          {"Cập nhật"}
          </Button>
      ),
    },
    
  ];

  const [result, setResult] = useState({});
  const handleRoomChange = (e, record) => {
    var values = {...record, roomId: e}
    setResult(values);
  }
  const handleSlotChange = (e, record) => {
    var values = {...record, slotId: e}
    setResult(values);
  }
  const handleSubjectChange = (e, record) => {
    var values = {...record, subjectId: e}
    setResult(values);
  }
  const [isUpdate, setIsUpdate] = useState(false);
  const [index, setIndex] = useState(-1);
  const updateSlot = (values, index) => {
    setIsUpdate(true);
    setIndex(index);
  }

  const postUpdateSlot = async () => {
    var values = {
      id: result.id,
      accountId: result.accountId,
      subjectId:result.subjectId,
      reason:result.reason,
      slotTime:result.slotTime.split("/").reverse().join("-"),
      slotId:result.slotId,
      roomId:result.roomId,
      className:result.className,
      headTraining: parseInt(userId),
      headSubject: parseInt(userId),
      accountId1:result.accountId1,
      accountId2:result.accountId2,
    };
    const {data} = await apiClient.post('/api/update-observation-slot' , values)
    setDialogOpen(false);
    if(data.status == 200){
      openNotificationWithIcon("success", "Cập nhật thành công")
      setIndex(-1);
      _requestData();
    } else {
      openNotificationWithIcon("error", "Thất bại")
    }

  }
  const semesterColums = [
    {
      title: 'Kì học',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      render: (text, record) => (
        <Button style={{width : 130}} onClick={() => setSemesterId(record.value)} className='is-clickable' >
          {record.name}
        </Button>
       ),
    },
  ]

  const handleNavigation = (record) => {
    navigation(`/plan/${record.id}`);
  }
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  
  return (
    <>
    <Header />
    <div className='plan-container'>
      <div className='modal-plan'>
        <Button type="primary"  disabled={count ==listSemesters.length -1 ? false : true} onClick={showModal}>
          Tạo kế hoạch dự giờ
        </Button>
        <Drawer
          width={820}
          open={open}
          title={
            <div className='has-text-weight-bold is-size-4'>
              Tạo kế hoạch dự giờ
            </div>
          }
          onOk={handleOk}
          onClose={handleCancel}
          footer={null}
          >
          <ModalPlanContainer handleCancel={handleCancel}/>
        </Drawer>
      </div>
      <Dialog
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Cập nhật thông tin"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Cập nhật
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Huỷ bỏ</Button>
              <Button onClick={postUpdateSlot} autoFocus>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
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




