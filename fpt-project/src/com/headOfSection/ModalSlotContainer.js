import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, DatePicker, Form, Input, Select, Space } from 'antd';
import '../../style/plan.css';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import { openNotificationWithIcon } from '../../request/notification';

const ModalSlotContainer = ({handleCancel, planId, requestData}) => {
  const [form] = Form.useForm();
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');
  const [departmentValue, setDepartmentValue] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [slot, setSlot] = useState([]);
  

  const getDepartments = async (searchText) => {
    const {data} = await apiClient.get(`/api/list-department?id=${campusId}&name=${searchText}`)
    return data[0].value;
  }

  const getSemesters = async () => {
    const {data} = await apiClient.get('/api/semester-list')
    // var rooms = data[data.length - 1];
    // const rooms = data;
    const rooms = data.map((item, idx) => {
      return {...item, label: item.name}
    })
    setSemesters(rooms);
  }

  console.log("semesters: " + semesters);
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
    setSubjectOptions(subjects);
  }
  const getRooms = async () => {
    const {data} = await apiClient.get(`/api/room-dropdown-list?id=${campusId}&name=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setRoomOptions(rooms);
  }
  const getAccounts = async () => {
    const {data} = await apiClient.get(`/api/list-account?id=${campusId}&email=`)
    var rooms = data;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setAccounts(rooms);
  }

  useEffect(() => {
    getSubjects();
    getRooms();
    getSemesters();
    getAccounts();
    getSlot();
  }, [])  
  
  
  const onDepartmentSearch = async (searchText) => {
    const {data} = await apiClient.get(`/api/list-department?id=${campusId}&name=${searchText}`)
    const searchData = [];
    if (!searchText) {
      searchData = [];
    }
    if(data && data.length > 0){
      for(let i = 0; i < data.length; i++){
        searchData.push({value: data[i].name})
      }
    }
    setDepartmentOptions(
      !searchText ? [] : searchData,
    );
  };

  const onFinish = (fieldValues) => {
    const ACCOUNT_DICT = Object.fromEntries(
      accounts.map(item => [item.name, item])
    );
      const item = fieldValues;
    
      var date = new Date(item.slotTime._d),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      var dateResult = [date.getFullYear(), mnth, day].join("-");
      var accountId = ACCOUNT_DICT[item.accountId].value;
      var accountId1 = ACCOUNT_DICT[item.accountId1].value;
      var accountId2 = ACCOUNT_DICT[item.accountId2].value;

      var values = {...item,
        headSubject: parseInt(userId),
        slotTime: dateResult,
        headTraining: 1,
        accountId: parseInt(accountId),
        accountId1: parseInt(accountId1),
        accountId2: parseInt(accountId2),
      }
      postPlan(values);
  };

  const postPlan = async (values) => {
    const {data} = await apiClient.post(`/api/add-new-slot?planId=${planId}`, values)
    if(data.status == 200){
      openNotificationWithIcon("success", "Tạo mới thành công")
      handleCancel()
      form.resetFields()
      requestData();
  } else {
    openNotificationWithIcon("error", "Thất bại")
  }
  }

  const handleChange = () => {
    form.setFieldsValue({
    });
  };
  const [array, setArray] = useState([0, 0, 0, 0]);
  const [options, setOptions] = useState([]);
  const onAccountSearch = async (searchText) => {
    const {data} = await apiClient.get(`/api/list-account?id=${campusId}&email=${searchText}`)
    const searchData = [];
    if (!searchText) {
      searchData = [];
    }
    if(data && data.length > 0){
      for(let i = 0; i < data.length; i++){
        searchData.push({label: data[i].name, value: data[i].name})
      }
    }
    setOptions(
      !searchText ? [] : searchData,
    );
  };
  const onSubjectSearch = async (searchText) => {
    const {data} = await apiClient.get(`/api/subject-dropdown-list?id=${campusId}&code=${searchText}`)
    const searchData = [];
    if (!searchText) {
      searchData = [];
    }
    if(data && data.length > 0){
      for(let i = 0; i < data.length; i++){
        searchData.push({label: data[i].name, value: data[i].value})

      }
    }
    setOptions(
      !searchText ? [] : searchData,
    );
  };
  const onSelect = (value, index) => {
    const list = [...array];
    list[index] = value;
    setArray(list);
    setOptions([])
  };
  
  return (
    <div>
    <div className='form-container'>
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      
          <>
              <div className='form-detail pl-4'>
                <div className='form-slot pr-5'>
                  <div className='columns mt-4 '>
                  <div className='column is-flex is-justify-content-end'>
                        <Form.Item
                          label="AccountId"
                          name={['accountId']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (array.filter(item => item == value).length > 1) {
                                  return Promise.reject("Không được trùng");
                                }  else return Promise.resolve()
                              }
                            })
                          ]}
                          >
                            <AutoComplete
                              options={options}
                              style={{
                                width: 200,
                              }}
                              onSearch={onAccountSearch}
                              onSelect={(value) => onSelect(value, 0)}
                              onChange={handleChange}
                              placeholder="input here"
                            />
                        </Form.Item>

                    </div>
                    
                    <div className='column is-flex is-justify-content-end'>
                    
                        <Form.Item
                        label="SubjectId"
                        name={['subjectId']}
                        rules={[
                          {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                            <AutoComplete
                              options={options}
                              style={{
                                width: 200,
                              }}
                              onSearch={onSubjectSearch}
                              onChange={handleChange}
                              placeholder="input here"
                              onSelect={(value) => onSelect(value, 0)}

                            />
                          {/* <Select className='select-box' options={subjectOptions} onChange={handleChange} /> */}
                          
                        </Form.Item>
                    </div>
                 </div>

                  <div className='columns'>
                    <div className='column is-flex is-justify-content-end'>
                        <Form.Item
                          label="SlotId"
                          name={['slotId']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                          <Select className='select-box' options={slot} onChange={handleChange} />
                        </Form.Item>
                    </div>
                    <div className='column is-flex is-justify-content-end'>
                    <Form.Item
                    label="slotTime"
                    name={['slotTime']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing slotTime',
                      },
                    ]}
                  >
                    <DatePicker style={{width: "13rem"}} disabledDate={(current) => {
                      return moment().add(-1, 'days')  >= current 
                      }}/>
                  </Form.Item> 
                    </div>
                 </div>


                  <div className='columns'>
                  <div className='column is-flex is-justify-content-end'>

                    <Form.Item
                      label="RoomId"
                      name={['roomId']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing RoomId  ',
                        },
                      ]}
                    >
                          <Select className='select-box' options={roomOptions} onChange={handleChange} />

                    </Form.Item>
                    </div>
                    <div className='column is-flex is-justify-content-end'>
                    <Form.Item
                      label="Class Name"
                      name={['className']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing className',
                        },
                      ]}
                    >
                      <Input style={{width: "13rem"}}/>
                    </Form.Item>
                    </div>
                  </div>


                  <div className='columns pt-4'>
                  <div className='column is-flex is-justify-content-end'>
                    
                        <Form.Item
                          label="AccountId1"
                          name={['accountId1']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (array.filter(item => item == value).length > 1) {
                                  return Promise.reject("Không được trùng");
                                } else return Promise.resolve()
                              }
                            })
                          ]}
                          >
                            <AutoComplete
                              options={options}
                              style={{
                                width: 200,
                              }}
                              onSearch={onAccountSearch}
                              onSelect={(value) => onSelect(value, 1)}
                              onChange={handleChange}
                              placeholder="input here"
                            />
                          {/* <Select className='select-box' options={accounts} onChange={handleChange} /> */}
                        </Form.Item>
                    </div>
                    <div className='column is-flex is-justify-content-end'>
                        <Form.Item
                        label="AccountId2"
                        name={['accountId2']}
                        rules={[
                          {
                              required: true,
                              message: 'Missing accountId2',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (array.filter(item => item == value).length > 1) {
                                  return Promise.reject("Không được trùng");
                                } else return Promise.resolve()
                              }
                            })
                          ]}
                          >
                            <AutoComplete
                              options={options}
                              style={{
                                width: 200,
                              }}
                              onSearch={onAccountSearch}
                              onSelect={(value) => onSelect(value, 2)}
                              onChange={handleChange}
                              placeholder="input here"
                            />
                          {/* <Select className='select-box' options={accounts} onChange={handleChange} /> */}
                        </Form.Item>
                    </div>
                 </div>
                  
                  <div className=''>
                    <Form.Item
                        label="Reason"
                        name={['reason']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing reason',
                          },
                        ]}
                        >
                        <Input />
                      </Form.Item>

                      <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                      >
                    </Form.Item>
                    </div>
              </div>
              </div>
          </>
      <Form.Item className='button-submit mx-5'>
        <Button type="primary" htmlType="submit" style={{width: "100%"}} >
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  );
};
export default ModalSlotContainer;