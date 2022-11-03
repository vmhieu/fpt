import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, TimePicker, Checkbox, AutoComplete } from 'antd';
// import { apiClient } from 'helper/request/api_client';


export const RenderForm = ({ jsonFrom, _handleChange = () => { } ,dataInit}) => {
    const { RangePicker } = DatePicker;
    return (
        <div style={{display : 'flex' , flexWrap : 'wrap' , justifyContent : 'space-between'}}> {
            jsonFrom.map((item, index) => {
                return (
                    <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hidden ? { display: 'none' } : { margin: '0' , width : '45%'}}
                    >
                        <Input disabled={item.disabled} />
                    </Form.Item>
                )
            })
        }
        </div>)

}
