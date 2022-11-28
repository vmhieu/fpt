import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import AssessmentPlanDetail from './AssessmentPlanDetail';
import { apiClient } from '../../request-api/api_client';

const AssessmentPlan = () => {
    const [listData, setListData] = useState([]);
    const location = useLocation()
    const id = window.location.pathname.split("/")[2];
    const onChange = (key) => {
        console.log(key);
    };
    const _requestData = async () => {
        const { data } = await apiClient.get(`/api/result-observation-slot?oSlotId=${id}`)
        setListData(data.items)
    }
    useEffect(() => {
        _requestData()
    }, [])
    return (
        <div style={{ padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 32 }}>Thông tin nhận :</div>
            <Tabs
                onChange={onChange}
                type="card"
                size='large'
                items={new Array(3).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    return {
                        label: `Đánh giá ${id}`,
                        key: id,
                        children: <AssessmentPlanDetail id={id} item={listData[i] || {}} />,
                    };
                })}
            />
        </div>
    );
};

export default AssessmentPlan;