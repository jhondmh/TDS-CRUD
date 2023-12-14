import React, { PropsWithChildren } from 'react';
import Modal, { ModalProps } from '@/Components/Modal';

DialogModal.Content = function DialogModalContent({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="px-6 py-4">
      <div className="pl-6 pt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </div>
  );
};

DialogModal.Footer = function DialogModalFooter({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return (
    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-right">
      {children}
    </div>
  );
};

export default function DialogModal({
  children,
  ...modalProps
}: PropsWithChildren<ModalProps>) {
  return <Modal {...modalProps}>{children}</Modal>;
}
