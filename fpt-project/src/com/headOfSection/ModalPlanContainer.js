import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {AutoComplete, Button, DatePicker, Form, Input, Select, Space } from 'antd';
import '../../style/plan.css';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Header from '../Header';
import { apiClient } from '../../request-api/api_client';
import { Autocomplete, TextField } from '@mui/material';
const { Option } = Select;
const semesters = [
  {
    label: 'Kì 1',
    value: 1,
  },
  {
    label: 'Kì 2',
    value: 2,
  },{
    label: 'Kì 3',
    value: 3,
  },
];

const accounts = [
  {
    label: '1 fake',
    value: 1,
  },
  {
    label: '2 fake',
    value: 2,
  },{
    label: '3 fake',
    value: 3,
  },
];

const ModalPlanContainer = () => {
  const [form] = Form.useForm();
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');


  const getDepartments = async (searchText) => {
    const {data} = await apiClient.get(`/api/list-department?id=${campusId}&name=${searchText}`)
    return data.items[0].value;
  }

  const getSubjects = async () => {
    const {data} = await apiClient.get(`/api/subject-dropdown-list?id=${campusId}&code=`)
    var subjects = data.items;
    subjects = subjects.map((item, idx) => {
      return {...item, label: item.name}
    })
    setSubjectOptions(subjects);
  }
  const getRooms = async () => {
    const {data} = await apiClient.get(`/api/room-dropdown-list?id=${campusId}&name=`)
    var rooms = data.items;
    rooms = rooms.map((item, idx) => {
      return {...item, label: item.name}
    })
    setRoomOptions(rooms);
  }
  useEffect(() => {
    getSubjects();
    getRooms();
  }, [])  
  const [departmentValue, setDepartmentValue] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  
  const onDepartmentSearch = async (searchText) => {
    const {data} = await apiClient.get(`/api/list-department?id=${campusId}&name=${searchText}`)
    const searchData = [];
    if (!searchText) {
      searchData = [];
    }
    if(data.items && data.items.length > 0){
      for(let i = 0; i < data.items.length; i++){
        searchData.push({value: data.items[i].name})
      }
    }
    setDepartmentOptions(
      !searchText ? [] : searchData,
    );
  };

  const onFinish = (fieldValues) => {
    var observationSlotsRequest = fieldValues.observationSlotsRequest;
    observationSlotsRequest = observationSlotsRequest.map((item) => {
      var date = new Date(item.slotTime._d),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      var dateResult = [date.getFullYear(), mnth, day].join("-");
      return {...item, headSubject: userId, slotTime: dateResult}
    })
    var values = {
      ...fieldValues,
      "observationSlotsRequest": observationSlotsRequest
    }
    var department = getDepartments(fieldValues.departmentId);
    department.then(function(result) {
      const finalValues = {
        ...values,
        "campusId": parseInt(campusId),
        "departmentId": result,
        "planStatus":null
      }
      postPlan(finalValues);
      console.log("valuesssssssssssss: ", finalValues);
    })
  };

  const postPlan = (values) => {
    apiClient.post(`/api/create-observation-plan`, values)
  }
  
  const handleChange = () => {
    form.setFieldsValue({
    });
  };
  return (
    <div>
    <div className='form-container'>
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <div className='form-util'>
        <Form.Item
          name="semesterId"
          label="Semester"
          rules={[
            {
              required: true,
              message: 'Missing semester',
            },
          ]}
        >
          <Select className='select-box' options={semesters} onChange={handleChange} />
        </Form.Item>
        <Form.Item
          name="departmentId"
          label="Department"
          rules={[
            {
              required: true,
              message: 'Missing department',
            },
          ]}
        >
          {/* <Select options={semesters} onChange={handleChange} /> */}
          
          <AutoComplete
            options={departmentOptions}
            value={departmentValue}
            style={{
              width: 200,
            }}
            onSearch={onDepartmentSearch}
            placeholder="Department"
          />
        </Form.Item>
      </div>
      <Form.List name="observationSlotsRequest">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div className='form-detail'>
              <Space key={field.key} align="start">
                <div className='form-slot'>
                  <div className='form-util'>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label="AccountId"
                          name={[field.name, 'accountId']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                          <Select className='select-box' options={accounts} onChange={handleChange} />
                        </Form.Item>
                      )}
                    </Form.Item>

                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                      >
                      {() => (
                        <Form.Item
                        {...field}
                        label="SubjectId"
                        // name="subjectId"
                        name={[field.name, 'subjectId']}
                        rules={[
                          {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                          <Select className='select-box' options={subjectOptions} onChange={handleChange} />
                          
                        </Form.Item>
                      )}
                    </Form.Item>
                 </div>

                  

                  <div className='form-util'>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label="SlotId"
                          name={[field.name, 'slotId']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                          <Select className='select-box' options={accounts} onChange={handleChange} />
                        </Form.Item>
                      )}
                    </Form.Item>

                    <Form.Item
                    {...field}
                    label="slotTime"
                    name={[field.name, 'slotTime']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing slotTime',
                      },
                    ]}
                  >
                    <DatePicker />
                  </Form.Item> 
                    
                 </div>


                  <div className='form-util'>
                    <Form.Item
                      {...field}
                      label="RoomId"
                      name={[field.name, 'roomId']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing RoomId  ',
                        },
                      ]}
                    >
                          <Select className='select-box' options={roomOptions} onChange={handleChange} />

                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Class Name"
                      name={[field.name, 'className']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing className',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>


                  <div className='form-util'>
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label="AccountId1"
                          name={[field.name, 'accountId1']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing sight',
                            },
                          ]}
                          >
                          <Select className='select-box' options={accounts} onChange={handleChange} />
                        </Form.Item>
                      )}
                    </Form.Item>

                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                      >
                      {() => (
                        <Form.Item
                        {...field}
                        label="AccountId2"
                        name={[field.name, 'accountId2']}
                        rules={[
                          {
                              required: true,
                              message: 'Missing accountId2',
                            },
                          ]}
                          >
                          <Select className='select-box' options={accounts} onChange={handleChange} />
                        </Form.Item>
                      )}
                    </Form.Item>
                 </div>
                  
                  <div className='form-util'>
                    <Form.Item
                        {...field}
                        label="Reason"
                        name={[field.name, 'reason']}
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
                      {() => (
                        <Form.Item
                        {...field}
                        label="headTraining"
                        name={[field.name, 'headTraining']}
                        rules={[
                          {
                              required: true,
                              message: 'Missing headTraining',
                            },
                          ]}
                          >
                          <Select className='select-box' options={accounts} onChange={handleChange} />
                        </Form.Item>
                      )}
                    </Form.Item>
                    </div>
              </div>


                  <div className='button-remove'>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </div>
                </Space>
              </div>
            ))}

            <Form.Item className='button-add'>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item className='button-submit'>
        <Button type="primary" htmlType="submit" style={{width: "100%"}}>
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  );
};
export default ModalPlanContainer;