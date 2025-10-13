import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // 🟢 AJOUT : état pour stocker la dernière prestation

  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData(); // récupère les données depuis l'API

      // 🟢 AJOUT : tri des événements par date croissante (du plus ancien au plus récent)
      if (loadedData && Array.isArray(loadedData.events)) {
        loadedData.events.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      }
      // 🟢 FIN DE L’AJOUT

      setData(loadedData); // stocke les données triées
      console.log(loadedData.events);

      // 🟢 AJOUT : calcul de la dernière prestation après tri
      const lastEvent = loadedData?.events?.length
        ? loadedData.events[loadedData.events.length - 1]
        : null;
      setLast(lastEvent);

    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return; // si data existe déjà, ne recharge pas
    getData();
  }, [data, getData]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ data, error, last }} // 🟢 MODIF : last ajouté dans le contexte
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);
export default DataContext;


