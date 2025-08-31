import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(""); // État pour afficher confirmation ou erreur

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);

      try {
        await mockContactApi(); // envoi simulé
        setSending(false);
        const successMsg = "Votre message a bien été envoyé !";
        setMessage(successMsg); // met à jour le message
        onSuccess(successMsg);  // appelle la fonction parent si nécessaire
      } catch (err) {
        setSending(false);
        const errorMsg = "Erreur lors de l'envoi.";
        setMessage(errorMsg);   // met à jour le message
        onError(errorMsg);      // appelle la fonction parent si nécessaire
      }
    },
    [onSuccess, onError]
  );

  return (
    <>
      <form onSubmit={sendContact}>
        <div className="row">
          <div className="col">
            <Field placeholder="" label="Nom" />
            <Field placeholder="" label="Prénom" />
            <Select
              selection={["Personel", "Entreprise"]}
              onChange={() => null}
              label="Personel / Entreprise"
              type="large"
              titleEmpty
            />
            <Field placeholder="" label="Email" />
            <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
              {sending ? "En cours" : "Envoyer"}
            </Button>
          </div>
          <div className="col">
            <Field
              placeholder="message"
              label="Message"
              type={FIELD_TYPES.TEXTAREA}
            />
          </div>
        </div>
      </form>

      {/* Affichage du message de confirmation ou d'erreur */}
      {message && <p>{message}</p>}
    </>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;

