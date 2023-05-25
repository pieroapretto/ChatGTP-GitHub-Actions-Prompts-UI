import React, { useState } from "react";
import PromptService from "../services/prompts.service";

// Const
// TODO: retrieve watchers from an endpoint
// within firebase and allow adding of watchers
// through this or separate UI
import { WATCHERS, TAGS } from "../consts/mock_data";

// AntDesign components
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

const AddPrompt = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [watcher, setWatcher] = useState("")
  const [tag, setTag] = useState("")

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
      watcher: watcher,
      tag: tag
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
    setWatcher("")
    setTag("")
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
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
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
                <Select onChange={setWatcher}>
                  { WATCHERS.map((watcher, i) => 
                      <Select.Option value={watcher.value} key={`watcher-${i}`}>{ watcher.label }</Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item label='Tag'>
                <Select onChange={setTag}>
                { TAGS.map((tag, i) => 
                      <Select.Option value={tag.value} key={`tag-${i}`}>{ tag.label }</Select.Option>
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
