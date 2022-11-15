import { Drawer, Input, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import { openNotificationWithIcon } from '../../request/notification';

const TrainingChangeContainer = (props) => {
  const [listData, setListData] = useState();
  const campusId = localStorage.getItem('campusId');
  const [isUpdate, setIsUpdate] = useState(false);
  const [count, setCount] = useState(-1);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState('');

  const handleCreate = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false);
  };

  const onCreateChange = (e) => {
    setCreate(e.target.value);
  }

  const handlePostCreate = async () => {
    const values = {"campusId": campusId, "criteriaName": create}
    const {data} = await apiClient.post(`/api/training/create-criteria`, values);
    if(data.status == 200){
      openNotificationWithIcon("success", "Thêm mới thành công")
      setOpen(false)
      _requestData();
    } else {
      openNotificationWithIcon("error", "Thất bại")
    }
  }

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/training/list-criteria-campus?id=${campusId}`)
    
    setListData(data.items);
    console.log("convert: ", data.items);
  }

  useEffect(() => {
    _requestData()
  }, [])

  const handleUpdate = (idx, text) => {
    setCount(idx);
    setValue(text);
  }
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const handlePostUpdate = async (id, e) => {
    const values = {"id": id, "campusId": campusId, "criteriaName": value}
    const {data} = await apiClient.post(`/api/training/update-criteria`, values);
    if(data.status == 200){
      openNotificationWithIcon("success", "Cập nhật thành công")
      setCount(-1)
      _requestData();
    } else {
      openNotificationWithIcon("error", "Thất bại")
    }
  }
  const handleDelete = async (index) => {
    const {data} = await apiClient.post(`/api/training/delete-criteria?id=${index}&campusId=${campusId}`);
    if(data.status == 200){
      openNotificationWithIcon("success", "Xoá thành công")
      _requestData();
    } else {
      openNotificationWithIcon("error", "Thất bại")
    }
  }
  return (
    <div>
      <div className='columns'>
        <div className='column is-1'>Id</div>
        <div className='column is-2'>Mã code</div>
        <div className='column'>Tên tiêu chí</div>
        <div className='column is-2'></div>
        <div className='column is-2'>
          <button className='button is-info' onClick={() => handleCreate()}>Thêm mới</button>
        </div>
      </div>
      <Drawer title="Thêm mới" placement="right" onClose={onClose} open={open}>
          <p>Nội dung tiêu chí</p>
          <TextArea rows={4} onChange={(e) => onCreateChange(e)} />
          <button className='button is-primary mt-5' onClick={(e) => handlePostCreate()}>Xác nhận</button>
      </Drawer>
      <hr />
      {listData && listData.map((item, idx) => {
        return(
          <div className='columns' key={idx}>
            <div className='column is-1'>{item.id}</div>
            <div className='column is-2'>{item.criteriaCode}</div>
            <div className='column'>
              {count == idx ? <input bordered={false} value={value} autoFocus={true} onChange={onChange} style={{width: "100%"}} /> : <p>{item.criteriaName}</p>}
              </div>
            <div className='column is-2'>
              {count == idx ?
              <button className='button is-primary' onClick={(e) => handlePostUpdate(item.id, e)}>Xác nhận</button>
              : 
              <button className='button is-primary' onClick={() => handleUpdate(idx, item.criteriaName)}>Update</button>
              }
            </div>
            <div className='column is-2'>
              <button className='button is-danger' onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default TrainingChangeContainer;