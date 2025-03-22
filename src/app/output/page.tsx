'use client';

import { useWorkflow } from '@/context/WorkflowContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import Button from '@/app/components/Button';

enum ActionType {
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
  value?: string;
};

export default function OutputPage() {
  const { label, actions } = useWorkflow()as { label: string; actions: Action[] };;
  const [buttonSize, setButtonSize] = useState(1);
  const [buttonColor, setButtonColor] = useState('#007BFF');
  const [isDisabled, setIsDisabled] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSize = localStorage.getItem('buttonSize');
      if (savedSize) setButtonSize(parseFloat(savedSize));
    }
  }, []);

  const executeActions = async () => {
    for (const action of actions) {
      await new Promise((resolve) => {
        setTimeout(() => {
          performAction(action);
          resolve(true);
        }, 500);
      });
    }
  };

  const performAction = (action: Action) => {
    const actionHandlers: Record<ActionType, () => void> = {
      [ActionType.ALERT]: () => alert(action.value || 'Alert!'),
      [ActionType.SHOW_TEXT]: () => setDisplayText(action.value || ''),
      [ActionType.SHOW_IMAGE]: () => setImageUrl(action.value || ''),
      [ActionType.REFRESH_PAGE]: () => window.location.reload(),
      [ActionType.SET_LOCAL_STORAGE]: () => {
        if (action.value) {
          const [key, value] = action.value.split('=');
          localStorage.setItem(key, value);
        }
      },
      [ActionType.GET_LOCAL_STORAGE]: () => {
        if (action.value) {
          const storedValue = localStorage.getItem(action.value);
          setDisplayText(storedValue || 'Key not found');
        }
      },
      [ActionType.INCREASE_BUTTON_SIZE]: () => {
        setButtonSize((prev) => prev + 0.2);
        localStorage.setItem('buttonSize', (buttonSize + 0.2).toString());
      },
      [ActionType.CLOSE_WINDOW]: () => window.close(),
      [ActionType.PROMPT_AND_SHOW]: () => {
        const response = prompt(action.value || 'Enter something:');
        setDisplayText(response || '');
      },
      [ActionType.CHANGE_BUTTON_COLOR]: () => {
        setButtonColor(action.value || `#${Math.floor(Math.random() * 16777215).toString(16)}`);
      },
      [ActionType.DISABLE_BUTTON]: () => setIsDisabled(true),
    };
    
    actionHandlers[action.type]?.();
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold mb-6">Output Page</h1>
      <Button
        onClick={executeActions}
        disabled={isDisabled}
        style={{ transform: `scale(${buttonSize})`, backgroundColor: buttonColor }}
        className="px-6 py-3 text-white rounded flex items-center gap-2 shadow-md hover:shadow-lg transition"
      >
        <FaPlay /> {label || 'Execute Actions'}
      </Button>
      {displayText && <p className="mt-6 text-lg font-semibold bg-gray-100 px-4 py-2 rounded shadow">{displayText}</p>}
      {imageUrl && <Image src={imageUrl} alt="Dynamic" width={200} height={200} className="mt-4 rounded shadow" />}
    </div>
  );
}
