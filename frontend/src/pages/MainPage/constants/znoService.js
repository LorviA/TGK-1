import { getAllZno, getUserData, getConfInfDirById, getStSmetDirById } from '../../../api/api';
import { ZNO_STATUSES } from './znoStatuses';
import { ALL_FIELDS } from './fields';


// Форматирование даты в формате dd.mm.yyyy
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ru-RU');
  } catch {
    return '-';
  }
};

// Форматирование даты и времени
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')}`;
};

// Форматирование суммы с валютой
const formatSumm = (summ) => {
  return summ ? `${Number(summ).toLocaleString('ru-RU')} ₽` : '0 ₽';
};

// Получение имени пользователя по ID
const fetchNameById = async (id) => {
  if (!id || id === '0') return '';
  try {
    const userData = await getUserData(id);
    return userData.user_name || '-';
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return '?';
  }
};

// Получение статуса по ID
const getStatusLabel = (statusId) => {
  const status = ZNO_STATUSES.find(item => item.value === statusId);
  return status ? status.label : '-';
};

// Получение названия конфиденциальности по ID
const fetchConfidentialityName = async (id) => {
  if (!id || id === '0') return '-';
  try {
    const confidentialityData = await getConfInfDirById(id);
    return confidentialityData || '-';
  } catch (error) {
    console.error('Ошибка при получении конфиденциальности:', error);
    return '?';
  }
};

// Получение названия статьи сметы по ID
const fetchStSmetName = async (id) => {
  if (!id || id === '0') return '-';
  try {
    const stSmetData = await getStSmetDirById(id);
    return stSmetData?.st + " " + stSmetData.description || '-';
  } catch (error) {
    console.error('Ошибка при получении сметы:', error);
    return '?';
  }
};

// Преобразование строки даты в формате dd.mm.yyyy в объект Date
const parseDate = (dateStr) => {
  if (dateStr === '-' || !dateStr) return null;
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
};

// Фильтрация данных по диапазону дат
const filterDateRangeData = (data, field, dateFrom, dateTo) => {
  const fieldIndex = ALL_FIELDS.indexOf(field);
  if (fieldIndex === -1) return data;

  return data.filter(item => {
    const dateStr = item.values[fieldIndex];
    if (dateStr === '-' || !dateStr) return false;

    const date = parseDate(dateStr);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const isAfterFrom = !fromDate || date >= fromDate;
    const isBeforeTo = !toDate || date <= toDate;

    return isAfterFrom && isBeforeTo;
  });
};

// Фильтрация обычных данных
const filterData = (data, field, value) => {
  const fieldIndex = ALL_FIELDS.indexOf(field);
  if (fieldIndex === -1) return data;

  return data.filter(item => {
    const fieldValue = item.values[fieldIndex].toString().toLowerCase();
    return fieldValue.includes(value.toLowerCase());
  });
};

// Сортировка данных
const sortData = (data, field, direction) => {
  const fieldIndex = ALL_FIELDS.indexOf(field);
  if (fieldIndex === -1) return data;

  return [...data].sort((a, b) => {
    const aValue = a.values[fieldIndex];
    const bValue = b.values[fieldIndex];

    if (aValue === bValue) return 0;
    const compareResult = aValue > bValue ? 1 : -1;
    return direction === 'asc' ? compareResult : -compareResult;
  });
};

// Преобразование данных ZNO для таблицы
export const transformZnoItem = async (item) => {
  const userName = await fetchNameById(item.id_user);
  const okoName = await fetchNameById(item.id_oko);
  const ConfInfName = await fetchConfidentialityName(item.confidentiality_of_information);
  const StSmetName = await fetchStSmetName(item.st_smet);

  return {
    id: item.id,
    values: [
      item.id?.toString() || '-',
      StSmetName,
      item.counterparty || '-',
      item.is_mal_or_sred_bis ? 'Да' : 'Нет',
      ConfInfName,
      item.id_case || '-',
      formatDate(item.date_payment_agreement),
      formatDate(item.planned_payment_date),
      item.is_overdue ? 'Да' : 'Нет',
      formatSumm(item.summ),
      item.str_act || '-',
      item.str_scf || '-',
      item.str_bill || '-',
      item.other_documents || '-',
      item.comment || '-',
      getStatusLabel(item.id_status),
      item.id_zno || '-',
      formatDate(item.payment_date),
      item.id_payment_order || '-',
      userName,
      formatDateTime(item.create_data),
      okoName
    ],
    rawData: {
      date_payment_agreement: item.date_payment_agreement,
      planned_payment_date: item.planned_payment_date,
      payment_date: item.payment_date,
      create_data: item.create_data
    }
  };
};

// Основные API функции
export const fetchZnoData = async () => {
  try {
    const rawData = await getAllZno();
    const transformedData = await Promise.all(rawData.map(transformZnoItem));
    return transformedData;
  } catch (error) {
    console.error('Ошибка при загрузке данных ZNO:', error);
    throw error;
  }
};

export const fetchSortedZnoData = async (field, direction) => {
  try {
    const data = await fetchZnoData();
    return sortData(data, field, direction);
  } catch (error) {
    console.error('Ошибка при сортировке данных:', error);
    throw error;
  }
};

export const fetchFilteredZnoData = async (filterConfig) => {
  try {
    const data = await fetchZnoData();

    if (!filterConfig) return data;

    if (filterConfig.type === 'date') {
      return filterDateRangeData(
        data,
        filterConfig.field,
        filterConfig.value.from,
        filterConfig.value.to
      );
    } else {
      return filterData(data, filterConfig.field, filterConfig.value);
    }
  } catch (error) {
    console.error('Ошибка при фильтрации данных:', error);
    throw error;
  }
};