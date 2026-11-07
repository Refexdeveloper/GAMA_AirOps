import { v4 as uuidv4 } from 'uuid';

// Function to load the map from sessionStorage
function loadMapFromSessionStorage(key) {
  const storedMap = sessionStorage.getItem(key);
  return storedMap ? new Map(JSON.parse(storedMap)) : new Map();
}

// Function to save the map to sessionStorage
function saveMapToSessionStorage(key, map) {
  sessionStorage.setItem(key, JSON.stringify(Array.from(map.entries())));
}

const idToUuidMap = loadMapFromSessionStorage('idToUuidMap');
const uuidToIdMap = loadMapFromSessionStorage('uuidToIdMap');

// Function to get or create UUID for an integer ID
function getUuidForId(id) {
  if (!idToUuidMap.has(id)) {
    const uuid = uuidv4();
    idToUuidMap.set(id, uuid);
    uuidToIdMap.set(uuid, id);
    saveMapToSessionStorage('idToUuidMap', idToUuidMap);
    saveMapToSessionStorage('uuidToIdMap', uuidToIdMap);
  }
  return idToUuidMap.get(id);
}

// Function to get ID from a UUID
function getIdFromUuid(uuid) {
  return uuidToIdMap.get(uuid);
}
function fID(prefix, id) {
  return `${prefix}-${String(id).padStart(4, '0')}`;
}

export { fID, getUuidForId, getIdFromUuid };
