import dayjs from 'dayjs';
import {ZNO_STATUSES} from '../../constants/znoStatuses'

export const znoFields = [
  {
    name: 'st_smet',  // поле для статьи сметы
    label: 'Статья сметы',  // метка для поля
    type: 'select',  // тип поля - select
    required: true,  // поле обязательное
    options: [],  // опции
    defaultValue: '',  // по умолчанию ничего не выбрано
  },
  {
    name: 'counterparty',
    label: 'Контрагент',
    type: 'text',
    required: true
  },
  {
    name: 'is_mal_or_sred_bis',
    label: 'Малый или средний бизнес',
    type: 'checkbox',
    warning: 'не установлен',
    required: true
  },
  {
    name: 'confidentiality_of_information',
    label: 'Конфиденциальность информации',
    type: 'select',
    required: true,
    options: [],
    defaultValue: ''
  },
  {
    name: 'id_case',
    label: 'ИД случая',
    type: 'number',
    required: true,
    min: 100000000001,
    max: 399999999999
  },
  {
    name: 'date_payment_agreement',
    label: 'Дата оплаты по договору',
    type: 'date',
    required: true
  },
  {
    name: 'planned_payment_date',
    label: 'Планируемая дата оплаты',
    type: 'date',
    required: true
  },
  { name: 'summ', label: 'Сумма', type: 'number', required: true, min: 0 },
  { name: 'str_act', label: '№ Акт/ТН/УПД', type: 'text' },
  { name: 'str_scf', label: '№ и дата сч/ф', type: 'text' },
  { name: 'str_bill', label: '№ и дата счета', type: 'text' },
  { name: 'other_documents', label: 'Прочий документ', type: 'text' },
  { name: 'comment', label: 'Комментарий', type: 'text' },
  {
    name: 'id_status',
    label: 'Статус',
    type: 'select',
    options: ZNO_STATUSES.map(opt => opt.value),
    required: true
  },
  {
    name: 'id_zno',
    label: '№ ЗНО',
    type: 'text'
  },
  { name: 'payment_date', label: 'Дата оплаты', type: 'date' },
  { name: 'id_payment_order', label: 'Номер платежного поручения', type: 'text' },
  {
    name: 'create_data',
    label: 'Дата время создания',
    type: 'date',
    defaultValue: dayjs().format('YYYY-MM-DD')
  }
];