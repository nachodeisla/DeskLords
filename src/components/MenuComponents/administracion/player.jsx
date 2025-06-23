import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(getEmptyForm());

  function getEmptyForm() {
    return {
      status: 'active',
      name: '',
      surname: '',
      displayName: '',
      profile_img: '',
      player_level: 0,
      owned_decks: [],
      actual_map: '',
      actual_map_level: 0,
      rol: 'Player'
    };
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function getUserToken() {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("Usuario no autenticado"));
      });
    });
    return user.getIdToken();
  }

  async function fetchPlayers() {
    try {
      const token = await getUserToken();
      const res = await fetch(`https://api-meafpnv6bq-ew.a.run.app/api/getPlayers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setPlayers(data.data.players);
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
    }
  }

  async function deletePlayer(id) {
    try {
      const token = await getUserToken();
      const res = await fetch(`https://api-meafpnv6bq-ew.a.run.app/api/deletePlayer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idPlayer: id })
      });
      if (res.ok) {
        setPlayers(players.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error al borrar jugador:', error);
    }
  }

  async function savePlayer(e) {
    e.preventDefault();
    if (!editingPlayer) return;

    try {
      const token = await getUserToken();
      const url = `https://api-meafpnv6bq-ew.a.run.app/api/updatePlayer`;

      const payload = {
        idPlayer: editingPlayer._id,
        data: formData
      };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchPlayers();
        setEditingPlayer(null);
        setIsCreating(false);
        setFormData(getEmptyForm());
      }
    } catch (error) {
      console.error('Error al guardar jugador:', error);
    }
  }

  function openEdit(player) {
    setEditingPlayer(player);
    setIsCreating(false);
    setFormData({
      status: player.status || 'active',
      name: player.name || '',
      surname: player.surname || '',
      displayName: player.displayName || '',
      profile_img: player.profile_img || '',
      player_level: player.player_level || 0,
      owned_decks: player.owned_decks || [],
      actual_map: player.actual_map || '',
      actual_map_level: player.actual_map_level || 0,
      rol: player.rol || 'Player'
    });
  }

  return (
    <div>
      <h2>Lista de Jugadores</h2>
      <div className="table-scroll-wrapper">
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Status</th>
              <th>Nivel</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player._id}>
                <td>{player.name} {player.surname}</td>
                <td>{player.displayName}</td>
                <td>{player.status}</td>
                <td>{player.player_level ?? 0}</td>
                <td>{player.rol}</td>
                <td>
                  <button onClick={() => openEdit(player)}>Editar</button>
                  <button onClick={() => deletePlayer(player._id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingPlayer) && (
        <div className="modal-overlay">
          <form onSubmit={savePlayer}>
            <h3>{editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>

            <label>Nombre:</label>
            <input
              type="text"
              value={formData.name}
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              title="Solo letras y espacios"
            />

            <label>Apellidos:</label>
            <input
              type="text"
              value={formData.surname}
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
              onChange={e => setFormData({ ...formData, surname: e.target.value })}
              required
              title="Solo letras y espacios"
            />

            <label>Display Name:</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              required
            />

            <label>Estado:</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              {['active', 'suspended', 'banned', 'deleted'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <label>Imagen de perfil:</label>
            <input
              type="text"
              value={formData.profile_img}
              onChange={e => setFormData({ ...formData, profile_img: e.target.value })}
            />

            <label>Nivel de jugador:</label>
            <input
              type="number"
              value={formData.player_level}
              onChange={e => setFormData({ ...formData, player_level: parseInt(e.target.value) || 0 })}
            />

            <label>Mapa actual:</label>
            <input
              type="text"
              value={formData.actual_map}
              onChange={e => setFormData({ ...formData, actual_map: e.target.value })}
            />

            <label>Nivel en el mapa:</label>
            <input
              type="number"
              value={formData.actual_map_level}
              onChange={e => setFormData({ ...formData, actual_map_level: parseInt(e.target.value) || 0 })}
            />

            <label>Rol:</label>
            <select
              value={formData.rol}
              onChange={e => setFormData({ ...formData, rol: e.target.value })}
              required
            >
              <option value="Player">Player</option>
              <option value="Admin">Admin</option>
            </select>

            <br /><br />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => { setEditingPlayer(null); setIsCreating(false); }}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PlayersList;
