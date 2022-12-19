import React, { useState, useEffect, useCallback } from 'react';
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List,Space
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import { CardCustom, TableCustom } from '../../../helper/styled_component'
import { apiClient } from '../../../request-api/api_client';
import { stateConfig } from './state/config';

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';

import { openNotificationWithIcon } from '../../../request/notification';
import { debounce } from '@mui/material';
const { Search } = Input;
// import ModalFormDetail from './com/detail_modal';
// import FilterForm from './com/filter_modal';
// import ColumnForm from './com/column_modal';

const AdminLecture = () => {
    const [selectedRow, setSelectRow] = useState([]);
    const [dataTable, setDataTable] = useState([])
    const [total, setTotal] = useState(10)
    const [listCampus, setListCampus] = React.useState([])
    const [formAdd, setFormAdd] = React.useState(
        [
            {
                name: 'userName',
                label: 'Tên',
                rules: [
                    {
                        required: true,
                        message: 'Missing name',
                    },
                ]
            },
            {
                name: 'email',
                label: "Email",
                // rules: [
                //     {
                //         required: true,
                //         message: 'Missing email',
                //     },
                // ]

            },
            {
                name: 'campusId',
                label: 'Campus',
                data: [],
                type: 'select'
            },
            {
                name: 'trainingPro',
                label: "Training Pro",
                type: 'checkbox'
            }
        ]
    )
    const [page, setPage] = useState({
        current: 1,
        number_of_page: 10
    })
    // modal
    const [showAddNew, setShowAddNew] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showColumn, setShowColumn] = useState(false);
    const _handleChangePage = (page, number_of_page) => {
        console.log(page, number_of_page);
        setPage({
            current: page,
            number_of_page: number_of_page
        })
    };
    const _requestData = async () => {
        const { data } = await apiClient.get('/api/campus-dropdown-list')
        const convertData = data.map((i, idx) => {
            return {
                value: i.value,
                label: i.name
            }
        })
        setListCampus(convertData)
        const convertDataFormAdd = formAdd.map(i => {
            if (i.type == "select") {
                return {
                    ...i,
                    data: convertData,
                }
            }
            else {
                return i
            }
        })
        setFormAdd(convertDataFormAdd)
    }
    const _requestDataTable = async (search="") => {

        const start = page.current == 1 ? 0 : page.current * page.number_of_page - page.number_of_page
        const end = page.current * page.number_of_page
        const dataRole3 = await apiClient.get(`/api/admin/list-account-role?roleId=3&email=${search}&start=${start}&end=${end}`)
        const dataRole5 = await apiClient.get(`/api/admin/list-account-role?roleId=5&email=${search}&start=${start}&end=${end}`)

        const convertData = [...dataRole3.data.items.map(item => {
            return {
                key: item.id,
                ...item
            }
        }),
        ...dataRole5.data.items.map(item => {
            return {
                key: item.id,
                trainingPro: true,
                ...item
            }
        })
        ]
        setDataTable(convertData)
    }
    const _handleDel = () => {
        const isBool = window.confirm("Bạn có muốn xoá không")
        if (isBool) {
            selectedRow.map(async (item) => {
                try {
                    const { data } = await apiClient.post(`/api/admin/delete-account?id=${item}`)
                    openNotificationWithIcon("success", "Xoá thành công");
                } catch (error) {
                    openNotificationWithIcon("error", error.message)
                }
            })
        }
        setTimeout(() => {
            _handleReset()
        }, 1000)
    }


    const _handleAddNew = async (value) => {
        console.log("value", value);

        const body = {
            userName: value.userName,
            email: value.email,
            campusId: value.campusId,
            roles: [
                {
                    id: value.trainingPro ? 5 : 3
                }
            ]
        }
        console.log("body", body);

        try {
            const { data } = await apiClient.post('/api/admin/new-account', body)
            openNotificationWithIcon("success", "Thêm thanh công")
        } catch (error) {
            openNotificationWithIcon("error", "Thêm thất bại")

        }

    }
    const _handleUpdate = async (value) => {
        const body = {
            id: showDetail.data.id,
            userName: value.userName,
            email: value.email,
            campusId: value.campusId,
            roles: [
                {
                    id: value.trainingPro ? 5 : 3
                }
            ]
        }
        try {
            const { data } = await apiClient.post(`/api/admin/edit-account`, body)
            console.log("data", data);
            openNotificationWithIcon("success", "Sửa thanh công")
        } catch (error) {
            openNotificationWithIcon("error", "Sửa thất bại")
        }

    }


    const debounceReqData = useCallback(debounce((nextValue) => _requestDataTable(nextValue), 1000), [])

    const _handleReset = () => {
        _requestDataTable()
    }
    useEffect(() => {
        _requestDataTable()
        _requestData()
    }, [page])

    const onChangeSearch = (e) => {
        debounceReqData(e);
    }
    
    return (
        <div style={{}}>
            <CardCustom
                title="Bảng trưởng ban đào tạo"
                extra={<Extra
                    showDel={selectedRow && selectedRow[0]}
                    listColumn={[]}

                    _onReload={_handleReset}
                    _handleDel={selectedRow.length > 0 ? _handleDel : () => { }}
                    _onClickAdd={() => setShowAddNew(true)}
                    _onChange={(e) => onChangeSearch(e)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={[
                        {
                            title: 'Id',
                            dataIndex: 'id',
                            key: 'id',
                        },
                        {
                            title: 'Name',
                            dataIndex: 'userName',
                            key: 'userName',
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                        },
                        {
                            title: 'CampusName',
                            dataIndex: 'campusName',
                            key: 'campusName',
                        },
                        {
                            title: 'TrainingPro',
                            dataIndex: 'trainingPro',
                            render: (_, record) => {
                                console.log(record.trainingPro);

                                return <Checkbox disabled checked={record.trainingPro}></Checkbox>
                            },
                        },
                    ]}
                    scroll={{ y: 'calc(100vh - 190px)' }} pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(selectedRowKeys, selectedRows);
                            setSelectRow(selectedRowKeys)
                        }
                    }}
                    onRow={(r) => ({
                        onClick: () => {
                            console.log('r', r);
                            setShowDetail({
                                data: {
                                    id: r.id,
                                    userName: r.userName,
                                    email: r.email,
                                    campusId: listCampus.find(i => i.label == r.campusName).value,
                                    trainingPro: r.trainingPro
                                }, type: "EDIT"
                            })
                            // r.dates.split(",")
                        }
                    })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25]}
                    style={{ marginTop: 20, float: 'right', marginBottom: 30 }}
                    current={page.current}
                    pageSize={Number(page.number_of_page)}
                    total={total}
                    onChange={_handleChangePage}
                />
            </CardCustom>
            {/* modal */}
            <AddNewForm
                formAdd={formAdd}
                setFormAdd={setFormAdd}
                visible={showAddNew} jsonFormInput={formAdd}
                _onClose={() => {
                    setShowAddNew(false)
                    setTimeout(() => {
                        _requestDataTable()
                    }, 1000)
                }}
                _onSubmit={_handleAddNew}
            />
            <ModalFormDetail
                visible={showDetail} jsonFormInput={formAdd}
                _onClose={() => {
                    setShowDetail(false)
                    setTimeout(() => {
                        _requestDataTable()
                    }, 1000)
                }}
                _onSubmit={_handleUpdate}
            />
        </div>

    );
};

const onSearch = (value) => console.log(value);

const Extra = ({
    showDel = true,

    _handleDel = () => { },
    _onClickAdd = () => { },
    _onFilter = () => { },
    _onReload = () => { },
    _onChange = () => {}
    // _onClickColumnShow = () => { },
}) => {
    const [fileUpload, setFileUpload] = useState();
    const _handleSelectFile = useCallback(async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        setFileUpload({ formData, type, name: file.name });

        return false;
    }, []);
    console.log(fileUpload);
    
    useEffect(() => {
        if (fileUpload && fileUpload.type) {
            if (fileUpload.type === 'new') {
                _handleUploadFile(fileUpload.formData)
                setFileUpload(null);
            }
            else {
                setFileUpload(null);
            }
        }
    }, fileUpload)
    const _handleUploadFile = (file) => {
        console.log("aaaaaa", file);
        apiClient.post('/api/admin/upload-campus', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log("-----", res);
                openNotificationWithIcon('success', 'Tải dữ liệu lên thành công');

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
    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Tìm kiếm tài khoản"
                            onSearch={onSearch}
                            onChange={(e) => _onChange(e.target.value)}
                            style={{
                                width: 200,
                            }}
                        />
                    </Space>
                    <Upload className="ro-custom" fileList={[]} beforeUpload={file => { 
                        console.log(file);
                        
                        _handleSelectFile(file, 'new'); return false; }}>
                        <Button
                            type="text" icon={<UploadOutlined />}>Import</Button>
                    </Upload>
                    {!showDel ? null : <Button onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >Xoá item đã chọn</Button>}
                    <Button onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >Làm mới</Button>
                    <Button onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminLecture;