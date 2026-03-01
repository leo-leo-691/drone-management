import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// --- ROUNDS ---
const ROUNDS_COLL = "rounds";

export const initRounds = async () => {
  const roundIds = ["round1", "round2", "round3"];

  for (const id of roundIds) {
    const ref = doc(db, ROUNDS_COLL, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        title:
          id === "round1" ? "Round 1" : id === "round2" ? "Round 2" : "Round 3",
        visible: false,
        published: false,
        groundPenalty: 10, // Configurable penalty for ground touches
      });
    }
  }
};

export const subscribeRounds = (callback, publicOnly = false) => {
  let q;
  if (publicOnly) {
    q = query(collection(db, ROUNDS_COLL), where("visible", "==", true));
  } else {
    q = query(collection(db, ROUNDS_COLL));
  }

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by ID (round1, round2, round3)
      data.sort((a, b) => a.id.localeCompare(b.id));
      callback(data);
    },
    (error) => {
      console.error("Error subscribing to rounds:", error);
      callback([]); // Fallback
    },
  );
};

export const updateRoundStatus = async (roundId, data) => {
  await updateDoc(doc(db, ROUNDS_COLL, roundId), data);
};

// --- OBSTACLES (SUBCOLLECTION) ---
// Path: rounds/{roundId}/obstacles

export const subscribeObstacles = (roundId, callback) => {
  const q = query(
    collection(db, ROUNDS_COLL, roundId, "obstacles"),
    orderBy("order", "asc"),
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
};

export const addObstacle = async (roundId, obstacleData) => {
  // Ensure numeric types
  const data = {
    ...obstacleData,
    maxPoints: Number(obstacleData.maxPoints),
    touchPenalty: Number(obstacleData.touchPenalty),
    crashPenalty: Number(obstacleData.crashPenalty),
    order: Number(obstacleData.order),
  };
  await addDoc(collection(db, ROUNDS_COLL, roundId, "obstacles"), data);
};

export const updateObstacle = async (roundId, obstacleId, data) => {
  // Ensure numeric types if present in update
  const cleanData = { ...data };
  if (cleanData.maxPoints !== undefined)
    cleanData.maxPoints = Number(cleanData.maxPoints);
  if (cleanData.touchPenalty !== undefined)
    cleanData.touchPenalty = Number(cleanData.touchPenalty);
  if (cleanData.crashPenalty !== undefined)
    cleanData.crashPenalty = Number(cleanData.crashPenalty);
  if (cleanData.order !== undefined) cleanData.order = Number(cleanData.order);

  await updateDoc(
    doc(db, ROUNDS_COLL, roundId, "obstacles", obstacleId),
    cleanData,
  );
};

export const deleteObstacle = async (roundId, obstacleId) => {
  await deleteDoc(doc(db, ROUNDS_COLL, roundId, "obstacles", obstacleId));
};

// --- TEAMS ---
const TEAMS_COLL = "teams";

export const subscribeTeams = (callback) => {
  const q = query(collection(db, TEAMS_COLL), orderBy("totalScore", "desc"));
  return onSnapshot(q, (snap) => {
    const teams = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(teams);
  });
};

export const addTeam = async (name) => {
  const newTeam = {
    name,
    status: "Active",
    reEntryCount: 0,
    eliminatedInRound: 0,
    totalTime: 0,
    totalScore: 0,
  };
  await addDoc(collection(db, TEAMS_COLL), newTeam);
};

export const updateTeam = async (teamId, data) => {
  await updateDoc(doc(db, TEAMS_COLL, teamId), data);
};

export const deleteTeam = async (teamId) => {
  await deleteDoc(doc(db, TEAMS_COLL, teamId));
};

// --- SETTINGS / ARENA STATS ---
const SETTINGS_COLL = "settings";

export const subscribeArenaSettings = (callback) => {
  return onSnapshot(doc(db, SETTINGS_COLL, "arena"), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback({ trackTemp: "22" }); // Default
    }
  });
};

export const updateArenaSettings = async (data) => {
  await setDoc(doc(db, SETTINGS_COLL, "arena"), data, { merge: true });
};

// --- EVENTS ---
const EVENTS_COLL = "events";

export const subscribeEvents = (callback) => {
  const q = query(collection(db, EVENTS_COLL), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(events);
  });
};

export const addEvent = async (text, type = "info") => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  await addDoc(collection(db, EVENTS_COLL), {
    event: text,
    time: timeStr,
    type: type,
    timestamp: now,
  });
};

export const deleteEvent = async (eventId) => {
  await deleteDoc(doc(db, EVENTS_COLL, eventId));
};

export const updateEvent = async (eventId, text, type) => {
  await updateDoc(doc(db, EVENTS_COLL, eventId), {
    event: text,
    type: type,
  });
};
