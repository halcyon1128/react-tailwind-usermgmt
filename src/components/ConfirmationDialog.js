import React from 'react'

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="rounded-md bg-white p-10 shadow-lg">
        <div className="mb-8 px-1 text-lg sm:text-xl">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

//
