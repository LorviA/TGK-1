import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Spin, Input } from 'antd';
import {
  getArchivedStSmet,
  getArchivedConfInfo
} from '../../../../api/api';
import './ArchiveViewModal.css';

const ArchiveViewModal = ({
  visible,
  onClose,
  directoryType
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadArchiveData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (directoryType === 'st_smet') {
        response = await getArchivedStSmet();
        const formattedData = response.map(item => ({
          key: item.id,
          st: item.st,
          name: item.description,
          expiration_date: item.expiration_date
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      } else {
        response = await getArchivedConfInfo();
        const formattedData = response.map(item => ({
          key: item.id,
          name: item.name,
          expiration_date: item.expiration_date
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      }
    } catch (error) {
      console.error('Ошибка загрузки архивных данных:', error);
    } finally {
      setLoading(false);
    }
  }, [directoryType]);

  useEffect(() => {
    if (visible) {
      loadArchiveData();
    }
  }, [visible, directoryType, loadArchiveData]);

  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const columns = directoryType === 'st_smet'
    ? [
        { title: 'Статья', dataIndex: 'st', key: 'st', width: 100 },
        { title: 'Наименование', dataIndex: 'name', key: 'name' },
        { title: 'Дата архивирования', dataIndex: 'expiration_date', key: 'expiration_date', width: 150 }
      ]
    : [
        { title: 'Наименование', dataIndex: 'name', key: 'name' },
        { title: 'Дата архивирования', dataIndex: 'expiration_date', key: 'expiration_date', width: 150 }
      ];

  return (
    <Modal
      title={`Архивные записи: ${directoryType === 'st_smet' ? 'Статьи смет' : 'Конфиденциальная информация'}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      zIndex={1002}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Поиск по названию"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
          size="middle"
        />
      </Spin>
    </Modal>
  );
};

export default ArchiveViewModal;