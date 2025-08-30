import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Filtrage par type
  const filteredByType = (data?.events || []).filter(
    (event) => !type || event.type === type
  );

  // ✅ Pagination
  const filteredEvents = filteredByType.filter(
    (event, index) =>
      index >= (currentPage - 1) * PER_PAGE &&
      index < currentPage * PER_PAGE
  );

  // ✅ Liste des types
  const typeList = new Set(data?.events?.map((event) => event.type) || []);

  const pageNumber = Math.ceil(filteredByType.length / PER_PAGE);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            value={type || ""} 
            onChange={(value) => changeType(value || null)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => {
              const page = n + 1;
              return (
                <a key={page} href="#events" onClick={() => setCurrentPage(page)}>
                  {page}
                </a>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
export default EventList;


