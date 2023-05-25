import React, { useState } from "react";
import PromptService from "../services/prompts.service";
import axios from 'axios';
import ReactMarkdown from 'react-markdown'

// Const
// TODO: retrieve watchers from an endpoint
// within firebase and allow adding of watchers
// through this or separate UI
import { WATCHERS, PLATFORMS } from "../consts/mock_data";

// AntDesign components
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { chatGenerator } from "../utils/open-ai-chat-generator";

const AddPrompt = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptContext, setPromptContext] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [demoContent, setDemoContent] = useState('');
  const [watchers, setWatchers] = useState(null)
  const [platform, setPlatform] = useState("")
  const [platformLink, setPlatformLink] = useState("")

  const getFileContent = async (url) => {
    const path = url ?? process.env.PUBLIC_URL + '/example-pr-diff.txt';
    try {
      const response = await axios.get(path);
      return response.data;
    } catch (error) {
      console.error("There was an error!", error);
    }
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangePromptContext = (e) => {
    setPromptContext(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const demoPrompt = async () => {
    const linkContent = await getFileContent();
    const demoContent = await chatGenerator(linkContent, title);

    if(typeof demoContent === "string") {
      setDemoContent(demoContent);
    }
  };

  const savePrompt = () => {
    let data = {
      title: title,
      description: description,
      active: false,
      watchers: watchers,
      platform: platform,
      platformLink: platformLink,
      context: promptContext
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
    setDemoContent("")
    setPromptContext("")
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <h2>Add Prompt</h2>
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
                  rows="3"
                  onChange={onChangeTitle}
                  id="title"
                  type="text"
                />
              </Form.Item>

              <Form.Item label="Comments">
                <Input
                  value={description}
                  onChange={onChangeDescription}
                  id="description"
                  type="text"
                />
              </Form.Item>

              <Form.Item label='Platform'>
                <Select onChange={setPlatform}>
                { PLATFORMS.map((platform, i) => 
                      <Select.Option  value={platform.value} key={`platform-${i}`}>{ platform.label }</Select.Option>
                  )}
                </Select>
              </Form.Item>

              {(platform && platform !== "none") && (
                <Form.Item label='Platform Link'>
                  <Select onChange={setPlatformLink}>
                    {PLATFORMS.map((platformLink, i) => 
                      <Select.Option value={platformLink.value} key={`platformLink-${i}`}>{ platformLink.label }</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              )}

              {(platform === "none") && (
                <Form.Item label='Prompt context'>
                  <TextArea
                    value={promptContext}
                    rows="3"
                    onChange={onChangePromptContext}
                    id="context"
                    type="text"
                  />
              </Form.Item>
              )}

              {platform && (
                <Form.Item label="Watchers">
                  <Select mode='multiple'  onChange={setWatchers}>
                    { WATCHERS.map((watcher, i) => 
                        <Select.Option value={watcher.value} key={`watcher-${i}`}>{ watcher.label }</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              )}

              <br/>

              <button onClick={savePrompt} className="btn btn-outline-success btn-md m-2">
                Submit
              </button>
              <button onClick={demoPrompt} className="btn btn-outline-info btn-md m-2">
                Demo
              </button>
            </Form>
          )}
        </div>
      </div>
      <div className="col-md-4">
        {demoContent && (
          <div>
            <h2>Demo</h2>
            <hr/>
            <ReactMarkdown>{demoContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPrompt;
