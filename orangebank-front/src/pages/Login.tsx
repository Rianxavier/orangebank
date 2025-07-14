import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Login</h1>
      <div onClick={handleLogin} className="mt-4">
        Entrar
      </div>
    </div>
  );
}
