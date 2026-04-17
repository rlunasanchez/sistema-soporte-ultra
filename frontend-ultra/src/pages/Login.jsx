import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const [recuperarUsuario, setRecuperarUsuario] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarNuevaPassword, setMostrarNuevaPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/ordenes', { replace: true });
    }
  }, [navigate]);

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      window.history.pushState({}, '', location.pathname + location.search);
    }
  }, [navigationType, location.pathname, location.search]);

  const resetearCampos = () => {
    setRecuperarUsuario('');
    setCodigo('');
    setNuevaPassword('');
    setConfirmarPassword('');
    setCodigoEnviado(false);
  };

  const ingresar = async (e) => {
    e.preventDefault();
    
    if (!usuario.trim() || !password.trim()) {
      alert('Por favor ingrese usuario y contraseña');
      return;
    }

    setCargando(true);

    try {
      const res = await api.post('/api/auth/login', {
        usuario,
        password
      });

      localStorage.setItem('token', res.data.token);
      navigate('/ordenes');

    } catch (error) {
      console.log(error.response?.data);
      alert('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  const solicitarCodigo = async (e) => {
    e.preventDefault();
    
    if (!recuperarUsuario.trim()) {
      alert('Ingrese el usuario');
      return;
    }

    setCargando(true);

    try {
      const res = await api.post('/api/auth/buscar-usuario', {
        usuario: recuperarUsuario
      });

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

  const verificarCodigoYCambiarPassword = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) {
      alert('Ingrese el código de verificación');
      return;
    }

    if (!nuevaPassword.trim() || !confirmarPassword.trim()) {
      alert('Ingrese la nueva contraseña y confirmación');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (nuevaPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setCargando(true);

    try {
      await api.post('/api/auth/verificar-codigo', {
        usuario: recuperarUsuario,
        codigo: codigo
      });

      await api.post('/api/auth/cambiar-password-externo', {
        usuario: recuperarUsuario,
        nuevaPassword
      });

      alert('Contraseña cambiada correctamente. Ahora puede iniciar sesión.');
      setVista('login');
      resetearCampos();

    } catch (error) {
      alert(error.response?.data?.msg || 'Error al cambiar contraseña');
    } finally {
      setCargando(false);
    }
  };

  if (vista === 'recuperar') {
    return (
      <div className='auth-container'>
        <div className='auth-card'>
          <div className='auth-header'>
            <div className='logo'>
              <KeyRound size={32} color="white" />
            </div>
            <h2>Recuperar Contraseña</h2>
            <p>Ingrese su usuario para comenzar</p>
          </div>

          {!codigoEnviado ? (
            <form onSubmit={solicitarCodigo} className='auth-form'>
              <div className='form-group input-with-icon'>
                <label>Usuario</label>
                <User className='input-icon' size={20} />
                <input
                  placeholder='Ingrese su usuario'
                  value={recuperarUsuario}
                  onChange={(e) => setRecuperarUsuario(e.target.value)}
                  disabled={cargando}
                />
              </div>

              <button 
                type='submit' 
                className='main-btn'
                disabled={cargando}
              >
                {cargando ? 'Enviando...' : 'Solicitar Código'}
              </button>

              <button 
                type='button' 
                className='cancel-btn'
                onClick={() => {
                  setVista('login');
                  resetearCampos();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ArrowLeft size={18} />
                Volver al Login
              </button>
            </form>
          ) : (
            <form onSubmit={verificarCodigoYCambiarPassword} className='auth-form'>
              <div className='form-group'>
                <label>Usuario</label>
                <input
                  value={recuperarUsuario}
                  disabled
                  style={{ background: '#f0f0f0' }}
                />
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
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  El código llega a tu email
                </small>
              </div>

              <div className='form-group input-with-icon'>
                <label>Nueva Contraseña</label>
                <Lock className='input-icon' size={20} />
                <input
                  type={mostrarNuevaPassword ? 'text' : 'password'}
                  placeholder='Nueva contraseña'
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  disabled={cargando}
                />
                <button type='button' className='toggle-password' onClick={() => setMostrarNuevaPassword(!mostrarNuevaPassword)}>
                  {mostrarNuevaPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className='form-group input-with-icon'>
                <label>Confirmar Contraseña</label>
                <Lock className='input-icon' size={20} />
                <input
                  type={mostrarConfirmarPassword ? 'text' : 'password'}
                  placeholder='Confirme la contraseña'
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  disabled={cargando}
                />
                <button type='button' className='toggle-password' onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}>
                  {mostrarConfirmarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type='submit' 
                className='main-btn'
                disabled={cargando}
              >
                {cargando ? 'Verificando...' : 'Cambiar Contraseña'}
              </button>

              <button 
                type='button' 
                className='cancel-btn'
                onClick={() => {
                  setVista('login');
                  resetearCampos();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ArrowLeft size={18} />
                Cancelar
              </button>
            </form>
          )}

          <p className='auth-footer'>
            © {new Date().getFullYear()} Rodrigo Luna. Todos los derechos reservados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <div className='logo'>
            <Shield size={32} color="white" />
          </div>
          <h2>Sistema de Carga OS</h2>
          <p>Ingrese sus credenciales para acceder</p>
        </div>

        <form onSubmit={ingresar} className='auth-form'>
          <div className='form-group input-with-icon'>
            <label>Usuario</label>
            <User className='input-icon' size={20} />
            <input
              placeholder='Ingrese su usuario'
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className='form-group input-with-icon'>
            <label>Contraseña</label>
            <Lock className='input-icon' size={20} />
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder='Ingrese su contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
            />
            <button type='button' className='toggle-password' onClick={() => setMostrarPassword(!mostrarPassword)}>
              {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type='submit' 
            className='main-btn'
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>

          <button 
            type='button' 
            className='cancel-btn'
            onClick={() => setVista('recuperar')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <KeyRound size={18} />
            ¿Olvidó su contraseña?
          </button>
        </form>

        <p className='auth-footer'>
          © {new Date().getFullYear()} Rodrigo Luna. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;
