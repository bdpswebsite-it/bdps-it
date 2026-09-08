'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function ResponsiveSelect({
  value,
  onChange,
  options = [],
  icon = null,
  placeholder = 'Select option...',
  required = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getLabel = (opt) => (typeof opt === 'object' && opt !== null ? opt.label || opt.title || opt.value : opt);
  const getValue = (opt) => (typeof opt === 'object' && opt !== null ? opt.value || opt.id || opt.title : opt);

  const selectedOption = options.find((opt) => getValue(opt) === value);
  const displayLabel = selectedOption ? getLabel(selectedOption) : value || placeholder;

  return (
    <div
      ref={containerRef}
      className={`responsive-select-container ${className}`}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Hidden native select for HTML5 form validation */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={getValue(opt)}>
            {getLabel(opt)}
          </option>
        ))}
      </select>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="responsive-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          height: '44px',
          padding: icon ? '0 36px 0 42px' : '0 36px 0 14px',
          border: isOpen ? '1.5px solid #FF7518' : '1.5px solid #E9E1DD',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          color: value ? '#1C1917' : '#78716C',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(255, 117, 24, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          outline: 'none',
          textAlign: 'left',
          position: 'relative',
        }}
      >
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              color: '#FF7518',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}

        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            paddingRight: '8px',
          }}
        >
          {displayLabel}
        </span>

        <span
          style={{
            color: '#78716C',
            display: 'flex',
            alignItems: 'center',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {/* Dropdown Options Box */}
      {isOpen && (
        <div
          role="listbox"
          className="responsive-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            width: '100%',
            maxHeight: '220px',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1.5px solid #E9E1DD',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            padding: '6px',
            boxSizing: 'border-box',
          }}
        >
          {options.map((opt, idx) => {
            const val = getValue(opt);
            const lbl = getLabel(opt);
            const isSelected = val === value;

            return (
              <div
                key={idx}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(val)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#BD601C' : '#1C1917',
                  backgroundColor: isSelected ? '#FFF7ED' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'background-color 0.15s ease',
                  wordBreak: 'break-word',
                  lineHeight: '1.4',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F5F5F4';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ flex: 1 }}>{lbl}</span>
                {isSelected && <Check size={16} color="#FF7518" style={{ flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
