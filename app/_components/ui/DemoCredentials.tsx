import React, { useState, useRef, useEffect } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

type CopyItem = {
  id: string;
  value: string;
};

type CopyFieldProps = {
  label?: string;
  item: CopyItem;
  copiedId: string | null;
  onCopy: (id: string, value: string) => void;
};

const CopyField: React.FC<CopyFieldProps> = ({ label, item, copiedId, onCopy }) => {
  const isCopied = copiedId === item.id;

  return (
    <div className="flex items-center justify-center gap-2 mt-1">
      {label && <span className="text-gray-600 sr-only">{label}</span>}
      <span className="font-mono text-sm text-black bg-gray-100 px-2 py-1 rounded">
        {item.value}
      </span>
      <button
        onClick={() => onCopy(item.id, item.value)}
        className="text-blue-500 hover:text-blue-700 focus:outline-none"
        title="Copy to clipboard"
      >
        {isCopied ? <Check size={16} /> : <ClipboardCopy size={16} />}
      </button>
    </div>
  );
};

const DemoCredentials: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);

      // Clear previous timeout if exists
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set new timeout to clear copied state
      timeoutRef.current = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const items: CopyItem[] = [
    { id: 'email1', value: 'admin@northwindcorp.io' },
    { id: 'email2', value: 'admin@orbitlabs.com' },
    { id: 'password', value: 'nW7jK39bPqZ' },
  ];

  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      <p className="mb-2 font-semibold">Demo Credentials:</p>
      {items.map((item) => (
        <CopyField
          key={item.id}
          label={item.id.includes('email') ? 'Email:' : 'Password:'}
          item={item}
          copiedId={copiedId}
          onCopy={handleCopy}
        />
      ))}
    </div>
  );
};

export default DemoCredentials;
