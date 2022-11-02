import React, { useState, useEffect } from 'react';
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import { CardCustom, TableCustom } from '../../helper/styled_component'
import { apiClient } from '../../request-api/api_client';
import { stateConfig } from './state/config';

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';

import { openNotificationWithIcon } from '../../request/notification';
// import ModalFormDetail from './com/detail_modal';
// import FilterForm from './com/filter_modal';
// import ColumnForm from './com/column_modal';

const AdminScreen = () => {
    const [selectedRow, setSelectRow] = useState([]);
    const [dataTable, setDataTable] = useState([])
    const [url, setUrl] = useState('')
    const [total , setTotal] = useState(10)
    const [page , setPage] = useState({
        current : 1,
        number_of_page : 10
    })
    // modal
    const [showFilter, setShowFilter] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showColumn, setShowColumn] = useState(false);
    const _handleChangePage = (page, number_of_page) => {
        // requestTable(dispatchTable, filter, { page, number_of_page })
        console.log(page, number_of_page);
        setPage({
            current : page,
            number_of_page : number_of_page
        })
    };
    const _requestDataTable = async () => {
        const start = page.current == 1 ? 0 : page.current*page.number_of_page - page.number_of_page
        const end = page.current*page.number_of_page
        const { data } = await apiClient.get(`/customer?start=${start}&end=${end}`)
        const convertData = data.customer.data.map(item => {
            return {
                key: item._id,
                ...item
            }
        })
        setTotal(data.customer.total)
        setDataTable(convertData)
    }
    const _handleDel = () => {
        const isBool = window.confirm("Bạn có muốn xoá không")
        if (isBool) {
            selectedRow.map(async (item) => {
                try {
                    const { data } = await apiClient.delete(`/customer/${item}`)
                    openNotificationWithIcon("success", "Xoá thành công");
                } catch (error) {
                    openNotificationWithIcon("error",error.message)
                }
            })
        }
        setTimeout(() => {
            _handleReset()
        } ,1000)
    }


    const _handleAddNew = async (value) => {
        const body = {}
        try {
            const { data } = await apiClient.post('/customer', body)
            openNotificationWithIcon("success","Thêm thanh công")
            setUrl(data._id)
        } catch (error) {
            openNotificationWithIcon("error","Thêm thất bại")

        }

    }

    const _handleUpdate = async(value) => {
        const body = {
        }
        try {
            const { data } = await apiClient.patch(`/customer/${showDetail.data.id}`, body)
            openNotificationWithIcon("success","Sửa thanh công")
            setUrl(data._id)
        } catch (error) {
            openNotificationWithIcon("error","Sửa thất bại")
        }
        
    }
    
    const _handleReset = () => {
        _requestDataTable()
    }
    useEffect(() => {
        _requestDataTable()
    }, [page])
    return (
        <div style={{}}>
            <CardCustom
                title="Bảng"
                extra={<Extra
                    showDel={selectedRow && selectedRow[0]}
                    listColumn={[]}

                    _onReload={_handleReset}
                    _handleDel={selectedRow.length > 0 ? _handleDel : () => { }}
                    _onClickAdd={() => setShowAddNew(true)}
                // _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    // columns={configState.listColumn}
                    columns={[
                        {
                            title: 'Id',
                            dataIndex: '_id',
                            key: '_id',
                        },
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            key: 'name',
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
                            setUrl(r._id)
                            setShowDetail({
                                data: {
                                    name: r.name || '',
                                    titleContact : r.titleContact || '',
                                    imageAvatar : r.imageAvatar || '',
                                    workPhone: r.workPhone || '',
                                    email: r.email || '',
                                    website: r.website || '',
                                    workAddressName: r.workAddress?.workAddressName || '',
                                    workAddressLink: r.workAddress?.workAddressLink || '',
                                    zaloName: r.zalo?.zaloName || '',
                                    zaloLink: r.zalo?.zaloLink || '',
                                    facebookName: r.facebook?.facebookName || '',
                                    facebookLink: r.facebook?.facebookLink || '',
                                    tiktokName: r.tiktok?.tiktokName || '',
                                    tiktokLink: r.tiktok?.tiktokLink || '',

                                    instagramName: r.instagram?.instagramName || '',
                                    instagramLink: r.instagram?.instagramLink || '',
                                    telegramName: r.telegram?.telegramName || '',
                                    telegramLink: r.telegram?.telegramLink || '',
                                    skypeName: r.skype?.skypeName || '',
                                    skypeLink: r.skype?.skypeLink || '',
                                    viberName: r.viber?.viberName || '',
                                    viberLink: r.viber?.viberLink || '',
                                    twitterName: r.twitter?.twitterName || '',
                                    twitterLink: r.twitter?.twitterLink || '',
                                    whatsAppName: r.whatsApp?.whatsAppName || '',
                                    whatsAppLink: r.whatsApp?.whatsAppLink || '',
                                    wechatName: r.wechat?.wechatName || '',
                                    wechatLink: r.wechat?.wechatLink || '',
                                    linkedinName: r.linkedin?.linkedinName || '',
                                    linkedinLink: r.linkedin?.linkedinLink || '',

                                    youtubeName: r.youtube?.youtubeName || '',
                                    youtubeLink: r.youtube?.youtubeLink || '',
                                    bankName: r.bank?.bankName || '',
                                    bankNumber: r.bank?.bankNumber || '',
                                    id : r._id
                                }, type: "EDIT"
                            })
                            // r.dates.split(",")
                        }
                    })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25]}
                    style={{ marginTop: 20, float: 'right',marginBottom : 30 }}
                    current={page.current}
                    pageSize={Number(page.number_of_page)}
                    total={total}
                    onChange={_handleChangePage}
                />
            </CardCustom>
            {/* modal */}
            <AddNewForm
                visible={showAddNew} jsonFormInput={stateConfig.formAdd}
                _onClose={() => {
                    setShowAddNew(false)
                    setUrl('')
                    _requestDataTable()
                }}
                _onSubmit={_handleAddNew}
                url={url}
            />
            <ModalFormDetail
                visible={showDetail} jsonFormInput={stateConfig.formAdd}
                _onClose={() => {
                    setShowDetail(false)
                    setUrl('')
                    _requestDataTable()
                }}
                _onSubmit={_handleUpdate}
                url={url}
            />
        </div>

    );
};

const Extra = ({
    showDel = true,

    _handleDel = () => { },
    _onClickAdd = () => { },
    _onFilter = () => { },
    _onReload = () => { },
    // _onClickColumnShow = () => { },
}) => {

    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {!showDel ? null : <Button onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >Xoá item đã chọn</Button>}
                    <Button onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >Làm mới</Button>
                    <Button onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Thêm</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminScreen;