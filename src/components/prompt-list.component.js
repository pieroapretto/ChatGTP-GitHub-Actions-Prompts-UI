import React, { useState, useEffect } from "react";
import PromptService from "../services/prompts.service";
import PromptsListTable from "./prompt-list-table.component";

const PromptsList = () => {
  const [prompts, setPrompts] = useState(false);

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
          active: data.active,
          timestamp: data.timestamp,
          platform: data.platform,
          watchers: data.watchers,
          platformLink: data.platformLink
        });
      });

      console.log(prompts)
  
      setPrompts(prompts);
    }
  };

  return (
    <div className="row">
      <h2>Automation Prompts</h2>
      <div className="col-md-12">
        <PromptsListTable
          data={prompts}
        />
      </div>
    </div>
  );
};

export default PromptsList;