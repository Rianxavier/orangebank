import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type Account = {
  id: string;
  type: 'CHECKING' | 'INVESTMENT';
  accountNumber: number;
  balance: number;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  accounts: Account[];
};

type JwtPayload = {
  sub: string;
};

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded.sub;

    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erro ao carregar dados do usuário');

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md text-red-600">
        <p>{error}</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6">
      {/* Card Usuário */}
      <div className="mb-8 p-6 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4">Dados do Usuário</h2>
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>CPF:</strong> {user.cpf}
        </p>
      </div>

      {/* Cards de Contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.accounts.map((account) => (
          <div
            key={account.id}
            className="p-6 border rounded-lg shadow bg-white"
          >
            <h3 className="text-xl font-semibold mb-3">
              {account.type === 'CHECKING'
                ? 'Conta Corrente'
                : 'Conta Investimento'}
            </h3>
            <p>
              <strong>Número da conta:</strong> {account.accountNumber}
            </p>
            <p>
              <strong>Saldo:</strong>{' '}
              {account.balance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
