import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import AssessmentPlanDetail from './AssessmentPlanDetail';

const AssessmentPlan = () => {
    const location = useLocation()
    const onChange = (key) => {
        console.log(key);
      };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 500 , marginBottom : 32 }}>Thông tin nhận :</div>
            <Tabs
                onChange={onChange}
                type="card"
                size = 'large'
                items={new Array(3).fill(null).map((_, i) => {
                    const id = String(i + 1);
                    return {
                        label: `Đánh giá ${id}`,
                        key: id,
                        children: <AssessmentPlanDetail id={id}/>,
                    };
                })}
            />
        </div>
    );
};

export default AssessmentPlan;