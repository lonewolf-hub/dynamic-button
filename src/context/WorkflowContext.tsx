"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export enum ActionType {
  ALERT = 'ALERT',
  SHOW_TEXT = 'SHOW_TEXT',
  SHOW_IMAGE = 'SHOW_IMAGE',
  REFRESH_PAGE = 'REFRESH_PAGE',
  SET_LOCAL_STORAGE = 'SET_LOCAL_STORAGE',
  GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE',
  INCREASE_BUTTON_SIZE = 'INCREASE_BUTTON_SIZE',
  CLOSE_WINDOW = 'CLOSE_WINDOW',
  PROMPT_AND_SHOW = 'PROMPT_AND_SHOW',
  CHANGE_BUTTON_COLOR = 'CHANGE_BUTTON_COLOR',
  DISABLE_BUTTON = 'DISABLE_BUTTON',
}

type Action = {
  type: ActionType;
  message?: string;
  url?: string;
  key?: string;
  value?: string;
};

type WorkflowContextType = {
  label: string;
  actions: Action[];
  setLabel: (label: string) => void;
  setActions: (actions: Action[]) => void;
  addAction: (action: Action) => void;
  removeAction: (index: number) => void;
  reorderActions: (startIndex: number, endIndex: number) => void;
  updateAction: (index: number, updatedAction: Action) => void;
};

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [label, setLabel] = useState<string>('Click Me');
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    const savedWorkflow = localStorage.getItem('workflow');
    if (savedWorkflow) {
      try {
        const parsedWorkflow = JSON.parse(savedWorkflow);
        setLabel(parsedWorkflow.label || 'Click Me');
        setActions(parsedWorkflow.actions || []);
      } catch (error) {
        console.error('Error parsing saved workflow:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workflow', JSON.stringify({ label, actions }));
  }, [label, actions]);

  const addAction = (action: Action) => {
    setActions((prevActions) => [...prevActions, action]);
    toast.success('Action added successfully!');
  };

  const removeAction = (index: number) => {
    setActions((prevActions) => prevActions.filter((_, i) => i !== index));
    toast.success('Action removed successfully!');
  };

  const reorderActions = (startIndex: number, endIndex: number) => {
    setActions((prevActions) => {
      if (endIndex < 0 || endIndex >= prevActions.length) return prevActions;
      const updatedActions = [...prevActions];
      const [movedAction] = updatedActions.splice(startIndex, 1);
      updatedActions.splice(endIndex, 0, movedAction);
      return updatedActions;
    });
    toast.success('Actions reordered successfully!');
  };

  const updateAction = (index: number, updatedAction: Action) => {
    setActions((prevActions) => prevActions.map((action, i) => (i === index ? updatedAction : action)));
    toast.success('Action updated successfully!');
  };

  return (
    <WorkflowContext.Provider value={{ label, actions, setLabel, setActions, addAction, removeAction, reorderActions, updateAction }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
