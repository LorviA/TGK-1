import { useState } from 'react';
import { ALL_FIELDS } from '../constants/fields';

export const useFieldsSelection = () => {
  const [selectedFields, setSelectedFields] = useState([...ALL_FIELDS]);

  const toggleField = (field) => {
    if (field === "№ п/п") return;
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field].sort((a, b) => ALL_FIELDS.indexOf(a) - ALL_FIELDS.indexOf(b))
    );
  };

  const toggleAllFields = () => {
    setSelectedFields(prev =>
      prev.length === ALL_FIELDS.length
        ? ["№ п/п"]
        : [...ALL_FIELDS]
    );
  };

  return {
    selectedFields,
    toggleField,
    toggleAllFields,
    allFields: ALL_FIELDS
  };
};