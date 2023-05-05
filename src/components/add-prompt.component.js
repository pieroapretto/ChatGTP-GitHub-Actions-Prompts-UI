import React, { useState } from "react";
import PromptService from "../services/prompts.service";

const AddPrompt = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const savePrompt = () => {
    let data = {
      title: title,
      description: description,
      published: false,
    };

    PromptService.create(data)
      .then(() => {
        console.log("Created new item successfully!");
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newPrompt = () => {
    setTitle("");
    setDescription("");
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newPrompt}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">New Prompt</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={title}
              onChange={onChangeTitle}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={description}
              onChange={onChangeDescription}
              name="description"
            />
          </div>
          <br/>
          <button onClick={savePrompt} className="btn btn-outline-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPrompt;