import { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import Button from '../ui/Button';

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  onClear?: () => void;
  width?: number;
  height?: number;
}

export default function SignatureCanvas({ 
  onSave, 
  onClear,
  width = 500,
  height = 200 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    signaturePadRef.current = new SignaturePad(canvasRef.current, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)'
    });

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  const handleSave = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }

    const dataUrl = signaturePadRef.current?.toDataURL();
    onSave(dataUrl);
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Signature
        </Button>
      </div>
    </div>
  );
}