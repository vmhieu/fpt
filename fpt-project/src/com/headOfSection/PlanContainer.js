import { Button, Modal, Table, Drawer, Select, Popconfirm, message, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import ModalPlanContainer from './ModalPlanContainer';
import '../../style/plan.css';
import { apiClient } from '../../request-api/api_client';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { openNotificationWithIcon } from '../../request/notification';
import { CardCustom } from '../../helper/styled_component';
import {
  PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
  UploadOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import Footer from '../Footer';
import moment from 'moment';
import ModalSlotContainer from './ModalSlotContainer';



const dataStatus = [
  {
    name : 'Đợi duyệt',
    backgroundColor : 'yellow',
    color : 'black',
    disabled : false
  },
  {
    name : 'Đã duyệt',
    backgroundColor : '#1677ff',
    color : 'black',
    disabled : true
  },
  {
    name : 'Từ chối',
    backgroundColor : '#ff4d4f',
    color : 'black',
    disabled : false
  }
]

const PlanContainer = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSlot, setOpenSlot] = useState(false);
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
  const [selectedRow, setSelectRow] = useState([]);
  const [status , setStatus] = useState({});
  const [planId, setPlanId] = useState();


  const campusId = localStorage.getItem('campusId');

  const _getStatusListPlan = async(id) => {
    const { data } = await apiClient.get(`/api/status-observation-plan?planId=${id}`)
    setStatus(dataStatus[data.items])
  }

  const _requestData = async () => {
    const { data } = await apiClient.get(`/api/list-observation-slot?semesterId=${semesterId}&accountId=${userId}`)
    _getStatusListPlan(data.items[0].id)
    setPlanId(data.items[0].id)
    data.items = data.items.map((item, idx) => {
      var date = new Date(`${item.slotTime}`);
      item.slotTime =
        ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
      let accountName1 = accounts.find(o => o.value == item.accountId1)?.name;
      var accountName2 = accounts.find(o => o.value == item.accountId2)?.name;
      var roomName = room.find(o => o.value == item.roomId)?.name;
      var subjectCode = subject.find(o => o.value == item.subjectId)?.name;
      var slotName = slot.find(o => o.value == item.slotId)?.name;
      return { ...item, accountName1: accountName1, accountName2: accountName2, roomName: roomName, subjectCode: subjectCode, slotName: slotName , key : item.id };
    })
    setListPlan(data.items);
  }
  const getSlot = async () => {
    const { data } = await apiClient.get('/api/slot-list')
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return { ...item, label: item.name }
    })
    setSlot(rooms);
  }
  const getSubjects = async () => {
    const { data } = await apiClient.get(`/api/subject-dropdown-list?id=${campusId}&code=`)
    var subjects = data;
    subjects = subjects.map((item, idx) => {
      return { ...item, label: item.name }
    })
    setSubject(subjects);
  }
  const getRooms = async () => {
    const { data } = await apiClient.get(`/api/room-dropdown-list?id=${campusId}&name=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return { ...item, label: item.name }
    })
    setRoom(rooms);
  }
  const getAccounts = async () => {
    const { data } = await apiClient.get(`/api/list-account?id=${campusId}&email=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return { ...item, label: item.name }
    })
    setAccounts(rooms);
    setIsDoneAccount(true)
  }

  const getSemesters = async () => {
    const { data } = await apiClient.get('/api/semester-list')
    setListSemesters(data);
  }

  const getSemesterCurrent = async () => {
    const { data } = await apiClient.get('/api/semester-current')
    setSemesterId(data?.items)
  }

  useEffect(() => {
    getSemesters();
    getSlot();
    getRooms();
    getSubjects();
    getAccounts();
    setIsDone(true)
    getSemesterCurrent()
  }, [])

  useEffect(() => {
    if (isDone & isDoneAccount) {
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
    setOpenSlot(false)
  };
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Thời gian',
      dataIndex: 'slotTime',
      key: 'slotTime',
      render: (text, record, idx) => (
        isUpdate && idx == index ?
        <DatePicker style={{width: "13rem"}} onChange={(e) => onDatePickerChange(e, record)} disabledDate={(current) => {
          console.log("");
          return moment().add(-1, 'days')  >= current 
          }}/>
          // <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={accounts} onChange={(e) => handleAccount1Change(e, record)} />
          : <div>{text}</div>
      ),
    },
    {
      title: 'Ca học',
      dataIndex: 'slotName',
      key: 'slotName',
      render: (text, record, idx) => (
        isUpdate && idx == index ?
          <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={slot} onChange={(e) => handleSlotChange(e, record)} />
          : <div>{text}</div>
      ),
      width: 150
    },
    {
      title: 'Phòng học',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text, record, idx) => (
        isUpdate && idx == index ?
          <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={room} onChange={(e) => handleRoomChange(e, record)} />
          : <div>{text}</div>
      ),
      width: 150


    },
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      render: (text, record, idx) => (
        isUpdate && idx == index ?
          <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={subject} onChange={(e) => handleSubjectChange(e, record)} />
          : <div>{text}</div>
      ),
      width: 200
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
      render: (text, record, idx) => (
        isUpdate && idx == index ?
          <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={accounts} onChange={(e) => handleAccount1Change(e, record)} />
          : <div>{text}</div>
      ),
    },
    {
      title: 'Tên GV2',
      dataIndex: 'accountName2',
      key: 'accountName2',
      render: (text, record, idx) => (
        isUpdate && idx == index ?
          <Select className='select-box' style={{ width: '100%' }} defaultValue={text} options={accounts} onChange={(e) => handleAccount2Change(e, record)} />
          : <div>{text}</div>
      ),
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
      fixed: 'right',
      width: 130,
      render: (text, record) => (
        <Button onClick={() => handleNavigation(record)}>
          {"Kết quả"}
        </Button>
      ),
    },
    {
      title: 'Cập nhật',
      fixed: 'right',
      width: 130,
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

  const _handleDel = () => {
    const isBool = window.confirm("Bạn có muốn xoá không")
    if (isBool) {
        selectedRow.map(async (item) => {
            try {
                const { data } = await apiClient.post(`/api/delete-plan?id=${item}`)
                openNotificationWithIcon("success", "Xoá thành công");
            } catch (error) {
                openNotificationWithIcon("error",error.message)
            }
        })
    }
    setTimeout(() => {
      _requestData()
    } ,1000)
}

  const [result, setResult] = useState({});
  const handleRoomChange = (e, record) => {
    var values = { ...record, roomId: e }
    setResult(values);
  }
  const handleSlotChange = (e, record) => {
    var values = { ...record, slotId: e }
    setResult(values);
  }
  const handleSubjectChange = (e, record) => {
    var values = { ...record, subjectId: e }
    setResult(values);
  }
  const handleAccount1Change = (e, record) => {
    var values = { ...record, accountId1: e }
    setResult(values);
  }
  const handleAccount2Change = (e, record) => {
    var values = { ...record, accountId2: e }
    setResult(values);
  }
  const onDatePickerChange = (e, record) => {
    console.log("dfhsdkjfhs: ", record)
    var date = new Date(e._d),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      var dateResult = [date.getFullYear(), mnth, day].join("-");
      console.log("eeeeee:", dateResult);
    var values = { ...record, slotTime: dateResult }
    setResult(values);
  }
  const [isUpdate, setIsUpdate] = useState(false);
  const [index, setIndex] = useState(-1);
  const updateSlot = (values, index) => {
    setResult(values)
    setIsUpdate(true);
    setIndex(index);
  }

  const postUpdateSlot = async () => {
    console.log("1111111111: ", result);
    var values = {
      id: result.id,
      accountId: result.accountId,
      subjectId: result.subjectId,
      reason: result.reason,
      // slotTime: result.slotTime.split("/").reverse().join("-"),
      
      slotTime: result.slotTime,
      slotId: result.slotId,
      roomId: result.roomId,
      className: result.className,
      headTraining: parseInt(userId),
      headSubject: parseInt(userId),
      accountId1: result.accountId1,
      accountId2: result.accountId2,
    };
    handleClose();
    const { data } = await apiClient.post('/api/update-observation-slot', values)
    setDialogOpen(false);
    if (data.status == 200) {
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
        <Button style={{ width: 130 }} onClick={() => setSemesterId(record.value)} className='is-clickable' >
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
          <Button type="primary" disabled={semesterId == listSemesters?.length ? false : true} onClick={showModal}>
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
            <ModalPlanContainer handleCancel={handleCancel} />
          </Drawer>
          <Drawer
            width={820}
            open={openSlot}
            title={
              <div className='has-text-weight-bold is-size-4'>
                Tạo slot
            </div>
            }
            onOk={handleOk}
            onClose={handleCancel}
            footer={null}
          >
            <ModalSlotContainer handleCancel={handleCancel} planId={planId}/>
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
            {listSemesters?.length > 0 &&
              <Table
                columns={semesterColums}
                dataSource={listSemesters}
                pagination={false}
              />}
          </div>
          <div className='column' style={{ borderLeft: "1px solid black" }}>
            {listPlan?.length > 0 &&
              <CardCustom
                title={
                  <div style={{display :'flex' , alignContent : 'center'}}>
                    <p style={{marginRight : 20}}>Bảng trưởng bộ môn</p>
                <Button onClick={() => postUpdateSlot()} disabled={status.disabled} style={{background : status?.backgroundColor || 'blue' , color : status.color}}>{status?.name || ''}</Button>
                  </div>
                }
                extra={<Extra
                  showDel={selectedRow && selectedRow[0]}
                  // listColumn={[]}

                  _onReload={_requestData}
                  _handleDel={selectedRow.length > 0 ? _handleDel : () => { }}
                  _onClickAdd={() => setOpenSlot(true)}
              // _onClickColumnShow={() => setShowColumn(true)}
              />}
              >
                <Table style={{width: '1300px'}}
                  rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                      console.log(selectedRowKeys, selectedRows);
                      setSelectRow(selectedRowKeys)
                    }
                  }}
                  columns={columns}
                  scroll={{
                    x: 2253.63,
                  }}
                  dataSource={listPlan} /></CardCustom>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default PlanContainer;



const Extra = ({
  showDel = true,

  _handleDel = () => { },
  _onClickAdd = () => { },
  _onFilter = () => { },
  _onReload = () => { },
  // _onClickColumnShow = () => { },
}) => {

  return (
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: 1 }}>
              <div style={{ display: 'flex' }}>
                  <Button onClick={() => _onClickAdd()} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm</Button>
                  {!showDel ? null : <Button onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >Xoá item đã chọn</Button>}
                  <Button onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >Làm mới</Button>
                  {/* <Button onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm</Button> */}
              </div>
          </div>
      </div>
  )
}

