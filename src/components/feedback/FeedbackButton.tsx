import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import FeedbackForm from './FeedbackForm';
import Button from '../ui/Button';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40"
        variant="primary"
      >
        Feedback
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Share Your Feedback
            </Dialog.Title>
            <FeedbackForm />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}