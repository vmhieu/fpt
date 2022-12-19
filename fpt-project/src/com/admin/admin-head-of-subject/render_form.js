import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, TimePicker, Checkbox, AutoComplete } from 'antd';
import { apiClient } from '../../../request-api/api_client';
// import { apiClient } from 'helper/request/api_client';

const { Option } = Select;
export const RenderForm = ({ jsonFrom, _handleChange = () => { }, dataInit }) => {
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [departmentValue , setDepartmentValue] = useState('');
    const { RangePicker } = DatePicker;

    const _requestDataDepartment = async (searchText = '') => {
        const campusId = localStorage.getItem("campusId");
        const { data } = await apiClient.get(`/api/list-department?id=${campusId}&name=${searchText}`)
        const searchData = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                searchData.push({ value: data[i].name })
            }
        }
        setDepartmentOptions(
            data.map(item => {
                return {
                    value : item.name,
                    key : item.value
                }
            }),
        );
    }

    const onSelect = (e , op) =>{
        console.log(op.key)
        setDepartmentValue(op.key)
        
    }
    useEffect(() => {
        _requestDataDepartment()
    }, [])

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}> {
            jsonFrom.map((item, index) => {
                if (item.type == "department") {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '0', width: '45%' }}
                        >
                            <AutoComplete
                                options={departmentOptions}
                                // value={departmentValue}
                                onSelect={onSelect}
                                style={{
                                    width: 200,
                                }}
                                onSearch={_requestDataDepartment}
                                placeholder="Department"
                            />
                        </Form.Item>
                    )
                }
                if (item.type == "select") {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '0', width: '45%' }}
                        >
                            <Select
                                placeholder="Chon Campus"
                            >
                                {
                                    item.data.map(i => {
                                        return <Option key={i.value} value={i.value}>{i.label}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    )
                }
                return (
                    <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hidden ? { display: 'none' } : { margin: '0', width: '45%' }}
                    >
                        <Input disabled={item.disabled} />
                    </Form.Item>
                )
            })
        }
        </div>)

}
