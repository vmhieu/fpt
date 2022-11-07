
import React, { Component, useState, useEffect, useCallback, useMemo } from "react";
import { findIndex, get, isEmpty } from "lodash";
import {
  Table,
  Upload,
  Button,
  Modal, Space,
  Form, Drawer,
  Input,
  Select,
  DatePicker,
  InputNumber,
  TimePicker, Card,
} from "antd";

import {
  PlusOutlined, DeleteOutlined, CloseOutlined, ReloadOutlined
} from "@ant-design/icons";

import styled from "styled-components";

import { RenderForm } from "../render_form";
import axios from "axios";
import { openNotificationWithIcon } from "../../../../request/notification";

// import { ACT_TYPE } from "../const";
// import * as services from '../services';
// import { openNotificationWithIcon } from "../helper/notification_antd";
// import { handleErr } from "../helper/handle_err_request";

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { },
  url = ''
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  const [img, setImg] = React.useState(null)
  // 

  console.log('visible',visible);
  
  const [form] = Form.useForm();
  // value
  console.log(visible)
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
  const dataInit = useMemo(() => get(visible, 'data', {}), [visible]);
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle
  const onFinish = (val) => {
    try {
      setLoading(true);
      _onSubmit(val)
      _onClose()
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(visible.data?.imageAvatar){
      setImg(visible.data?.imageAvatar)
    }
  } ,[visible])
  useEffect(() => {
    return () => {
      console.log("aaaa");
      
    }
  } ,[])
  function guardarArchivo(e) {
    var file = e.target.files[0] //the file
    var reader = new FileReader() //this for convert to Base64 
    reader.readAsDataURL(e.target.files[0]) //start conversion...
    reader.onload = async function (e) { //.. once finished..
      var rawLog = reader.result.split(',')[1]; //extract only thee file data part
      var dataSend = { dataReq: { data: rawLog, name: file.name, type: file.type }, fname: "uploadFilesToGoogleDrive" }; //preapre info to send to API
      try {
        const { data } = await axios.post("https://script.google.com/macros/s/AKfycbyGk5Dr8rE_wMO43kCYJnoxIBLuSVqXsHheABi09h_gYTpgWB0aJ_MCmtmXVlV3rEmyGA/exec", JSON.stringify(dataSend))
        console.log('data' ,data.url.split('/')[5]);
        
        form.setFieldsValue({
          imageAvatar: data.url.split('/')[5]
        })
        setImg(data.url.split('/')[5])
      } catch (error) {
        openNotificationWithIcon('error', error)
      }
    }
  }
  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={650}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm jsonFrom={jsonFormInput} type={type} />
      </StyledForm>
    </Drawer>
  )
};

const TitleDetail = React.memo(({ _onReset, _onClose }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
      <div></div>
      <div>
        <ReloadOutlined onClick={_onReset} />
        <CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
      </div>
    </div>)
})

const HeaderForm = ({ loading, type, _onClose = () => { } }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee',  }}>
      <span style={{ fontSize: 18, fontWeight: '500' }}>{type === "EDIT" ? "Chỉnh sửa" : "Thêm mới"}</span>
      <div>
        <Button
          loading={loading}
          type="primary"
          style={{ float: "left", borderRadius: 5, marginLeft: 13, marginTop: 6 }}
          htmlType="submit"
        > Submit  </Button>
      </div>
    </div>
  )
}


const StyledForm = styled(Form)`
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
    background: red;
  }

  .ant-form-item {
    margin-bottom: 4px;
  }
`;


export default ModalForm;