import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Data inválida',
  }),
  createInvestmentAccount: z.boolean().catch(false),
});

export default function Register() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      password: '',
      birthDate: '',
      createInvestmentAccount: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Falha ao registrar usuário');
        setLoading(false);
        return;
      }

      toast.success('Cadastro realizado com sucesso!');
      setLoading(false);
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.' + error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center text-orange-500">
        OrangeBank
      </h1>

      <p className="text-muted-foreground mb-6 text-center">
        Crie aqui a sua conta
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createInvestmentAccount"
            render={({ field }) => (
              <FormItem className="mb-6 flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Criar conta de investimento
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Já tem conta?{' '}
        <Link
          to="/login"
          className="text-orange-500 hover:underline font-semibold"
        >
          Faça login
        </Link>
      </p>
    </div>
  );
}
