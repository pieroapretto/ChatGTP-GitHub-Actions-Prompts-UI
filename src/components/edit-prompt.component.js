import React, { useState, useEffect } from "react";
import PromptService from "../services/prompts.service";
import { useParams } from "react-router-dom";
import { Version3Client } from 'jira.js'

import { WATCHERS, PLATFORMS } from "../consts/mock_data";

import { Form, Input, Select } from "antd";

// TODO - relocate to service
const client = new Version3Client({
  host: "https://incisent-labs.atlassian.net",
  authentication: {
    basic: {
      email: '<Enter JIRA email>',
      apiToken: '<Enter JIRA API Token>'
    }
  }
})

/**
 * TODO: We will want to create a backend to handle calls w/ CORS involvment
 * @param {*} ticketId 
 */
  const runJira = async () => {
    const projects = await client.projects.getAllStatuses()
    console.log(projects)
  }

const EditPrompt = (props) => {
  const [currentPrompt, setCurrentPrompt] = useState({
    key: null,
    title: "",
    description: "",
    active: false,
    platform: "",
    platformLink: "",
    watchers: [],
  });
  const [message, setMessage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const dbRef = PromptService.getAll().child(id);
    dbRef.on("value", (snapshot) => {
      setCurrentPrompt({...snapshot.val(), key: id});
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

  const onChangePlatform = (e) => {
    const platform = e;
    setCurrentPrompt((prevState) => ({
      ...prevState,
      platform: platform,
    }));
  };

  const onChangePlatformLink = (e) => {
    const platformLink = e.target.value;
    setCurrentPrompt((prevState) => ({
      ...prevState,
      platformLink: platformLink,
    }));
  };

  const onChangeWatchers = (e) => {
    const updatedWatchers = e
    setCurrentPrompt((prevState) => ({
      ...prevState,
      watchers: updatedWatchers
    }))
  }

  const updateActive = (status) => {
    PromptService.update(currentPrompt.key, {
      active: status,
    })
      .then(() => {
        setCurrentPrompt((prevState) => ({
          ...prevState,
          active: status,
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
      platform: currentPrompt.platform,
      platformLink: currentPrompt.platformLink,
      watchers: currentPrompt.watchers,
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
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 50 }}
            layout="vertical"
          >
            <Form.Item label="New Prompt">
              <Input
                value={currentPrompt.title}
                onChange={onChangeTitle}
                id="title"
                type="text"
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input
                value={currentPrompt.description}
                onChange={onChangeDescription}
                id="description"
                type="text"
              />
            </Form.Item>

            <Form.Item label="Watchers">
              <Select
                mode="multiple"
                onChange={onChangeWatchers}
                value={WATCHERS.filter((watcher) => currentPrompt.watchers?.includes(watcher.value) ? watcher : null)}>
                {WATCHERS.map((watcher, i) => (
                  <Select.Option value={watcher.value} key={`watcher-${i}`}>
                    {watcher.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Platform">
              <Select
                value={currentPrompt.platform}
                onChange={onChangePlatform}
              >
                {PLATFORMS.map((platform, i) => (
                  <Select.Option value={platform.value} key={`platform-${i}`}>
                    {platform.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Platform Link">
              <Input
                value={currentPrompt.platformLink}
                onChange={onChangePlatformLink}/>
                <button
                  // onClick={() => runJira(currentPrompt.platformLink)}
                  className="btn btn-outline-success btn-sm mt-2">Run GPT for JIRA</button>
            </Form.Item>
          </Form>

          {currentPrompt.active ? (
            <button
              className="btn btn-outline-secondary btn-sm m-2"
              onClick={() => updateActive(false)}
            >
              Deactivate
            </button>
          ) : (
            <button
              className="btn btn-outline-success btn-sm m-2"
              onClick={() => updateActive(true)}
            >
              Activate
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
