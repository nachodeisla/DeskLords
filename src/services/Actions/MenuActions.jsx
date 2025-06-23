import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";


import axios from 'axios';

// version mock cargaInformacion

// import Informacion from '../../../public/mockCalls/info.json';

export async function cargaInformacion() {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("Usuario no autenticado"));
      });
    });
    const userToken = await user.getIdToken();
    console.log(user);
    const payload = {
      playerId: user.uid,
    };
    const response = await fetch(
      "https://api-meafpnv6bq-ew.a.run.app/api/getPlayerInfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la información del juego");
    }

    const data = await response.json();
    //  const data = response;
    return data.data;
    // return Informacion;
  } catch (error) {
    console.error("Error al cargar la información:", error);
    throw error;
  }
}

// version real llamarPartida

// import InformacionPartida from '../../../public/mockCalls/infoPartida.json';

// export const cargarPartida = async (deckId, mapa) => {
//   try {
//     const response = await fetch('http://localhost:8080/api/gmae', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         deckId: deckId,
//         mapaId: mapa._id,
//         mapaNombre: mapa.nombre
//       })
//     });

//     if (!response.ok) {
//       throw new Error('No se pudo iniciar la partida');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error al iniciar partida:', error);
//     throw error;
//   }
// };

// export async function cargarPartida  (deckId, map) {


// useLoadMatch(deckId, map._id);
// };

export async function cargarPartida(deckId, mapId) {
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("Usuario no autenticado"));
    });
  });

  const userToken = await user.getIdToken();

  const payload = {
    playerId: user.uid,
    map: { id: mapId },
    user: { deck: { id: deckId } },
  };

  const response = await fetch(
    "https://api-meafpnv6bq-ew.a.run.app/api/startGame",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  return data.data;
}

//version real decks
// import mazos from '../../../public/mockCalls/decks.json';

/*
export const getDecks = async (userId) => {
  try {
    const response = await fetch(`/api/decks/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los decks');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getDecks:', error);
    throw error;
  }
};*/

// export const getDecks = async () => {
//   try {
//     const response = await fetch('../../../public/mockCalls/decks.json');
//     if (!response.ok) {
//       throw new Error('Error al obtener los decks');
//     }

//     const data = await response.json();

//     // Si quieres filtrar por userId, puedes hacerlo aquí si el JSON lo soporta
//     // return data.filter(deck => deck.userId === userId);

//     return data;
//   } catch (error) {
//     console.error('Error en getDecks:', error);
//     throw error;
//   }
// };

// services/Actions/CompraActions.js

export const buyProduct = async (producto) => {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("Usuario no autenticado"));
      });
    });
    const userToken = await user.getIdToken();

    const response = await fetch("https://api-meafpnv6bq-ew.a.run.app/api/buyItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        playerId: user.uid,
        productId: producto.id,
        productType: producto.type,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la compra");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en buyProduct:", error);
    throw error;
  }
};



export const setAvatarPrincipal = async (avatarId, setData) => {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("Usuario no autenticado"));
      });
    });

    const userToken = await user.getIdToken();

    const response = await fetch(`https://api-meafpnv6bq-ew.a.run.app/api/changeAvatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        playerId: user.uid,
        avatarId: avatarId,
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el avatar.");
    }

    const newAvatar = await response.json();
    setData((prev) => ({
      ...prev,
      playerAvatar: newAvatar.data.playerAvatar,
    }));

  } catch (error) {
    console.error("Error al actualizar avatar:", error);
    throw error;
  }
};



export const switchName = async (newName, setData) => {
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("Usuario no autenticado"));
    });
  });
  const userToken = await user.getIdToken();

  const response = await fetch(`https://api-meafpnv6bq-ew.a.run.app/api/updatePlayer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      idPlayer: user.uid,
      data: {displayName: newName},
    }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el nombre");
  }

  setData((prev) => ({
    ...prev,
    playerName: newName,
  }));
};



export async function getComments(page = 1, author) {
  console.log()
  try {
    const params = { page };
    if (author) params.author = author;
    const response = await axios.get("https://api-meafpnv6bq-ew.a.run.app/api/getCommentsLimited", {
      params,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return { comments: [], hasMore: false };
  }
}




export async function AddComment(comment) {
  try {
   const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("Usuario no autenticado"));
      });
    });
    const userToken = await user.getIdToken();


    const response = await fetch("https://api-meafpnv6bq-ew.a.run.app/api/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${userToken}`,
      },
       body: JSON.stringify({
        playerId: user.uid,
        // fecha: new Date().toISOString(),
        content: comment,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el mensaje");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    return data;
  } catch (error) {
    console.error("Error al enviar mensaje al servidor:", error);
    return null;
  }
}





