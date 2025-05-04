import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  sendZno,
  patchZno,
  deleteZno,
  getZnoById,
  getDirConfOfInf,
  getDirStSmet
} from '../../../../api/api';
import { znoFields } from './ZnoFields';
import { useAuthSync,  checkAuthRights } from '../../../useAuthSync';
import eventBus from '../../hooks/eventBus';


const useZnoForm = ({ isEditMode,isCopyMode = false, selectedZnoId, onClose }) => {
  useAuthSync();
  const auth = JSON.parse(localStorage.getItem('auth')) || {};
  const rights = Number(auth.rights);
  const userId = Number(auth.id);

  //Для удаления ЗНО
  const handleDelete = async () => {
      if (!await checkAuthRights()) {
        alert('Права изменились! Действие отменено.');
        window.location.reload();
        return;
      }

      try {
        if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
          return;
        }

        const success = await deleteZno(selectedZnoId);

        if (success) {
          eventBus.emit('refreshTable');
          onClose();
          alert('Заявка успешно удалена');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.message || 'Ошибка при удалении заявки');
      }
    };

  const initialFormState = znoFields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || (field.type === 'checkbox' ? false : '');
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [confOptions, setConfOptions] = useState([]);
  const [stSmetOptions, setStSmetOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStSmetDropdown, setShowStSmetDropdown] = useState(false);
  const [, setSelectedStSmet] = useState(null);
  const stSmetRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      if (isCopyMode && selectedZnoId) {
          const znoData = await getZnoById(selectedZnoId);
          console.log(znoData);
          setFormData(prev => ({
            ...znoData,
            id: '',
            id_zno: '',
            id_status: 0,
            id_user: userId,
            id_oko: rights === 2 ? userId : 0,
            create_data: dayjs().format('YYYY-MM-DD'),
            payment_date: null,
            id_payment_order: ""
          }));
          if (znoData.st_smet) {
          const stSmet = stSmetOptions.find(item => item.id === znoData.st_smet);
          if (stSmet) {
            setSelectedStSmet(stSmet);
            setSearchTerm(`${stSmet.st} - ${stSmet.description}`);
          }
        }
        }
      if (isEditMode && selectedZnoId) {
        const znoData = await getZnoById(selectedZnoId);
        setFormData(znoData);
        if (znoData.st_smet) {
          const stSmet = stSmetOptions.find(item => item.id === znoData.st_smet);
          if (stSmet) {
            setSelectedStSmet(stSmet);
            setSearchTerm(`${stSmet.st} - ${stSmet.description}`);
          }
        }
      } else {
        setFormData(prev => ({
          ...prev,
          id_status: rights === 3 ? 0 : prev.id_status,
          id_user: userId || 0,
          id_oko: prev.id_oko || (rights === 2 ? userId : 0),
          create_data: dayjs().format('YYYY-MM-DD')
        }));
      }
    };
    loadData();
  }, [isEditMode, selectedZnoId, stSmetOptions, isCopyMode, rights, setSelectedStSmet, userId]);

  useEffect(() => {
    getDirConfOfInf().then(setConfOptions).catch(console.error);
    getDirStSmet().then(setStSmetOptions).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (stSmetRef.current && !stSmetRef.current.contains(e.target)) {
        setShowStSmetDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  if (formData.date_payment_agreement) {
        const agreement = dayjs(formData.date_payment_agreement);
        const compareDate = formData.payment_date ? dayjs(formData.payment_date) : dayjs(formData.planned_payment_date);

        if (compareDate.isValid() && agreement.isValid()) {
          const diff = Math.abs(compareDate.diff(agreement, 'day'));
          if (compareDate.isBefore(agreement)) {
            setPaymentStatus(`Досрочно на ${diff} дн.`);
          } else if (compareDate.isAfter(agreement)) {
            setPaymentStatus(`Просрочка: ${diff} дн.`);
          } else {
            setPaymentStatus('В срок');
          }
        } else {
          setPaymentStatus('');
        }
      } else {
        setPaymentStatus('');
      }
    }, [formData.planned_payment_date, formData.date_payment_agreement, formData.payment_date]);


  const buildStSmetTree = (items) => {
    const itemMap = {};
    const roots = [];

    items.forEach(item => {
      itemMap[item.st] = { ...item, children: [] };
    });

    items.forEach(item => {
      const parts = item.st.split('.');
      if (parts.length === 1) {
        roots.push(itemMap[item.st]);
      } else {
        const parentKey = parts.slice(0, -1).join('.');
        if (itemMap[parentKey]) {
          itemMap[parentKey].children.push(itemMap[item.st]);
        }
      }
    });

    const sortTree = items => {
      return items.sort((a, b) =>
        a.st.localeCompare(b.st, undefined, { numeric: true })
      ).map(item => ({
        ...item,
        children: sortTree(item.children)
      }));
    };

    return sortTree(roots);
  };

  const filterStSmetTree = (tree, term) => {
    if (!term) return tree;
    const lower = term.toLowerCase();
    return tree.reduce((acc, item) => {
      const matches = item.st.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
      const children = filterStSmetTree(item.children, term);
      if (matches || children.length) {
        acc.push({ ...item, children });
      }
      return acc;
    }, []);
  };

  const renderStSmetTree = (items, level = 0) =>
    items.map(item => (
      <div key={item.id}>
        {item.is_group ? (
          <div className="st-smet-group-header" style={{ paddingLeft: `${12 + level * 12}px` }}>
            {item.st} - {item.description}
          </div>
        ) : (
          <div
            className="st-smet-item"
            style={{ paddingLeft: `${12 + level * 12}px` }}
            onClick={() => handleStSmetSelect(item)}
          >
            <span className="st-smet-number">{item.st}</span>
            <span className="st-smet-description">{item.description}</span>
          </div>
        )}
        {renderStSmetTree(item.children, level + 1)}
      </div>
    ));

  const handleStSmetSelect = item => {
    if (item.is_group) return;
    setFormData(prev => ({ ...prev, st_smet: item.id }));
    setSelectedStSmet(item);
    setSearchTerm(`${item.st} - ${item.description}`);
    setShowStSmetDropdown(false);
  };

  const handleStSmetSearch = e => {
    setSearchTerm(e.target.value);
    setShowStSmetDropdown(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'id_case') {
      setFormData(prev => ({ ...prev, id_case: value, is_mal_or_sred_bis: false }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const validateForm = () => {
    const required = ['st_smet', 'counterparty', 'confidentiality_of_information', 'id_case', 'date_payment_agreement', 'planned_payment_date', 'summ'];
    const errors = required.filter(f => !formData[f] && formData[f] !== 0).map(f => {
      const field = znoFields.find(z => z.name === f);
      return field?.label || f;
    });

    if (formData.id_case && (formData.id_case < 100000000001 || formData.id_case > 399999999999)) {
      errors.push("ИД случая должен быть между 100000000001 и 399999999999");
    }

    if (formData.summ && (formData.summ < 0)) {
      errors.push("Сумма должна быть больше 0");
    }

    if (formData.id_zno && (formData.id_zno < 300000000001 || formData.id_zno > 399999999999)) {
      errors.push("Номер ЗНО должен быть между 300000000001 и 399999999999");
    }

    return errors;
  };

  const prepareDataForApi = () => {
  const agreement = dayjs(formData.date_payment_agreement);
  const compareDate = formData.payment_date ? dayjs(formData.payment_date) : dayjs(formData.planned_payment_date);
  const isOverdue = compareDate.isValid() && agreement.isValid() && compareDate.isAfter(agreement);

  return {
    st_smet: Number(formData.st_smet) || 0,
    counterparty: formData.counterparty || "",
    is_mal_or_sred_bis: !!formData.is_mal_or_sred_bis,
    confidentiality_of_information: Number(formData.confidentiality_of_information) || 0,
    id_case: formData.id_case || "",
    date_payment_agreement: formData.date_payment_agreement || null,
    planned_payment_date: formData.planned_payment_date || null,
    is_overdue: isOverdue,
    summ: Number(formData.summ) || 0,
    str_act: formData.str_act || "",
    str_scf: formData.str_scf || "",
    str_bill: formData.str_bill || "",
    other_documents: formData.other_documents || "",
    comment: formData.comment || "",
    id_status: rights === 3 ? 0 : Number(formData.id_status) || 0,
    id_zno: formData.id_zno || "",
    payment_date: formData.payment_date || null,
    id_payment_order: formData.id_payment_order || "",
    id_user: isEditMode ? formData.id_user : userId || 0,
    create_data: formData.create_data || dayjs().format('YYYY-MM-DD'),
    id_oko: rights === 2 ? userId : formData.id_oko,
    author: isEditMode ? userId : 0,
    };
  };


  const handleSubmit = async () => {

   if (!await checkAuthRights()) {
      alert('Права изменились! Действие отменено.');
      window.location.reload();
      return;
    }
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Ошибка: заполните обязательные поля:\n${errors.join("\n")}`);
      return;
    }

    const payload = prepareDataForApi();
    try {

      if (isEditMode) {
        await patchZno(selectedZnoId, payload);
      } else {
        await sendZno(payload);

      }
      eventBus.emit('refreshTable'); // обновление таблицы
      onClose();
    } catch (e) {
      alert('Ошибка при сохранении');
      console.error(e);
    }
  };

  const stSmetTree = buildStSmetTree(stSmetOptions);
  const filteredStSmetTree = filterStSmetTree(stSmetTree, searchTerm);

  return {
    isEditMode,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    paymentStatus,
    handleStSmetSearch,
    handleStSmetSelect,
    searchTerm,
    showStSmetDropdown,
    setShowStSmetDropdown,
    filteredStSmetTree,
    renderStSmetTree,
    confOptions,
    stSmetRef,
    onClose,
    rights,
    handleDelete
  };
};

export default useZnoForm;
