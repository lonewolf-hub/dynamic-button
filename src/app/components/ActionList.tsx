import React from 'react';
import Button from './Button';

type Action = {
  type: string;
  message?: string;
};

type ActionListProps = {
  actions: Action[];
  reorderActions: (startIndex: number, endIndex: number) => void;
};

const ActionList: React.FC<ActionListProps> = ({ actions, reorderActions }) => {
  return (
    <div className="border rounded p-4 bg-white shadow-md">
      <h2 className="font-semibold mb-2">Workflow Actions</h2>
      <ul>
        {actions.map((action, index) => (
          <li key={index} className="flex justify-between items-center border-b py-2">
            <span>{action.type} {action.message && `: ${action.message}`}</span>
            <Button onClick={() => reorderActions(index, index - 1)} className="mr-2">⬆</Button>
            <Button onClick={() => reorderActions(index, index + 1)}>⬇</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionList;