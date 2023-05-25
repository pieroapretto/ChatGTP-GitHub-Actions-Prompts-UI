import React, { useState } from "react";
import PromptService from "../services/prompts.service";

// Const
// TODO: retrieve watchers from an endpoint
// within firebase and allow adding of watchers
// through this or separate UI
import { WATCHERS, PLATFORMS } from "../consts/mock_data";

// AntDesign components
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

const AddPrompt = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [watchers, setWatchers] = useState(null)
  const [platform, setPlatform] = useState("")
  const [platformLink, setPlatformLink] = useState("")

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
      active: false,
      watchers: watchers,
      platform: platform,
      platformLink: platformLink
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
    setWatchers("")
    setPlatform("")
    setPlatformLink("")
  };

  return (
    <div className="row">
      <h2>Add Prompt</h2>
      <div className="col-md-12">
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={newPrompt}>
                Add
              </button>
            </div>
          ) : (
            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 30 }}
              layout="vertical"
            >
              <Form.Item label="New Prompt">
                <TextArea
                  value={title}
                  onChange={onChangeTitle}
                  id="title"
                  type="text"
                />
              </Form.Item>

              <Form.Item label="Description">
                <Input
                  value={description}
                  onChange={onChangeDescription}
                  id="description"
                  type="text"
                />
              </Form.Item>

              <Form.Item label="Watchers">
                <Select mode='multiple'  onChange={setWatchers}>
                  { WATCHERS.map((watcher, i) => 
                      <Select.Option value={watcher.value} key={`watcher-${i}`}>{ watcher.label }</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item label='Platform'>
                <Select onChange={setPlatform}>
                { PLATFORMS.map((platform, i) => 
                      <Select.Option  value={platform.value} key={`platform-${i}`}>{ platform.label }</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item label='Platform Link'>
              <Select onChange={setPlatformLink}>
                { PLATFORMS.map((platformLink, i) => 
                      <Select.Option value={platformLink.value} key={`platformLink-${i}`}>{ platformLink.label }</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <br />

              <button onClick={savePrompt} className="btn btn-outline-success">
                Submit
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPrompt;
