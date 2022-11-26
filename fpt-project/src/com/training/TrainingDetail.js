import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../request-api/api_client';

const TrainingDetail = (props) => {

  const {record} = props;
  const [listData, setListData] = useState();
  var planId = record ? record.id : '';
  console.log("plannnnnnnnId: ", record);

  const _requestData = async () => {
    const {data} = await apiClient.get(`/api/list-observation-slot-plan?planId=${planId}`)
    data.items = data.items.map((item, idx) => {
      var slotTime = new Date(`${item.slotTime}`);

        item.slotTime =
        ((slotTime.getMonth() > 8) ? (slotTime.getMonth() + 1) : ('0' + (slotTime.getMonth() + 1))) + '/' + ((slotTime.getDate() > 9) ? slotTime.getDate() : ('0' + slotTime.getDate())) + '/' + slotTime.getFullYear();
        return item;
    })
    setListData(data.items);
  }
  useEffect(() => {
    _requestData();
  }, [planId])
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'userName',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'slotTime',
      dataIndex: 'slotTime',
      key: 'slotTime',
    },
    {
      title: 'slot',
      dataIndex: 'slot',
      key: 'slot',
    },
    {
      title: 'roomName',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'subjectName',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'className',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'headTraining',
      dataIndex: 'headTraining',
      key: 'headTraining',
    },
    {
      title: 'lecture1',
      dataIndex: 'lecture1',
      key: 'lecture1',
    },
    {
      title: 'lecture2',
      dataIndex: 'lecture2',
      key: 'lecture2',
    },
   
  ];
  return (
    <div>
      {listData?.length > 0 && <Table columns={columns} dataSource={listData} />}
    </div>
  );
};

export default TrainingDetail;