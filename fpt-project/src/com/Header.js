import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const userName = localStorage.getItem("userName")
    const navigation = useNavigate()

  return (
    <div style={{ height: 60, background: '#0a8cf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , marginBottom : 40 }}>
        <div style={{ display: 'flex', width: '90', height: "80%" }}>
            <img style={{ marginLeft: 20, marginRight: 20 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/640px-FPT_logo_2010.svg.png" height="40" />
        </div>

        <div style={{ display: 'flex', color: 'black', fontSize: 24, fontWeight: 500 }}>
            <div>
                {userName}
            </div>
            <div style={{marginLeft: 20, marginRight: 20}}>
                <UserOutlined height='60px' />
            </div>
            <div onClick={() => {
                localStorage.clear()
                navigation('/login')
            }} style={{marginRight : 20 , cursor : 'pointer'}}>
                LogOut
            </div>
        </div>
    </div>
  );
};

export default Header;