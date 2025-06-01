/**
 * UI Component for the export modal.
 */
import React from 'react';
import { SessionContext } from '../core/context/types';
import { OutputFormatter } from '../core/formatting/OutputFormatter';

interface ExportModalProps {
  sessionContext: SessionContext;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ sessionContext, onClose }) => {
  // ...existing code...
  return <div>Export Modal</div>;
};
