'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionType, useWorkflow } from '@/context/WorkflowContext';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import PopupModal from '@/app/components/PopupModal';
import { FaEllipsisV, FaEdit, FaTrash, FaEye, FaSyncAlt, FaPalette, FaWindowClose, FaArrowRight } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ConfigPage = () => {
  const { label, setLabel, actions, addAction, reorderActions, removeAction, updateAction } = useWorkflow();
  const [newActionType, setNewActionType] = useState<ActionType>(ActionType.ALERT);
  const [actionValue, setActionValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleAddOrUpdateAction = () => {
    if (!actionValue.trim() && newActionType !== ActionType.REFRESH_PAGE) return;
    if (editingIndex !== null) {
      updateAction(editingIndex, { type: newActionType, message: actionValue });
      setEditingIndex(null);
    } else {
      addAction({ type: newActionType, message: actionValue });
    }
    setActionValue('');
  };

  const handleDeleteAction = () => {
    if (deleteIndex !== null) {
      removeAction(deleteIndex);
      setDeleteIndex(null);
      setShowModal(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">Configure Button Workflow</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2 font-semibold text-gray-700">Button Label:</label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} className="mb-4" />
        
        <div className="flex gap-2 items-center">
          <select
            value={newActionType}
            onChange={(e) => setNewActionType(e.target.value as ActionType)}
            className="border rounded px-3 py-2 bg-gray-100"
          >
            {Object.values(ActionType).map((action) => (
              <option key={action} value={action}>{action.replace('_', ' ')}</option>
            ))}
          </select>
          <Input value={actionValue} onChange={(e) => setActionValue(e.target.value)} className="flex-1" />
          <Button onClick={handleAddOrUpdateAction} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingIndex !== null ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
      
      {/* Visual Workflow Preview */}
      <div className="bg-white mt-6 p-6 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Workflow Preview</h2>
        <div className="flex items-center gap-4 flex-wrap">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2 p-3 bg-gray-200 rounded shadow-md">
                {action.type === ActionType.ALERT && <FaEye className="text-blue-500" />}
                {action.type === ActionType.REFRESH_PAGE && <FaSyncAlt className="text-green-500" />}
                {action.type === ActionType.CHANGE_BUTTON_COLOR && <FaPalette className="text-yellow-500" />}
                {action.type === ActionType.CLOSE_WINDOW && <FaWindowClose className="text-red-500" />}
                <span className="text-gray-700 font-medium">{action.type.replace('_', ' ')}: {action.message}</span>
              </div>
              {index < actions.length - 1 && <FaArrowRight className="text-gray-500" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mx-4 mt-6">
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          reorderActions(result.source.index, result.destination.index);
        }}>
          <Droppable droppableId="actions">
            {(provided) => (
              <table className="w-full bg-white rounded-lg shadow-md border border-gray-300" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-200 text-gray-700">
                    <th className="p-4">Button Action</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-b border-gray-300 hover:bg-gray-100">
                          <td className="p-4 cursor-grab"><FaEllipsisV /></td>
                          <td className="p-4">{action.type.replace('_', ' ')}</td>
                          <td className="p-4">{action.message}</td>
                          <td className="p-4 flex gap-2">
                            <FaEdit className="cursor-pointer text-blue-500" onClick={() => {
                              setEditingIndex(index);
                              setNewActionType(action.type as ActionType);
                              setActionValue(action.message || '');
                            }} />
                            <FaTrash className="cursor-pointer text-red-500" onClick={() => {
                              setDeleteIndex(index);
                              setShowModal(true);
                            }} />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      <Button onClick={() => router.push('/output')} className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Go to Output Page</Button>
      
      <PopupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteAction}
        message="Are you sure you want to delete this action?"
      />
    </div>
  );
}
 export default ConfigPage;