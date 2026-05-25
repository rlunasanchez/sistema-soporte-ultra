import { useState } from 'react';
import { ArrowLeft, KeyRound, Lock, User, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function PasswordRecovery({ onBack }) {
  const [usuario, setUsuario] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const resetear = () => {
    setUsuario('');
    setCodigo('');
    setNuevaPassword('');
    setConfirmarPassword('');
    setCodigoEnviado(false);
  };

  const solicitarCodigo = async (e) => {
    e.preventDefault();
    if (!usuario.trim()) { alert('Ingrese el usuario'); return; }
    setCargando(true);
    try {
      const res = await api.post('/api/auth/buscar-usuario', { usuario });
      if (res.data.existe) {
        setCodigoEnviado(true);
        alert(res.data.mensaje || 'Código enviado a tu email');
      } else {
        alert('Usuario no encontrado');
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Usuario no encontrado');
    } finally {
      setCargando(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) { alert('Ingrese el código de verificación'); return; }
    if (!nuevaPassword.trim() || !confirmarPassword.trim()) { alert('Ingrese la nueva contraseña y confirmación'); return; }
    if (nuevaPassword !== confirmarPassword) { alert('Las contraseñas no coinciden'); return; }
    if (nuevaPassword.length < 4) { alert('La contraseña debe tener al menos 4 caracteres'); return; }
    setCargando(true);
    try {
      await api.post('/api/auth/verificar-codigo', { usuario, codigo });
      await api.post('/api/auth/cambiar-password-externo', { usuario, nuevaPassword });
      alert('Contraseña cambiada correctamente. Ahora puede iniciar sesión.');
      onBack();
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al cambiar contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-panel'>
          <KeyRound />
        </div>
        <div className='auth-body'>
          <div className='auth-main'>
            <h2>Recuperar Contraseña</h2>
            <p>Ingrese su usuario para comenzar</p>
          </div>

          {!codigoEnviado ? (
            <form onSubmit={solicitarCodigo} className='auth-form'>
              <div className='form-group input-with-icon'>
                <label>Usuario</label>
                <div className='input-wrap'>
                  <User className='input-icon' />
                  <input placeholder='Ingrese su usuario' value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={cargando} />
                </div>
              </div>
              <button type='submit' className='main-btn' disabled={cargando}>
                {cargando ? 'Enviando...' : 'Solicitar Código'}
              </button>
              <button type='button' className='cancel-btn auth-back-btn' onClick={() => { resetear(); onBack(); }}>
                <ArrowLeft /> Volver al Login
              </button>
            </form>
          ) : (
            <form onSubmit={cambiarPassword} className='auth-form'>
              <div className='form-group'>
                <label>Usuario</label>
                <input value={usuario} disabled />
              </div>
              <div className='form-group'>
                <label>Código de Verificación</label>
                <input
                  type='text'
                  placeholder='Ingrese el código de 6 dígitos'
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={cargando}
                  className='code-input'
                />
                <small className='input-hint'>El código llega a tu email</small>
              </div>
              <div className='form-group input-with-icon'>
                <label>Nueva Contraseña</label>
                <div className='input-wrap'>
                  <Lock className='input-icon' />
                  <input
                    type={mostrarNuevaPassword ? 'text' : 'password'}
                    placeholder='Nueva contraseña'
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    disabled={cargando}
                  />
                  <button type='button' className='toggle-password' onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)} tabIndex={-1}>
                    {mostrarNuevaPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className='form-group input-with-icon'>
                <label>Confirmar Contraseña</label>
                <div className='input-wrap'>
                  <Lock className='input-icon' />
                  <input
                    type={mostrarConfirmarPassword ? 'text' : 'password'}
                    placeholder='Confirme la contraseña'
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    disabled={cargando}
                  />
                  <button type='button' className='toggle-password' onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)} tabIndex={-1}>
                    {mostrarConfirmarPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <button type='submit' className='main-btn' disabled={cargando}>
                {cargando ? 'Verificando...' : 'Cambiar Contraseña'}
              </button>
              <button type='button' className='cancel-btn auth-back-btn' onClick={() => { resetear(); onBack(); }}>
                <ArrowLeft /> Cancelar
              </button>
            </form>
          )}
          <p className='auth-footer'>&copy; {new Date().getFullYear()} Rodrigo Luna. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
