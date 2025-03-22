'use client';
import { useWorkflow } from '@/context/WorkflowContext';
import { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';

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
  message?: string;
};

const  OutputPage = () =>  {
  const { label, actions } = useWorkflow() as { label: string; actions: Action[] };
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
      [ActionType.ALERT]: () => toast.success(action.value || 'Alert Triggered!'),
      [ActionType.SHOW_TEXT]: () => setDisplayText(action.message || 'No text provided'),
      [ActionType.SHOW_IMAGE]: () => setImageUrl(action.message || ''),
      [ActionType.REFRESH_PAGE]: () => window.location.reload(),
      [ActionType.SET_LOCAL_STORAGE]: () => {
        if (action.value) {
          const [key, value] = action.value.split('=');
          localStorage.setItem(key, value);
          toast.success(`Stored '${key}' in Local Storage`);
        }
      },
      [ActionType.GET_LOCAL_STORAGE]: () => {
        if (action.value) {
          const storedValue = localStorage.getItem(action.value);
          setDisplayText(storedValue || 'Key not found');
          toast.success(`Fetched value: ${storedValue || 'Not found'}`);
        }
      },
      [ActionType.INCREASE_BUTTON_SIZE]: () => {
        setButtonSize((prev) => prev + 0.2);
        localStorage.setItem('buttonSize', (buttonSize + 0.2).toString());
        toast.success('Button size increased');
      },
      [ActionType.CLOSE_WINDOW]: () => toast.error('Window cannot be closed programmatically!'),
      [ActionType.PROMPT_AND_SHOW]: () => {
        const response = prompt(action.value || 'Enter something:');
        setDisplayText(response || '');
        toast.success('Prompt response recorded');
      },
      [ActionType.CHANGE_BUTTON_COLOR]: () => {
        setButtonColor(action.value || `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        toast.success('Button color changed');
      },
      [ActionType.DISABLE_BUTTON]: () => {
        setIsDisabled(true);
        toast.error('Button Disabled');
      },
    };

    actionHandlers[action.type]?.();
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center text-center bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Output Page</h1>
      <Button
        onClick={executeActions}
        disabled={isDisabled}
        style={{ transform: `scale(${buttonSize})`, backgroundColor: buttonColor }}
        className="px-6 py-3 text-white rounded flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        <FaPlay /> {label || 'Execute Actions'}
      </Button>
      {displayText && <p className="mt-6 text-lg font-semibold bg-white px-6 py-3 rounded shadow-md border">{displayText}</p>}
      {imageUrl && <img src={imageUrl} alt="Dynamic" width={200} height={200} className="mt-6 rounded shadow-md" />
    }
    </div> 
  );
}

export default OutputPage;