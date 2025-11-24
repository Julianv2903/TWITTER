// pages/profile.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id;
    if (!uid) {
      setLoading(false);
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      setUsername(data?.username ?? '');
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id;
    if (!uid) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', uid);

    if (error) {
      alert('Error actualizando: ' + error.message);
    } else {
      alert('Perfil actualizado');
      loadProfile();
    }
  };

  if (loading) return <div>Cargando...</div>;

  if (!profile) return <div>No autenticado. <a href="/auth/login">Inicia sesión</a></div>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1>Mi perfil</h1>
      <form onSubmit={handleUpdate}>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <button type="submit">Actualizar</button>
      </form>
      <div style={{ marginTop: 20 }}>
        <strong>Creado:</strong> {new Date(profile.created_at).toLocaleString()}
      </div>
      <button onClick={async () => { await supabase.auth.signOut(); location.reload(); }}>Cerrar sesión</button>
    </div>
  );
}
