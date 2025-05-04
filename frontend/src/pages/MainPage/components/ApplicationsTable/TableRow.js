import { ZNO_STATUSES } from '../../constants/znoStatuses'; //

const TableRow = ({
  data,
  fields,
  allFields,
  index,
  isSelected,
  onSelect
}) => {
  // цвет строки по её статусу
  const statusLabel = data.values[allFields.indexOf("Статус")];
  const status = ZNO_STATUSES.find(s => s.label === statusLabel);
  const backgroundColor = status?.color || "transparent";

  return (
    <tr
      className={isSelected ? 'selected-row' : ''}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        backgroundColor: backgroundColor,
        position: 'relative',
      }}
    >
      {fields.map(field => (
        <td key={`${data.id}-${field}`}>
          {field === "№ п/п" ? data.id : data.values[allFields.indexOf(field)]}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;