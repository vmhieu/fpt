import { Button, Form, Input, Table, InputNumber, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';
import '../../style/lecture.css'
import Header from '../Header';
import { openNotificationWithIcon } from '../../request/notification';

const LectureDetailContainer = (props) => {
  const { data ,onCancel} = props;
  const [form] = Form.useForm();
  const campusId = localStorage.getItem('campusId');
  const userId = localStorage.getItem('userId');
  const [listData, setListData] = useState();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState({ "observationSlotId": data.id, "accountId": parseInt(userId) });
  const [observation, setObservation] = useState([]);

  const { confirm } = Modal;

  const _requestData = async () => {
    const { data } = await apiClient.get(`/api/training/list-criteria-campus?id=${campusId}`)
    console.log("data", data);

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
        <Input type="number" max={4} min={1} onChange={(e) => onPointChange(record, e, index)} />
    },
  ]


  const onPointChange = (values, e, index) => {
    const record = { "code": values.criteriaCode, "name": values.criteriaName, "point": parseInt(e.target.value) }
    var data = [...observation];
    data[index] = record;
    setObservation(data);
  }

  console.log("array: ", observation);
  const handleSubmit = () => {
    console.log("valuess:", values);
  }

  function showConfirm(fieldValues) {
    confirm({
      title: 'Bạn đã chắc chắn nộp chưa?',
      content:
        'Khi nhấp vào nút OK, hộp thoại này sẽ đóng sau 1 giây',
      async onOk() {
        try {
          const body = { ...fieldValues, ...values, "observationDetailRequests": observation };
          const { data } = await apiClient.post(`/api/lecture/create-observation-review`, body)
          if (data.status == '200') {
            openNotificationWithIcon("success","Thêm thanh công")
            setIndex(index + 1)
            onCancel()
            form.resetFields();
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
      <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
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
            <Input placeholder='Tên bài giảng' />

          </Form.Item>

          {listData?.length > 0 && <Table key={index} columns={columns} dataSource={listData} pagination={false} />}
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
            <TextArea rows={4} className="text-area-antd" />
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

    </div>
  );
};

export default LectureDetailContainer;