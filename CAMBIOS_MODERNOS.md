# Cambios Modernos Apply to All Projects

## Overview
Este documento contiene los cambios de diseño aplicados para modernizar la UI sin cambiar colores ni tamaños.

---

## 1. LOGIN (Login.jsx + App.css)

### Login.jsx
- Importar icons: `Eye, EyeOff` de lucide-react
- Agregar estados: `mostrarPassword`, `mostrarNuevaPassword`, `mostrarConfirmarPassword`
- Agregar toggle button dentro de cada input-with-icon

```jsx
<div className='form-group input-with-icon'>
  <input type={mostrarPassword ? 'text' : 'password'} ... />
  <button type='button' className='toggle-password' onClick={() => setMostrarPassword(!mostrarPassword)}>
    {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
```

### App.css - Login Styles
```css
.auth-container {
  /* Fondo con patrón de puntos sutil */
  background: 
    radial-gradient(ellipse at 20% 80%, rgba(0, 181, 226, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(12, 74, 140, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
}

/* Card con línea decorativa superior */
.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
}

/* Logo con efecto hover */
.auth-header .logo {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.auth-header .logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(12, 74, 140, 0.35);
}

/* Inputs modernos */
.form-group input {
  border: 1.5px solid var(--border);
  background: #fafbfc;
}
.form-group input:hover {
  border-color: #c5cfd9;
}
.form-group input:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(12, 74, 140, 0.12);
}

/* Toggle password button */
.form-group.input-with-icon input {
  padding-left: 44px;
  padding-right: 44px;
}
.form-group.input-with-icon .toggle-password {
  position: absolute;
  right: 14px;
  bottom: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  opacity: 0.6;
}
.form-group.input-with-icon .toggle-password:hover {
  opacity: 1;
}

/* Botón con efecto ripple */
.auth-form .main-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}
.auth-form .main-btn:active::after {
  width: 300px;
  height: 300px;
}
```

---

## 2. FORMULARIO (Formulario.jsx + App.css)

### App.css - Form Styles
```css
/* Container con línea decorativa */
.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
}

/* Inputs, Select, Textarea */
.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1.5px solid var(--border);
  background: #fafbfc;
  transition: all 0.2s ease;
}
.form-grid input:hover,
.form-grid select:hover,
.form-grid textarea:hover {
  border-color: #c5cfd9;
}
.form-grid input:focus,
.form-grid select:focus,
.form-grid textarea:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(12, 74, 140, 0.12);
}

/* Textarea más alto */
.form-grid textarea {
  min-height: 80px;
}

/* Checkbox grid con bordes */
.checkbox-grid {
  background: #fafbfc;
  border: 1.5px solid var(--border);
}
.checkbox-grid:hover {
  border-color: #c5cfd9;
}
.checkbox-grid label {
  transition: opacity 0.2s ease;
}
.checkbox-grid label:hover {
  opacity: 0.8;
}
```

---

## 3. GLOBAL - All Elements

### Bordes (todos los elementos)
Cambiar: `border: 1px solid var(--border)` → `border: 1.5px solid var(--border)`

### Box-shadow focus (todos los elementos)
Cambiar: `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)` → `box-shadow: 0 0 0 3px rgba(12, 74, 140, 0.12)`

### Buttons (cancel-btn, export-btn, pagination)
```css
.cancel-btn,
.export-btn,
.pagination button {
  border: 1.5px solid var(--border);
  transition: all 0.2s ease;
}
.cancel-btn:hover,
.export-btn:hover {
  border-color: #c5cfd9;
}
```

### Filter inputs
```css
.filter-group input,
.filter-group select {
  border: 1.5px solid var(--border);
  background: #fafbfc;
}
.filter-group input:hover,
.filter-group select:hover {
  border-color: #c5cfd9;
}
.filter-group input:focus,
.filter-group select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(12, 74, 140, 0.12);
  background: #fff;
}
```

### Mobile cards
```css
.mobile-card {
  border: 1.5px solid var(--border);
}
```

### Seccion items
```css
.seccion-item {
  border: 1.5px solid var(--border);
}
```

### Textarea global
```css
textarea {
  border: 1.5px solid var(--border);
  background: #fafbfc;
}
textarea:hover {
  border-color: #c5cfd9;
}
textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(12, 74, 140, 0.12);
  background: #fff;
}
```

### Logout button (Volver)
```css
.logout-btn {
  background: var(--bg);
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}
.logout-btn:hover {
  background: var(--border);
  color: var(--text);
}
```

---

## Colors Reference (NO CAMBIAR)
```css
:root {
  --primary: #0C4A8C;
  --primary-hover: #0a3d75;
  --primary-light: #e6f0fa;
  --success: #00B5E2;
  --success-light: #e0f7fc;
  --danger: #E53935;
  --danger-light: #ffebee;
  --warning: #FF9800;
  --warning-light: #fff3e0;
  --info: #009EE3;
  --border: #e2e8f0;
  --text: #1a1a2e;
  --text-muted: #64748b;
  --gradient: linear-gradient(135deg, #0C4A8C 0%, #009EE3 100%);
}
```

---

## Summary of Changes
1. Bordes: 1px → 1.5px
2. Fondo inputs: var(--bg) → #fafbfc
3. Estados hover en todos los inputs
4. Focus box-shadow con color primary (#0C4A8C)
5. Líneas decorativas superiores con gradiente
6. Efectos hover/transitions sutiles
7. Toggle password en login
8. Textarea más alto (80px min-height)