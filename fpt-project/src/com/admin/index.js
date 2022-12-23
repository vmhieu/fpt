import React, { useState, useEffect } from 'react';
import { Button, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminLecture from './admin-lecture';
import AdminHOS from './admin-head-of-subject';
import AdminTraining from './admin-training';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Data from './data';

const Admin = () => {
    const [adminIndex, setAdminIndex] = useState(1)
    const profileObj = JSON.parse(localStorage.getItem("profileObj"));
    const navigation = useNavigate()
    const objAdmin = {
        1: <AdminLecture />,
        2: <AdminHOS />,
        3: <AdminTraining />,
        4: <Data />
    }
    const handleClick = (idx) => {
        setAdminIndex(idx)
    }
    useEffect(() => {
        const role = localStorage.getItem('role');
        if(!role.includes(1)){
            navigation('/login');
        }
    } ,[])
    return (
        <div>
            <div style={{ height: 60, background: '#0a8cf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div style={{ display: 'flex', width: '90', height: "80%" }}>
                    <img style={{ marginLeft: 20, marginRight: 20 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/640px-FPT_logo_2010.svg.png" height="40" />
                    <div className='columns' style={{ color: "white" , fontSize : 20 , margin : 0 , height : '100%' , display : 'flex' , alignItems : 'center'}}>
                        <div className={adminIndex == 1 ? "position-header position-header-active" : "position-header"} onClick={() => handleClick(1)}>
                            Giảng viên
                        </div>
                        <div className={adminIndex == 2 ? "position-header position-header-active" : "position-header"} onClick={() => handleClick(2)}>
                            Chủ nhiệm bộ môn
                        </div>
                        <div className={adminIndex == 3 ? "position-header position-header-active" : "position-header"} onClick={() => handleClick(3)}>
                            Trưởng ban đào tạo
                        </div>
                        <div className={adminIndex == 4 ? "position-header position-header-active" : "position-header"} onClick={() => handleClick(4)}>
                            Data
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: 24, fontWeight: 500 }}>
                    <div>
                        {profileObj?.name}
                    </div>
                    <div className="img-cover" style={{ marginRight: 20, marginLeft: 30, position: 'relative' }}>
                        <img style={{ borderRadius: '50%' }} src={profileObj?.imageUrl} width="40px" />
                        <div className='tooltip-avatar'>
                            <div className="tooltip-avatar-item" style={{ fontSize: 16, padding: '4px 10px', display: 'flex', alignContent: 'center', flex: 1 }}>Xem thông tin</div>
                            <div onClick={() => {
                                localStorage.clear()
                                navigation('/login')
                            }} className="tooltip-avatar-item" style={{ fontSize: 16, padding: '4px 10px', display: 'flex', alignContent: 'center', flex: 1 }}>Logout</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {objAdmin[adminIndex]}
            </div>
            <Footer />
        </div>
    );
};

export default Admin;