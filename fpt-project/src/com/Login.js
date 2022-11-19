import React, { useEffect } from 'react';
import './common.css';
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { Select } from 'antd';
import { apiClient } from '../request-api/api_client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [listCampus, setListCampus] = React.useState([])
    const [campus , setCampus] = React.useState(null)
    
    const navigation = useNavigate()
    const _requestData = async () => {
        const {data} = await apiClient.get('/api/campus-dropdown-list')
        const convertData = data.map((i , idx) => {
            return {
                value : i.value,
                label : i.name
            }
        })
        setListCampus(convertData)
    }
    const handleLogin =async (ggApi) => {
        console.log('gg', ggApi);
        if(campus){
            const body = {
                token : ggApi.tokenId,
                campusId : campus
            }
            const {data} = await apiClient.post('/auth/google' , body)
            if(data.accessToken){
                console.log('data' ,data);
                
                localStorage.setItem("access_token" , data.accessToken)
                localStorage.setItem("campusId", data.campusId)
                localStorage.setItem("userId", data.userId)
                localStorage.setItem("userName", data.userName)
                navigation('/admin')
            }
            
        }
    }
    const onChange = (value) => {  
        setCampus(value)
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const handleFailLogin = (err) => {
        console.log(err);
    }
    useEffect(() => {
        _requestData()
    }, [])
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_API_ID,
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);
    return (
        <div className="wrap-login">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <img src='https://tuyendung.fpt.com.vn/public/img/logo-ft.png' width='280' />
                </div>
                <div className='box-login'>
                    <div style={{ color: '#252525', fontSize: 32, fontWeight: 600 }}>Login</div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' ,alignItems : 'center'}}>
                        <div>
                            <Select 
                                size = 'large'
                                showSearch
                                placeholder="Select a campus"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={listCampus}
                            />
                        </div>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_API_ID}
                            buttonText="Sign in with @fpt.edu.vn"
                            onSuccess={handleLogin}
                            onFailure={handleFailLogin}
                            cookiePolicy={'single_host_origin'}
                        >
                        </GoogleLogin>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;