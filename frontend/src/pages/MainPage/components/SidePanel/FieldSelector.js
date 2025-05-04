import './SidePanel.css';


const FieldSelector = ({
  allFields,
  selectedFields,
  onToggleField,
  onToggleAll
}) => {
  return (
    <div className="field-selector">
      <h3>Отображаемые поля</h3>
      <label className="select-all">
        <input
          type="checkbox"
          checked={selectedFields.length === allFields.length}
          onChange={onToggleAll}
        />
        <span>Выбрать все</span>
      </label>
      <div className="fields-list">
        {allFields.map(field => (
          <label
            key={field}
            className={`field-item ${field === "№ п/п" ? "fixed" : ""}`}
          >
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => onToggleField(field)}
              disabled={field === "№ п/п"}
            />
            <span>{field}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FieldSelector;