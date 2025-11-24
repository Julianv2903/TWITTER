// pages/auth/register.tsx
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1) Crear usuario en Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // data.user?.id es el uid creado. Insertamos profile con el mismo id
    const uid = data.user?.id;
    if (!uid) {
      setError('No se pudo obtener el id del usuario.');
      return;
    }

    // 2) Insertar el profile con username
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: uid,
        username
      });

    if (profileError) {
      setError(profileError.message);
      return;
    }

    // registrado: Supabase envía un correo de confirmación si está activado.
    // Redirigir a login o al feed
    router.push('/auth/login');
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <label>Usuario (username)</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Correo</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button type="submit">Crear cuenta</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Te enviaremos un correo para confirmar tu cuenta si está activado.</p>
    </div>
  );
}
