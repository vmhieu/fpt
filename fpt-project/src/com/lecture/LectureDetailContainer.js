import { Button, Form, Input, Table, InputNumber, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import '../../style/lecture.css'
import Header from '../Header';
import { openNotificationWithIcon } from '../../request/notification';
import FormItem from 'antd/es/form/FormItem';

const LectureDetailContainer = (props) => {
  const { record ,onCancel, requestData, open} = props;
  const [form] = Form.useForm();
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');
  const [listData, setListData] = useState();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState({ "observationSlotId": record.id, "accountId": parseInt(userId) });
  const [observation, setObservation] = useState([]);
  const [dataInput, setDataInput] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getDetailLecture();
  }, [open])
  const { confirm } = Modal;

  const _requestData = async () => {
    const  {data}  = await apiClient.get(`/api/training/list-criteria-campus?id=${campusId}`)
    setListData(data.items);
  }

  const getDetailLecture = async () => {
    const { data } = await apiClient.get(`/api/lecture/view-evaluation-observation-review?slotId=${record.id}&accountId=${userId}`)
    if(data.status == '200'){
      setDataInput(data.items)
      setLoading(true);
    } else{
      setDataInput({})
    }
  }

  useEffect(() => {
    _requestData();
    
  }, [])

  useEffect(() => {
    setDataInput({})
    getDetailLecture();
    setTimeout(() => {
      setLoading(true)
    }, 2000)
  }, [record.id])

 

  const onPointChange = (values, e, index) => {
    const record = { "code": values.criteriaCode, "name": values.criteriaName, "point": parseInt(e.target.value) }
    var data = [...observation];
    data[index] = record;
    setObservation(data);
  }

  function showConfirm(fieldValues) {
    console.log("11111111: ", fieldValues);
    confirm({
      title: 'Bạn đã chắc chắn nộp chưa?',
      content:
        'Khi nhấp vào nút OK, hộp thoại này sẽ đóng sau 1 giây',
      async onOk() {
        try {
          const observationDetailRequests = []
          if(!dataInput.listOfObservationDetail?.length > 0){
            listData.map((e) => (
              
              observationDetailRequests.push({
                code : "",
                name: e.criteriaName,
                point: parseInt(fieldValues[e.criteriaCode])
              })
            ))
          } else {
            dataInput.listOfObservationDetail.map((e) => (
              observationDetailRequests.push({
                code : "",
                name: e.name,
                point: parseInt(fieldValues[e.criteriaCode])
              })
            ))
          }
          const value = {
            accountId: parseInt(userId),
            advantage: fieldValues.advantage,
            comment: fieldValues.comment,
            disadvantage: fieldValues.disadvantage,
            lessonName: fieldValues.lessonName,
            observationSlotId: parseInt(record.id)
          }
          const body = {...value, observationDetailRequests}
          const { data } = await apiClient.post(`/api/lecture/create-observation-review`, body)
          if (data.status == '200') {
            openNotificationWithIcon("success","Thêm thanh công")
            setIndex(index + 1)
            onCancel()
            form.resetFields();
            _requestData();
            requestData()
          }
        } catch (e) {
          openNotificationWithIcon("error","Nộp thất bại")
        }
      },
      onCancel() { },
    });
  }

  const onFinish = async (fieldValues) => {
    showConfirm(fieldValues)
  };

  return (
    <div>
      {loading && 
      <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" initialValues={Object.keys(dataInput).length !== 0 && dataInput.constructor === Object ? dataInput : {}}>
        {record && <div>
          <div className='columns'>
            <div className='column is-8'>
              <div className='columns'>
                <div className='column is-4'>
                  <p>Ngày dự giờ:</p>
                  <p>Địa điểm dự giờ:</p>
                </div>
                <div className='column'>
                  <p>{record.slotTime}</p>
                  <p>{record.roomName}</p>
                </div>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column'>
                  <p>Ca học:</p>
                  <p>Lớp học:</p>
                </div>
                <div className='column'>
                  <p>{record.slotName}</p>
                  <p>{record.className}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='columns'>
            <p className='column is-4'>Tên giảng viên được đánh giá:</p>
            <p className='column'>{record.lectureName}</p>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>Môn học:</div>
                <div className='column'>{record.subjectName}</div>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>Bộ môn:</div>
                <div className='column'>{record.departmentName}</div>
              </div>
            </div>
          </div>

          <Form.Item
            label="Tên bài giảng"
            name="lessonName"
            rules={[
              {
                required: true,
                message: 'Missing lecture name',
              },
            ]}
          >
            <Input placeholder='Tên bài giảng' />

          </Form.Item>

          <div className='columns px-1' style={{borderBottom: '1px solid black'}}>
            <div className='column has-text-weight-bold'>STT</div>
            <div className='column has-text-weight-bold'>Tên tiêu chí</div>
            <div className='column has-text-weight-bold'>Điểm</div>
          </div>
          {Object.keys(dataInput).length !== 0 && dataInput.constructor === Object ?
          <div>

            {dataInput.listOfObservationDetail?.length > 0 && dataInput.listOfObservationDetail.map((e, idx) => {
              console.log("aaaaaaaa: " +JSON.stringify(e));
              return(
                <div className='columns'>
                  <div className='column'>{idx + 1}</div>
                  <div className='column'>{e.name}</div>
                  <div className='column'>
                    {/* <Form.List> */}

                        <FormItem
                          name={e.criteriaCode}
                          rules={[
                            {
                              required: true,
                              message: 'Missing semester',
                            },
                          ]}>
                              <Input type="number" defaultValue={dataInput.listOfObservationDetail[idx].point} max={4} min={1} onChange={(e) => onPointChange(record, e, index)} />
                        </FormItem>
                    {/* </Form.List> */}
                  </div>
                </div>
              )
            })}
            </div>
            :
            <div>

              {listData?.length > 0 && listData.map((e, idx) => {
                console.log("eeeee: " + JSON.stringify(e));
                return(
                  <div className='columns'>
                  <div className='column'>{idx + 1}</div>
                  <div className='column'>{e.criteriaName}</div>
                  <div className='column'>
                      <FormItem
                        name={e.criteriaCode}
                        rules={[
                          {
                            required: true,
                            message: 'Missing semester',
                          },
                        ]}>
                        <Input type="number" max={4} min={1} onChange={(e) => onPointChange(record, e, index)} />
                      </FormItem>
                    {/* </Form.List> */}
                  </div>
                </div>
                  )
                })}
            </div> 
          }
          <h1 className='pt-4'>Ưu điểm</h1>
          <Form.Item
            name="advantage"
            rules={[
              {
                required: true,
                message: 'Missing lecture advantage',
              },
            ]}
          >
            <TextArea rows={4} className="text-area-antd"  />
          </Form.Item>
          <h1 className='pt-4'>Nhược điểm</h1>
          <Form.Item
            name="disadvantage"
            rules={[
              {
                required: true,
                message: 'Missing lecture disadvantage',
              },
            ]}
          >
            <TextArea rows={4} className="text-area-antd" />
          </Form.Item>
          <h1 className='pt-4'>Đánh giá chung</h1>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: 'Missing lecture comment',
              },
            ]}
          >
            <TextArea rows={4} className="text-area-antd" />
          </Form.Item>
          <div className='is-flex is-justify-content-end'>
            <Form.Item >
              <Button className='button mt-5 ml-6' htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>}
      </Form>
        }
    </div>
  );
};

export default LectureDetailContainer;