import PanelActions from './PanelActions';
import FieldSelector from './FieldSelector';
import './SidePanel.css';

const SidePanel = ({
  allFields,
  selectedFields,
  onToggleField,
  onToggleAll,
  selectedAppId,
  setSelectedAppId,
  isCollapsed,
  toggleCollapse
}) => {
  return (
    <aside className={`side-panel ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="collapse-toggle" onClick={toggleCollapse}>
        {isCollapsed ? '' : ''}
      </div>

      <PanelActions
        selectedAppId={selectedAppId}
        setSelectedAppId={setSelectedAppId}
        isCollapsed={isCollapsed}
      />

      { !isCollapsed && (
        <FieldSelector
          allFields={allFields}
          selectedFields={selectedFields}
          onToggleField={onToggleField}
          onToggleAll={onToggleAll}
        />
      )}
    </aside>
  );
};

export default SidePanel;
