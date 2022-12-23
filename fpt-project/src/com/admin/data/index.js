import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Segmented, Button, Tabs, Table } from 'antd';
import Upload from 'antd/lib/upload/Upload';
import React, { useState, useCallback, useEffect } from 'react';
import { apiClient } from "../../../request-api/api_client";
import { openNotificationWithIcon } from "../../../request/notification";

const options = [
    {
        label: 'Room',
        value: 'room',
    },
    {
        label: 'Semester',
        value: 'semester',
    },
    {
        label: 'Subject',
        value: 'subject',
    },
    {
        label: 'Slot',
        value: 'slot',
    },
]
const Data = () => {
    const [dataValue, setDataValue] = useState('room');
    const [fileUpload, setFileUpload] = useState();
    const [listCampus, setListCampus] = useState([])

    const _requestDataCampus = async () => {
        const { data } = await apiClient.get('/api/campus-dropdown-list')
        const convertData = data.map((i, idx) => {
            return {
                value: i.value,
                label: i.name
            }
        })
        setListCampus(convertData)
    }

    const _handleSelectFile = useCallback(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        setFileUpload({ formData, name: file.name });

        return false;
    }, []);
    console.log(fileUpload);

    useEffect(() => {
        if (fileUpload) {
            _handleUploadFile(fileUpload.formData)
            setFileUpload(null);
        }
    }, fileUpload)
    const _handleUploadFile = (file) => {
        apiClient.post(`/api/admin/upload-${dataValue}`, file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log("-----", res);
                openNotificationWithIcon('success', `Tải dữ liệu ${dataValue} lên thành công`);

            })

            .catch(error => {

                // Error 😨
                if (error.response) {
                    console.log('error.response.data', error.response.data);
                    openNotificationWithIcon('error', 'Tải dữ liệu lên thất bại');
                }
            }
            )
            .catch((err) => {

            });

    }
    const handleChange = (value) => {
        setDataValue(value)
    }

    useEffect(() => {
        _requestDataCampus()
    }, [])
    return (
        <div style={{ padding: '0px 30px' }}>
            <div style={{ display: 'flex' }}>
                <Upload className="ro-custom" fileList={[]} beforeUpload={file => {
                    _handleSelectFile(file); return false;
                }}>
                    <Button
                        type="text" icon={<UploadOutlined />}>Import</Button>
                </Upload>
                <Button
                    className="ro-custom"
                    border={false}
                    type="text"
                    onClick={() => {
                        // BASE_URL.DOWNLOAD
                        const link = document.createElement('a');
                        link.href = `http://localhost:8081/api/admin/download-data`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }} icon={<DownloadOutlined />} >
                    Export
                    </Button>
            </div>
            <Segmented style={{ marginTop: 20, marginBottom: 30 }} options={options} size='large' onChange={handleChange} />
            <div>
                <Tabs
                    tabPosition='left'
                    size='large'
                    // items={new Array(3).fill(null).map((_, i) => {
                    //     const id = String(i + 1);
                    //     return {
                    //         label: `Tab ${id}`,
                    //         key: id,
                    //         children: `Content of Tab ${id}`,
                    //     };
                    // })}
                    items={listCampus.map(i => {
                        return {
                            label: i.label,
                            key: i.value,
                            children: <TableOption keyCampus={i.value} type={dataValue} />
                        }
                    })}
                />
            </div>
        </div>
    );
};


const TableOption = ({ keyCampus, dataValue }) => {
    const [dataTable, setDataTable] = useState([])
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: dataValue,
            dataIndex: 'name',
            key: 'name'
        }
    ]
    const _requestDataTable = async () => {
        switch (dataValue) {
            case 'room':
                const { data } = await apiClient.get(`/api/room-dropdown-list?id=${keyCampus}`)
                const convertData = data.map((i, idx) => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                })
                setDataTable(convertData)
                break;
            case 'semester':
                const { data } = await apiClient.get(` /api/subject-dropdown-list?id=${keyCampus}`)
                const convertData = data.map((i, idx) => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                })
                setDataTable(convertData)
                break;
            case 'subject':
                const { data } = await apiClient.get(`/api/slot-list`)
                const convertData = data.map((i, idx) => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                })
                setDataTable(convertData)
                break;
            case 'slot':
                const { data } = await apiClient.get(`/api/semester-list`)
                const convertData = data.map((i, idx) => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                })
                setDataTable(convertData)
                break;

        }
    }
    useEffect(() => {
        _requestDataTable()
    } ,[])
    return <Table dataSource={dataTable} columns={columns} pagination={false} />;
}

export default Data;