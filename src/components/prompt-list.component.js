import React, { useState, useEffect, Fragment } from "react";
import PromptService from "../services/prompts.service";

import EditPrompt from "./edit-prompt.component";

const PromptsList = () => {
  const [prompts, setPrompts] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const unsubscribe = PromptService.getAll().on("value", onDataChange);

    return () => {
      PromptService.getAll().off("value", onDataChange);
      unsubscribe();
    };
  }, []);

  const onDataChange = (items) => {
    let prompts = [];

    if(items) {
      items.forEach((item) => {
        let key = item.key;
        let data = item.val();
        prompts.push({
          key: key,
          title: data.title,
          description: data.description,
          published: data.published,
        });
      });

      console.log(prompts)
  
      setPrompts(prompts);
    }
  };

  const refreshList = () => {
    setCurrentPrompt(null);
    setCurrentIndex(-1);
  };

  const setActivePrompt = (prompt, index) => {
    setCurrentPrompt(prompt);
    setCurrentIndex(index);
  };

  const removeAllPrompts = () => {
    PromptService.deleteAll()
      .then(() => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-6">
        <div className="list-group">
          {prompts &&
            prompts.map((prompt, index) => (
              <button
                className={
                  "list-group-item list-group-item-action " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActivePrompt(prompt, index)}
                key={prompt.key}
              >
                {prompt.title}
              </button>
            ))}
            {prompts && (
              <Fragment>
                <br/>
                <button
                  className="m-3 btn btn-sm btn-outline-danger remove-all-btn"
                  onClick={removeAllPrompts}
                >
                  Delete All Prompts
                </button>
              </Fragment>
          )}
        </div>
      </div>
      <div className="col-md-6">
        {currentPrompt && (
          <EditPrompt
            prompt={currentPrompt}
            refreshList={refreshList}
          />
        )}
      </div>
    </div>
  );
};

export default PromptsList;