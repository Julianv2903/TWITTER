// pages/auth/login.tsx
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErr(error.message);
      return;
    }

    // Si login OK, redirigir al feed
    router.push('/');
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <label>Correo</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button type="submit">Entrar</button>
      </form>
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </div>
  );
}
