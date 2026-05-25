import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { Lock, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import PasswordRecovery from '../components/PasswordRecovery';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/ordenes', { replace: true });
  }, [navigate]);

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      window.history.pushState({}, '', location.pathname + location.search);
    }
  }, [navigationType, location.pathname, location.search]);

  const ingresar = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) { alert('Por favor ingrese usuario y contraseña'); return; }
    setCargando(true);
    try {
      const res = await api.post('/api/auth/login', { usuario, password });
      localStorage.setItem('token', res.data.token);
      navigate('/ordenes');
    } catch {
      alert('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  if (vista === 'recuperar') {
    return <PasswordRecovery onBack={() => setVista('login')} />;
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-panel' />
        <div className='auth-body'>
          <div className='auth-main'>
            <h2>Sistema de Carga OS</h2>
            <p>Ingrese sus credenciales para acceder</p>
          </div>
          <form onSubmit={ingresar} className='auth-form'>
            <div className='form-group input-with-icon'>
              <label>Usuario</label>
              <div className='input-wrap'>
                <User className='input-icon' />
                <input placeholder='Ingrese su usuario' value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={cargando} />
              </div>
            </div>
            <div className='form-group input-with-icon'>
              <label>Contraseña</label>
              <div className='input-wrap'>
                <Lock className='input-icon' />
                <input type={mostrarPassword ? 'text' : 'password'} placeholder='Ingrese su contraseña' value={password} onChange={(e) => setPassword(e.target.value)} disabled={cargando} />
                <button type='button' className='toggle-password' onClick={() => setMostrarPassword(!mostrarPassword)} tabIndex={-1}>
                  {mostrarPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button type='submit' className='main-btn' disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar al Sistema'}
            </button>
            <button type='button' className='cancel-btn auth-back-btn' onClick={() => setVista('recuperar')}>
              <KeyRound /> ¿Olvidó su contraseña?
            </button>
          </form>
          <p className='auth-footer'>&copy; {new Date().getFullYear()} Rodrigo Luna. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
