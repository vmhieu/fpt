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
        localStorage.setItem("profileObj", JSON.stringify(ggApi.profileObj))
        if(campus){
            const body = {
                token : ggApi.tokenId,
                campusId : campus
            }
            const {data} = await apiClient.post('/auth/google' , body)
            if(data.accessToken){
                console.log('data' ,data);
                const role = data.setRole.map(i => i.id)
                console.log("role" , role);
                
                localStorage.setItem("access_token" , data.accessToken)
                localStorage.setItem("campusId", data.campusId)
                localStorage.setItem("userId", data.userId)
                localStorage.setItem("role", JSON.stringify(role))

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
                    <img src='https://img5.thuthuatphanmem.vn/uploads/2022/01/16/logo-fpt-fpt-polytechnic-tach-nen_043151201.png' width='280' />
                </div>
                <div className='box-login'>
                    <div style={{ color: '#252525', fontSize: 32, fontWeight: 600 }}>Login</div>
                        <div style={{margin: "20px 0"}}>
                            <Select 
                                size = 'large'
                                showSearch
                                placeholder="Choose campus"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={listCampus}
                                style={{width: "370px", alignItems : 'center'}}
                                className='choose-campus'
                            />
                        </div>
                        <div className='login-google'>
                            <div style={{marginTop: "5px", marginLeft: "15px"}}>
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK5q0FP74VV9wbfwP378_7kj7iDomHuKrxkXsxDdUT28V9dlVMNUe-EMzaLwaFhneeuZI&usqp=CAU' width='28' style={{alignItems : 'center'}}/>
                            </div>
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_API_ID}
                                buttonText="Sign in with @fpt.edu.vn"
                                onSuccess={handleLogin}
                                onFailure={handleFailLogin}
                                cookiePolicy={'single_host_origin'}
                                className='button-google'
                                icon={false}
                                style={{boxShadow: "none"}}
                                >
                            </GoogleLogin>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Login;