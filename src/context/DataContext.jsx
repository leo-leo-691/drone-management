import { createContext, useContext, useEffect, useState } from "react";
import { subscribeTeams, subscribeRounds } from "../services/db";

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let teamsRdy = false;
    let roundsRdy = false;

    const checkReady = () => {
      if (teamsRdy && roundsRdy) {
        setDataLoaded(true);
        setLoading(false);
      }
    };

    const unsubTeams = subscribeTeams((data) => {
      setTeams(data);
      teamsRdy = true;
      checkReady();
    });

    const unsubRounds = subscribeRounds((data) => {
      setRounds(data);
      roundsRdy = true;
      checkReady();
    }, false);

    return () => {
      unsubTeams();
      unsubRounds();
    };
  }, []);

  const value = {
    teams,
    rounds,
    loading,
    dataLoaded,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
