import { useState, useEffect, useRef } from 'react';
import {archiveConfidentialInfo, archiveStSmet, archiveUsers} from '../api/api'
import { useFieldsSelection } from './MainPage/hooks/useFieldsSelection';
import { ALL_FIELDS } from './MainPage/constants/fields';
import Header from './MainPage/components/Header/Header';
import SidePanel from './MainPage/components/SidePanel/SidePanel';
import ApplicationsTable from './MainPage/components/ApplicationsTable/ApplicationsTable';
import UsersModal from './MainPage/components/UsersModal/UsersModal';
import '../styles/MainPage.css';
import { useAuthSync } from './useAuthSync';

const MainPage = () => {
  useAuthSync();
  const [showUsersModal, setShowUsersModal] = useState(false);
  const {
    selectedFields,
    toggleField,
    toggleAllFields
  } = useFieldsSelection();

   const tableRef = useRef();
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);




  useEffect(() => {

  const silentArchive = async () => {
    try {
      await Promise.allSettled([
        archiveConfidentialInfo(),
        archiveStSmet(),
        archiveUsers()
      ]);
    } catch (e) {
      console.log('Фоновая архивация:', e.message);
    }
  };
  silentArchive();
}, []);


  return (
    <div className="main-page">
      <Header />
      <div className="content-wrapper">
        <SidePanel
          allFields={ALL_FIELDS}
          selectedFields={selectedFields}
          onToggleField={toggleField}
          onToggleAll={toggleAllFields}
          onUsersClick={() => setShowUsersModal(true)}
          selectedAppId={selectedAppId}
          setSelectedAppId={setSelectedAppId}
          isCollapsed={isPanelCollapsed}
          toggleCollapse={() => setIsPanelCollapsed(prev => !prev)}
        />
        <div className="main-content">
          <ApplicationsTable
            ref={tableRef}
            fields={selectedFields}
            allFields={ALL_FIELDS}
            selectedAppId={selectedAppId}
            setSelectedAppId={setSelectedAppId}
          />
        </div>
      </div>

      {showUsersModal && (
        <UsersModal onClose={() => setShowUsersModal(false)} />
      )}
    </div>
  );
};

export default MainPage;
