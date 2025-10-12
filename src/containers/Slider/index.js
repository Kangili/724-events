import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // 🔹 Copie et trie les événements du plus ancien au plus récent
  const byDateAsc = data?.focus
    ?.slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 🔹 Change l'image toutes les 5 secondes
   const nextCard = () => {
    setTimeout(
      () => setIndex(index < byDateAsc.length - 1 ? index + 1 : 0),
      5000
    );
  };
  useEffect(() => {
    nextCard();
  });

  return (
    <div className="SlideCardList">
      {/* 🔹 Affiche chaque slide */}
      {byDateAsc?.length > 0 && byDateAsc.map((event, idx) => (
        <div
          key={event.id || event.title} // clé unique
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`} // montre seulement l'image courante
        >
          <img src={event.cover} alt={event.title} /> {/* image */}
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div> {/* mois */}
            </div>
          </div>
        </div>
      ))}

      {/* 🔹 Pagination des slides */}
      {byDateAsc?.length > 0 && (
        <div className="SlideCard__paginationContainer">
          <div className="SlideCard__pagination">
            {byDateAsc.map((event, radioIdx) => (
              <input
                key={event.id || event.title} // clé unique
                type="radio"
                name="radio-button"
                checked={index === radioIdx} // coche l'image courante
                readOnly
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;






