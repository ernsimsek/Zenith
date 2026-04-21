/**
 * Jamendo API — free catalog (Creative Commons). Register: https://devportal.jamendo.com/
 * Docs: https://developer.jamendo.com/v3.0
 */

const BASE = 'https://api.jamendo.com/v3.0';

const clientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;

export function isJamendoConfigured() {
  return Boolean(clientId?.trim());
}

function assertClient() {
  if (!clientId?.trim()) {
    throw new Error('Missing VITE_JAMENDO_CLIENT_ID. Register at https://devportal.jamendo.com/');
  }
}

async function getJSON(path, params = {}) {
  assertClient();
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('client_id', clientId.trim());
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Jamendo API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/** Map Jamendo track row → shape expected by TrackRow / player (plus source). */
export function normalizeJamendoTrack(rec) {
  if (!rec) return null;
  const stream = rec.audio || rec.audiodownload || null;
  return {
    id: `jamendo:${rec.id}`,
    jamendoId: String(rec.id),
    source: 'jamendo',
    title: rec.name,
    artists: [{ id: String(rec.artist_id), name: rec.artist_name }],
    artistName: rec.artist_name || '',
    album: rec.album_id
      ? {
          id: String(rec.album_id),
          name: rec.album_name || '',
          image: rec.album_image || rec.image,
          images: (rec.album_image || rec.image) ? [{ url: rec.album_image || rec.image }] : [],
        }
      : null,
    duration: rec.duration ? Number(rec.duration) : 0,
    previewUrl: stream,
    uri: rec.shareurl || null,
    popularity: rec.popularity_total ? Number(rec.popularity_total) : 0,
  };
}

export function jamendoArtistToUi(rec) {
  if (!rec) return null;
  return {
    id: String(rec.id),
    name: rec.name,
    images: rec.image ? [{ url: rec.image }] : [],
  };
}

export function normalizeJamendoArtist(rec) {
  if (!rec) return null;
  return {
    id: String(rec.id),
    source: 'jamendo',
    name: rec.name,
    images: rec.image ? [{ url: rec.image }] : [],
  };
}

export function normalizeJamendoAlbum(rec) {
  if (!rec) return null;
  return {
    id: String(rec.id),
    source: 'jamendo',
    name: rec.name,
    artists: rec.artist_name ? [{ id: String(rec.artist_id || ''), name: rec.artist_name }] : [],
    images: rec.image ? [{ url: rec.image }] : [],
  };
}

export function normalizeJamendoPlaylist(rec) {
  if (!rec) return null;
  return {
    id: String(rec.id),
    source: 'jamendo',
    name: rec.name,
    images: rec.image ? [{ url: rec.image }] : [],
    owner: { display_name: 'Jamendo' },
    tracks: { total: rec.track_count != null ? Number(rec.track_count) : undefined },
  };
}

export const jamendo = {
  popularTracks(limit = 24) {
    return getJSON('/tracks/', {
      limit: String(limit),
      order: 'popularity_total',
      audioformat: 'mp32',
    }).then((d) => (d.results || []).map(normalizeJamendoTrack).filter(Boolean));
  },

  popularArtists(limit = 12) {
    return getJSON('/artists/', {
      limit: String(limit),
      order: 'popularity_total',
    }).then((d) => (d.results || []).map(normalizeJamendoArtist).filter(Boolean));
  },

  popularAlbums(limit = 18) {
    return getJSON('/albums/', {
      limit: String(limit),
      order: 'popularity_total',
    }).then((d) => (d.results || []).map(normalizeJamendoAlbum).filter(Boolean));
  },

  async searchAll(q, limit = 12) {
    const lim = String(limit);
    const [tr, ar, al, pl] = await Promise.all([
      getJSON('/tracks/', { namesearch: q, limit: lim, order: 'popularity_total', audioformat: 'mp32' }).catch(
        () => ({ results: [] })
      ),
      getJSON('/artists/', { namesearch: q, limit: lim }).catch(() => ({ results: [] })),
      getJSON('/albums/', { namesearch: q, limit: lim }).catch(() => ({ results: [] })),
      getJSON('/playlists/', { namesearch: q, limit: lim }).catch(() => ({ results: [] })),
    ]);
    return {
      tracks: (tr.results || []).map(normalizeJamendoTrack).filter(Boolean),
      artists: (ar.results || []).map(normalizeJamendoArtist).filter(Boolean),
      albums: (al.results || []).map(normalizeJamendoAlbum).filter(Boolean),
      playlists: (pl.results || []).map(normalizeJamendoPlaylist).filter(Boolean),
    };
  },

  tracksByTag(tag, limit = 24) {
    return getJSON('/tracks/', {
      tags: tag,
      limit: String(limit),
      order: 'popularity_total',
      audioformat: 'mp32',
    }).then((d) => (d.results || []).map(normalizeJamendoTrack).filter(Boolean));
  },

  featuredPlaylists(limit = 20) {
    return getJSON('/playlists/', {
      limit: String(limit),
      order: 'popularity_total',
    }).then((d) => (d.results || []).map(normalizeJamendoPlaylist).filter(Boolean));
  },

  getArtist(id) {
    return getJSON('/artists/', { id: String(id) }).then((d) => jamendoArtistToUi((d.results || [])[0]));
  },

  async getArtistTopTracks(artistId, limit = 12) {
    const d = await getJSON('/tracks/', {
      artist_id: String(artistId),
      limit: String(limit),
      order: 'popularity_total',
      audioformat: 'mp32',
    });
    return (d.results || []).map(normalizeJamendoTrack).filter(Boolean);
  },

  getAlbum(id) {
    return getJSON('/albums/', { id: String(id) }).then((d) => {
      const rec = (d.results || [])[0];
      if (!rec) return null;
      return {
        id: String(rec.id),
        name: rec.name,
        images: rec.image ? [{ url: rec.image }] : [],
        artists: rec.artist_name ? [{ id: String(rec.artist_id), name: rec.artist_name }] : [],
      };
    });
  },

  async getAlbumTracks(albumId) {
    const d = await getJSON('/albums/tracks/', {
      id: String(albumId),
      audioformat: 'mp32',
    });
    const albumRow = (d.results || [])[0];
    if (!albumRow?.tracks?.length) return [];
    return albumRow.tracks.map((t) =>
      normalizeJamendoTrack({
        id: t.id,
        name: t.name,
        duration: t.duration,
        artist_id: albumRow.artist_id,
        artist_name: albumRow.artist_name,
        album_id: albumRow.id,
        album_name: albumRow.name,
        album_image: albumRow.image,
        image: albumRow.image,
        audio: t.audio,
        audiodownload: t.audiodownload,
      })
    );
  },

  getPlaylist(id) {
    return getJSON('/playlists/', { id: String(id) }).then((d) => {
      const rec = (d.results || [])[0];
      if (!rec) return null;
      return {
        id: String(rec.id),
        name: rec.name,
        images: rec.image ? [{ url: rec.image }] : [],
        owner: { display_name: rec.user_name || 'Jamendo' },
        tracks: { total: rec.track_count != null ? Number(rec.track_count) : undefined },
      };
    });
  },

  async getPlaylistTracks(playlistId, limit = 80) {
    const d = await getJSON('/playlists/tracks/', {
      id: String(playlistId),
      limit: String(limit),
      audioformat: 'mp32',
      track_type: 'single albumtrack',
    });
    const pl = (d.results || [])[0];
    if (!pl?.tracks?.length) return [];
    return pl.tracks.map((t) =>
      normalizeJamendoTrack({
        id: t.id,
        name: t.name,
        duration: t.duration,
        artist_id: t.artist_id,
        artist_name: t.artist_name,
        album_id: t.album_id,
        album_name: t.album_name,
        album_image: t.album_image || t.image,
        image: t.image,
        audio: t.audio,
        audiodownload: t.audiodownload,
      })
    );
  },
};

export default jamendo;
