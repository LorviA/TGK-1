import React from 'react';
import { ZNO_STATUSES } from '../../constants/znoStatuses';
import { znoFields } from './ZnoFields';

const ZnoForm = ({
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
}) => {

  const renderInput = (field, isReadonly = false) => {
    if (field.name === 'planned_payment_date') {
      return (
        <div className="date-with-overdue">
          <input
            type="date"
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
          />
          {paymentStatus && (
            <span className="overdue-badge">
              {paymentStatus}
            </span>
          )}
        </div>
      );
    }

    if (field.name === 'st_smet') {
      return (
        <div className="st-smet-combobox" ref={stSmetRef}>
          <input
            type="text"
            placeholder="Начните вводить номер или описание..."
            value={searchTerm}
            onChange={handleStSmetSearch}
            onFocus={() => setShowStSmetDropdown(true)}
            className="st-smet-input"
          />
          {showStSmetDropdown && (
            <div className="st-smet-dropdown">
              {filteredStSmetTree.length > 0 ? (
                renderStSmetTree(filteredStSmetTree)
              ) : (
                <div className="st-smet-no-results">Ничего не найдено</div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (field.name === 'confidentiality_of_information') {
      return (
        <select
          name="confidentiality_of_information"
          value={formData.confidentiality_of_information || ''}
          onChange={handleChange}
          disabled={isReadonly}
        >
          <option value="">-- выберите --</option>
          {confOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'select') {
      return (
        <select
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          disabled={isReadonly}
        >
          {field.name === 'id_status'
            ? ZNO_STATUSES.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : field.options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
        </select>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name={field.name}
            checked={!!formData[field.name]}
            onChange={handleChange}
          />
          {field.warning && !formData[field.name] && (
            <span className="zno-modal-warning">{field.warning}</span>
          )}
        </div>
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ''}
        onChange={handleChange}
        disabled={isReadonly}
      />
    );
  };

  const readonly = rights === 3;
  const auth = JSON.parse(localStorage.getItem('auth')) || {};
  const userId = Number(auth.id);
  return (
    <>
      {/*  № п/п + Статус + № ЗНО */}
      <div className="zno-modal-form-row zno-modal-grouped">
        <div style={{ flex: '1' }}>
          <label>№ п/п:</label>
          <input value={formData.id || 'Авто'} disabled />
        </div>
        <div style={{ flex: '1' }}>
          <label>Статус:</label>
          <select
            name="id_status"
            value={formData.id_status || ''}
            onChange={handleChange}
            disabled={readonly}
          >
            {ZNO_STATUSES.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1' }}>
          <label>№ ЗНО:</label>
          <input
            type="text"
            name="id_zno"
            value={formData.id_zno || ''}
            onChange={handleChange}
            disabled={readonly}
            className={readonly ? "disabled-zno-field" : ""}
          />
        </div>
      </div>

      {/* Статья сметы */}
      <div className="zno-modal-form-row">
        <label>Статья сметы*:</label>
        {renderInput(znoFields.find(f => f.name === 'st_smet'))}
      </div>

      {/* Контрагент */}
      <div className="zno-modal-form-row">
        <label>Контрагент*:</label>
        <input
          type="text"
          name="counterparty"
          value={formData.counterparty || ''}
          onChange={handleChange}
        />
      </div>

      {/* Конфиденциальность */}
      <div className="zno-modal-form-row">
        <label>Конфиденциальность информации*</label>
        {renderInput(znoFields.find(f => f.name === 'confidentiality_of_information'))}
      </div>

      {/* ИД случая + Малый/средний бизнес */}
        <div className="zno-modal-form-row zno-modal-grouped">
          <div style={{ flex: '2' }}>
            <label>ИД случая:</label>
            <input
              type="number"
              name="id_case"
              value={formData.id_case || ''}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: '2' }}>
            <label style={{ visibility: 'hidden' }}>Малый или средний бизнес:</label>
            <div
              className={`business-status-toggle ${formData.is_mal_or_sred_bis ? 'checked' : ''}`}
              onClick={() => handleChange({
                target: {
                  name: 'is_mal_or_sred_bis',
                  value: !formData.is_mal_or_sred_bis
                }
              })}
            >
              <span className="business-status-label">Малый или средний бизнес</span>
              <span className="business-status-text">
                {formData.is_mal_or_sred_bis ? 'Установлен' : 'Не установлен'}
              </span>
            </div>
          </div>
        </div>

      {/* Дата оплаты по договору + Планируемая дата */}
    <div className="zno-modal-form-row zno-modal-grouped">
      <div>
        <label>Дата оплаты по договору*:</label>
        <input
          type="date"
          name="date_payment_agreement"
          value={formData.date_payment_agreement || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Планируемая дата оплаты*:</label>
        <div className="date-with-overdue">
          <input
            type="date"
            name="planned_payment_date"
            value={formData.planned_payment_date || ''}
            onChange={handleChange}
          />

        </div>
      </div>
    </div>

      {/* Сумма */}
      <div className="zno-modal-form-row zno-modal-grouped">
      <div style={{ flex: '1' }}>
        <label>Сумма*:</label>
        <input
          type="number"
          name="summ"
          value={formData.summ || ''}
          onChange={handleChange}
          className="half-width-input"
        />
      </div>
      <div style={{ flex: '1', display: 'flex', alignItems: 'flex-end' }}>
        {paymentStatus && (
          <span className={`payment-status ${
            paymentStatus.includes('Просрочка') ? 'overdue' :
            paymentStatus.includes('Досрочно') ? 'early' : 'ontime'
          }`}>
            {paymentStatus}
          </span>
        )}
      </div>
    </div>


      {/* № Акт/ТН/УПД */}
      <div className="zno-modal-form-row">
        <label>№ Акт/ТН/УПД:</label>
        <input
          type="text"
          name="str_act"
          value={formData.str_act || ''}
          onChange={handleChange}
        />
      </div>

      {/* № и дата сч/ф */}
      <div className="zno-modal-form-row">
        <label>№ и дата сч/ф:</label>
        <input
          type="text"
          name="str_scf"
          value={formData.str_scf || ''}
          onChange={handleChange}
        />
      </div>

      {/* № и дата счета */}
      <div className="zno-modal-form-row">
        <label>№ и дата счета:</label>
        <input
          type="text"
          name="str_bill"
          value={formData.str_bill || ''}
          onChange={handleChange}
        />
      </div>

      {/* Прочий документ */}
      <div className="zno-modal-form-row">
        <label>Прочий документ:</label>
        <input
          type="text"
          name="other_documents"
          value={formData.other_documents || ''}
          onChange={handleChange}
        />
      </div>

      {/* Комментарий */}
      <div className="zno-modal-form-row">
        <label>Комментарий:</label>
        <input
          type="text"
          name="comment"
          value={formData.comment || ''}
          onChange={handleChange}
        />
      </div>

      {/* Дата фактической оплаты + Номер платёжки */}
      <div className="zno-modal-form-row zno-modal-grouped">
        <div style={{ flex: '1' }}>
          <label>Дата оплаты:</label>
          <input
            type="date"
            name="payment_date"
            value={formData.payment_date || ''}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: '1' }}>
          <label>Номер платёжного поручения:</label>
          <input
            type="text"
            name="id_payment_order"
            value={formData.id_payment_order || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="zno-modal-actions">
        {isEditMode && (
          <>
            {(rights === 1 || rights === 2) && (
              <button onClick={handleDelete} className="zno-modal-delete-btn">
                🗑️
              </button>
            )}

            {rights === 3 &&
              formData.id_user === userId &&
              [0, 1].includes(formData.id_status) && (
                <button onClick={handleDelete} className="zno-modal-delete-btn">
                  🗑️
                </button>
            )}
          </>
        )}
        <button onClick={onClose} className="zno-modal-cancel-btn">Отмена</button>
        <button onClick={handleSubmit} className="zno-modal-save-btn">Сохранить</button>
      </div>
    </>
  );
};

export default ZnoForm;
