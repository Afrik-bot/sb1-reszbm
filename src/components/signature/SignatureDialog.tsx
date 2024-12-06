import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '@tremor/react';
import SignatureCanvas from './SignatureCanvas';
import Button from '../ui/Button';

interface SignatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signature: string) => void;
  documentName: string;
}

export default function SignatureDialog({ 
  isOpen, 
  onClose, 
  onSign,
  documentName 
}: SignatureDialogProps) {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleSign = (signature: string) => {
    onSign(signature);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white">
          <Card>
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Sign Document: {documentName}
            </Dialog.Title>

            <div className="mt-4 space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-sm text-primary-700">
                  By signing this document electronically, you agree that your electronic signature
                  is the legal equivalent of your manual signature on this document.
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to sign this document electronically
                  </span>
                </label>
              </div>

              {hasAgreed && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Please sign in the box below:
                  </p>
                  <SignatureCanvas onSave={handleSign} />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}