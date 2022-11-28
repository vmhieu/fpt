import React from 'react';
import { Table } from 'antd';

const AssessmentPlanDetail = (props) => {
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];
    return (
        <div>
            <div style={{ display: 'flex', fontSize: 20 }}>
                <div style={{ width: 300 }}>Bạn có tham gia không:</div>
                <div>Có</div>
            </div>
            <div style={{ display: 'flex', fontSize: 20 }}>
                <div style={{ width: 300 }}>Người đánh giá ứng viên:</div>
                <div>khanh-khanh123@gmail.com</div>
            </div>
            <div style={{ fontSize: 20, color: 'blue' }}>
                Bảng đánh gía chi tiết dạy giáo dục :
            </div>
            <div style={{width : '50%'}}>
                <Table dataSource={dataSource} columns={columns} pagination={false} />;
            </div>
        </div>
    );
};
export default AssessmentPlanDetail;