import { Button, Form, Input, Table } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import '../../style/lecture.css'
import Header from '../Header';

const LectureDetailContainer = (props) => {
  const {data} = props;
  const [form] = Form.useForm();
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');
  const [listData, setListData] = useState();
  const [values, setValues] = useState({"observationSlotId": data.id, "accountId": parseInt(userId)});
  const [observation, setObservation] = useState([]);

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/training/list-criteria-campus?id=${campusId}`)
    setListData(data.items);
  }

  useEffect(() => {
    _requestData()
  }, [])
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã',
      dataIndex: 'criteriaCode',
      key: 'criteriaCode',
    },
    {
      title: 'Tên tiêu chí',
      dataIndex: 'criteriaName',
      key: 'criteriaName',
    },
    {
      title: 'Nhập điểm',
      render: (text, record, index) =>
          <Input type="number" max={4} min={1} onChange={(e) => onPointChange(record, e, index)}/>
    },
  ]
  

  const onPointChange = (values, e, index) => {
    const record = {"code": values.criteriaCode, "name": values.criteriaName, "point": parseInt(e.target.value)}
    var data = [...observation];
    data[index] = record;
    setObservation(data);
  }

  console.log("array: ", observation);
  const handleSubmit = () => {
    console.log("valuess:", values);
  }
  const onFinish = (fieldValues) => {
    const data = {...fieldValues, ...values, "observationDetailRequests": observation};
    console.log("dataaaaaaaa:", data);
    apiClient.post(`/api/lecture/create-observation-review`, data)
  };
  return (
    <div>
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <p className='has-text-centered has-text-weight-bold is-size-4'>Phiếu đánh giá chi tiết</p>
      {data && <div>
          <div className='columns'>
            <div className='column is-8'>
              <div className='columns'>
                <div className='column is-4'>
                  <p>Ngày dự giờ:</p>
                  <p>Địa điểm dự giờ:</p>
                </div>
                <div className='column'>
                  <p>{data.slotTime}</p>
                  <p>{data.roomName}</p>
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
                  <p>{data.slotName}</p>
                  <p>{data.className}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='columns'>
              <p className='column is-4'>Tên giảng viên được đánh giá:</p>
              <p className='column'>{data.lectureName}</p>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>Môn học:</div>
                <div className='column'>{data.subjectName}</div>
              </div>
            </div>
            <div className='column'>
            <div className='columns'>
                <div className='column is-3'>Bộ môn:</div>
                <div className='column'>{data.departmentName}</div>
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
              <Input placeholder='Tên bài giảng' style={{width: "400%"}}/>
            </Form.Item>

          {listData?.length > 0 && <Table columns={columns} dataSource={listData} pagination={false}/>}
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
            <TextArea rows={4} style={{width: "290%"}} className="text-area-antd"/>
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
            <TextArea rows={4} style={{width: "290%"}} className="text-area-antd"/>
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
            <TextArea rows={4} style={{width: "290%"}} className="text-area-antd"/>
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

    </div>
  );
};

export default LectureDetailContainer;