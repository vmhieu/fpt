import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';

const Header = () => {
    const profileObj = JSON.parse(localStorage.getItem("profileObj"));
    const navigation = useNavigate()
    const {pathname} = useLocation();

    return (
        <div style={{ height: 60, background: '#0a8cf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', width: '90', height: "80%" }}>
                <img style={{ marginLeft: 20, marginRight: 20 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/640px-FPT_logo_2010.svg.png" height="40" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: 24, fontWeight: 500 }}>
                {(pathname == '/plan' || pathname == '/head-plan') && <div onClick={() => navigation('/lecture')} style={{marginRight : 20 , width : 35 , height : 35 , display : 'flex' , justifyContent : 'center' , alignItems : 'center' , borderRadius : '50%' , backgroundColor : 'greenyellow' , cursor : 'pointer'}}>
                    <MultipleStopIcon />
                </div>}
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
    );
};

export default Header;