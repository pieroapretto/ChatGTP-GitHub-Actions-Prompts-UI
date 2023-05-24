import React, { useState, useEffect } from "react";
import PromptService from "../services/prompts.service";
import { useParams } from 'react-router-dom';

const EditPrompt = (props) => {
  const [currentPrompt, setCurrentPrompt] = useState({
    key: null,
    title: "",
    description: "",
    published: false,
  });
  const [message, setMessage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const dbRef = PromptService.getAll().child(id);
    dbRef.on('value', (snapshot) => {
      setCurrentPrompt(snapshot.val());
    });

    // Don't forget to unsubscribe from your realtime subscription on unmount
    return () => dbRef.off();
  }, [id]);

  const onChangeTitle = (e) => {
    const title = e.target.value;
    setCurrentPrompt((prevState) => ({
      ...prevState,
      title: title,
    }));
  };

  const onChangeDescription = (e) => {
    const description = e.target.value;
    setCurrentPrompt((prevState) => ({
      ...prevState,
      description: description,
    }));
  };

  const updatePublished = (status) => {
    PromptService.update(currentPrompt.key, {
      published: status,
    })
      .then(() => {
        setCurrentPrompt((prevState) => ({
          ...prevState,
          published: status,
        }));
        setMessage("The status was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updatePrompt = () => {
    const data = {
      title: currentPrompt.title,
      description: currentPrompt.description,
    };

    PromptService.update(currentPrompt.key, data)
      .then(() => {
        setMessage("The prompt was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePrompt = () => {
    PromptService.delete(currentPrompt.key)
      .then(() => {
        props.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="row">
      <h2>Edit Prompt</h2>
      <div className="col-md-12"></div>
      {currentPrompt && (
        <div className="edit-form">
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={currentPrompt.title}
                onChange={onChangeTitle}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={currentPrompt.description}
                onChange={onChangeDescription}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentPrompt.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentPrompt.published ? (
            <button
              className="btn btn-outline-secondary btn-sm m-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="btn btn-outline-success btn-sm m-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button
            type="submit"
            className="btn btn-outline-info btn-sm m-2"
            onClick={updatePrompt}
          >
            Update
          </button>
          <button
            className="btn btn-outline-danger btn-sm m-2"
            onClick={deletePrompt}
          >
            Delete
          </button>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default EditPrompt;
