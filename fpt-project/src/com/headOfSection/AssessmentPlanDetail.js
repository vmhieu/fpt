import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

const AssessmentPlanDetail = (props) => {
    console.log(props.item);
    const [dataSource , setDataSource] = useState([])
    const columns = [
        {
            title: 'Tên tiêu chí',
            dataIndex: 'name',
            key: 'name',
            render : (text, record) => {
                if(record.sumPoint){
                    return <p style={{color : 'green' , fontWeight : 500}}>{text}</p>
                }
                else
                {
                    return <p>{text}</p>
                }
            },
        },
        {
            title: 'Điểm',
            dataIndex: 'point',
            key: 'point',
        },
    ];
    useEffect(() => {
        if(props.item?.listOfObservationDetail && props.item.listOfObservationDetail.length > 0){
            const sumPoint = props.item.listOfObservationDetail.reduce((prv , cur) => {
                return prv + cur.point
            } , 0)            
            setDataSource([
                ...props.item.listOfObservationDetail,
                {
                    id : 'a',
                    name : "Tổng điểm",
                    point : sumPoint,
                    sumPoint : true
                }
            ])
        }
    } ,[])
    return (
        <div>
            <div style={{ display: 'flex', fontSize: 20 }}>
                <div style={{ width: 200 }}>Điểm tốt:</div>
    <div>{props.item?.advantage || ''}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 20 }}>
                <div style={{ width: 200 }}>Bình luận:</div>
    <div>{props.item?.comment || ''}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 20 }}>
                <div style={{ width: 200 }}>Điểm xấu:</div>
                <div>{props.item?.disadvantage || ''}</div>
            </div>
            <div style={{ fontSize: 20, color: 'blue' }}>
                Bảng đánh gía chi tiết dạy giáo dục :
            </div>
            <div style={{width : '50%'}}>
                <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>
        </div>
    );
};
export default AssessmentPlanDetail;