
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
import { openNotificationWithIcon } from "../../../../request/notification";
import axios from "axios";

// import { ACT_TYPE } from "../const";
// import * as services from '../services';
// import { openNotificationWithIcon } from "../helper/notification_antd";
// import { handleErr } from "../helper/handle_err_request";

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit = () => { },
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  const [img, setImg] = React.useState(null)
  // 
  const [form] = Form.useForm();
  // value
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
  const dataInit = useMemo(() => get(visible, 'data', {}), [visible]);
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle
  const onFinish = (val) => {
    try {
      if (val.email) {
        if (val.email.split('@')[1] != "fpt.edu.vn") {
          form.setFields([
            {
              name: 'email',
              required : true,
              errors: ['Vui lòng nhập email có đuôi là @fpt.edu.vn']
            }
          ])
        }
        else {
          setLoading(true);
          _onSubmit(val)
          _onClose()
          setLoading(false);
        }
      
      }
      else{
        form.setFields([
          {
            name: 'email',
            errors: ['Vui lòng nhập email']
          }
        ])
      }
      // _onClose()
    } catch (err) {
      setLoading(false);
    }
  };

  const handleChangeForm = (value, allValue) => {
    if (allValue.email) {
      if (value.email.split('@')[1] != "fpt.edu.vn") {
        form.setFields([
          {
            name: 'email',
            required : true,
            errors: ['Vui lòng nhập email có đuôi là @fpt.edu.vn']
          }
        ])
      }
      else {
        form.setFields([
          {
            name: 'email',
            errors: false
          }
        ])
      }
    }
  }

  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={650}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit} onValuesChange={handleChangeForm}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm jsonFrom={jsonFormInput} type={type} form={form} />
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', }}>
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