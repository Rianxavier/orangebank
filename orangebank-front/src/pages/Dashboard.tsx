import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div onClick={logout} className="mt-4">
        Sair
      </div>
    </div>
  );
}
