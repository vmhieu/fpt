import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminLecture from './admin-lecture';
import AdminHOS from './admin-head-of-subject';
import AdminTraining from './admin-training';
import { useNavigate } from 'react-router-dom';



const Admin = () => {
    const [adminIndex , setAdminIndex] = useState(1)
    const userName = localStorage.getItem("userName")


    const objAdmin = {
        1 : <AdminLecture />,
        2 : <AdminHOS />,
        3 : <AdminTraining />
    }
    const handleClick = (idx) => {
        setAdminIndex(idx)
    }
    const navigation = useNavigate()
    return (
        <div>
            <div style={{ height: 60, background: '#0a8cf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , marginBottom : 40 }}>
                <div style={{ display: 'flex', width: '90', height: "80%" }}>
                    <img style={{ marginLeft: 20, marginRight: 20 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/640px-FPT_logo_2010.svg.png" height="40" />
                    <div className='columns' style={{color: "white"}}>
                        <p  style={{paddingTop: "20px", paddingLeft: "50px", width: "150px", cursor: "pointer", fontSize: "16px"}} onClick={() => handleClick(1)}>Giảng viên</p>
                        <div style={{borderRight: "1px solid white", height: "25px", marginTop: "22px", marginRight:"20px"}}></div>
                        <p  style={{paddingTop: "20px", width: "150px", paddingLeft: "-50px", cursor: "pointer", fontSize: "16px"}} onClick={() => handleClick(2)}>Chủ nhiệm bộ môn</p>
                        <div style={{borderRight: "1px solid white", height: "25px", marginTop: "22px", marginRight:"20px"}}></div>
                        <p  style={{paddingTop: "20px", width: "150px", cursor: "pointer", fontSize: "16px"}} onClick={() => handleClick(3)}>Trưởng ban đào tạo</p>
                    </div>
                </div>

                <div style={{ display: 'flex', color: 'black', fontSize: 24, fontWeight: 500 }}>
                    <div>
                        {userName}
                    </div>
                    <div style={{marginLeft: 20, marginRight: 20}}>
                        <UserOutlined height='60px' />
                    </div>
                    <div className="admin-header" onClick={() => {
                        localStorage.clear()
                        navigation('/login')
                    }} style={{marginRight : 20 , cursor : 'pointer'}}>
                        LogOut
                    </div>
                </div>
            </div>

            <div>
                {objAdmin[adminIndex]}
            </div>
        </div>
    );
};

export default Admin;