import React from 'react';
import './common.css';

const Login = () => {
    return (
        <div className="wrap-login">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <img src='https://tuyendung.fpt.com.vn/public/img/logo-ft.png' width='280' />
                </div>
                <div className='box-login'>
                    <div style={{ color: '#252525', fontSize: 32, fontWeight: 600 }}>Login</div>
                        <div className='google-login' href='href="/vi/External/Challenge?scheme=Google&returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dmvc%26redirect_uri%3Dhttps%253A%252F%252Ffu.edunext.vn%252Fsignin-oidc%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520api1%26code_challenge%3DUG2VtVITLKCrUuqIKwQ0oJDZw7IjuK-nhP6C4v8Lpd0%26code_challenge_method%3DS256%26response_mode%3Dform_post%26nonce%3D638028999006367677.MTEzZTQ0MTItYWNjOS00ODRmLWE0OTktYmZkZGNlMjZjYmY2YzczYjY3YTYtNGMwZi00MTg3LWFhM2YtMTg4NmUyMjAxMDc5%26state%3DCfDJ8CHoe066BxVGr5LeQKWGnER9XdVgOZOS_zSsQnqOd3RKaLpHHieEYQVR6SoXrpf2SJVsEWR7OgMtWjdO4-sAOe2vPuN4HjE2LwPSRfimh7YYbZlMu8OYRnpQwRC93xmXHHp0kqWFWm7hYLxlxtyJlbX48kkZQjI6XgLlW3kRnBbTiT7485DbsRmWyOVSzBcbY5gzXwfPdYjMuoz9uHRRpBfYVFPWENlQNLsjqY5bvNpaAMw_K41aAQ7cxxACFN06DCa5hwOkuBpe-slvKv_KszfwYq6WkjO6Wft16DjUnJfQIXan4Ld04U51wgkKaMEFtqZv03_SZ4JcPqHJW5AmwjSaDo46CDaY6YnB8qITy7D3JBsQN_Y0N_jwbbLu17Fj5cKsJUW_LLNjWug4zVCB5V4CDzDpdh1omm_oASu2vU4aBZId9bkLQz3i6WB7YkKFhX8P67uo3M3PcxFpMLEKLn7TRMQLMOFGOKAFSGuYRqj4%26x-client-SKU%3DID_NETSTANDARD2_0%26x-client-ver%3D5.5.0.0"'>
                            <img src='https://theme.hstatic.net/200000118173/1000809265/14/icon-gg__login.png?v=236' width='18' />
                            <div style={{flex : 1 , }}>Sign in with @fpt.edu.vn</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;