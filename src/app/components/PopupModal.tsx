"use client"
import React from 'react';

interface PopupModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="popup-container bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="popup-content text-gray-800">
          <p className="text-lg font-semibold mb-4">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md px-4 py-2 bg-green-800 text-white hover:bg-green-500/80 focus:outline-none focus:ring-2 focus:ring-secondary-color focus:ring-opacity-50 transition duration-200"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
