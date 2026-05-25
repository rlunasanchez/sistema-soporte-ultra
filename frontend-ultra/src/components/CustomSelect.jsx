import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ name, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function preventScroll(e) {
      if (open) e.preventDefault();
    }
    document.addEventListener("mousedown", handleClickOutside);
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const getDropdownStyle = () => {
    const baseStyle = {
      position: 'fixed',
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 0,
      listStyle: 'none',
      maxHeight: '250px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    };
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 200) {
        return {
          ...baseStyle,
          bottom: (window.innerHeight - rect.top) + 'px',
          left: rect.left + 'px',
          width: rect.width + 'px'
        };
      }
      return {
        ...baseStyle,
        top: (rect.bottom + 2) + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px'
      };
    }
    return { ...baseStyle, top: '100%', left: 0, width: '100%' };
  };

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    onChange(e);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!open) {
      setOpen(true);
      setSearch("");
    }
  };

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <input
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "Seleccionar"}
        onClick={handleClick}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <ul className="custom-select-dropdown" style={getDropdownStyle()}>
          {filteredOptions.length === 0 ? (
            <li className="cs-empty">Sin resultados</li>
          ) : (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                className={`cs-option ${value === opt ? 'cs-selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
