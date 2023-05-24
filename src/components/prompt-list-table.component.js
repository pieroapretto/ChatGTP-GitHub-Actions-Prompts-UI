import React from "react";
import { Link } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import PromptService from "../services/prompts.service";

const deletePrompt = (key) => {
    PromptService.delete(key)
      .then(() => {
        console.log('Deleted prompt with key: ' + key)
      })
      .catch((e) => {
        console.log(e);
      });
  };

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Date added',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags && tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, { key }) => (
      <Space size="middle">
        <Link to={`/edit-prompt/${key}`}><a >Edit</a></Link>
        <a onClick={() => deletePrompt(key)}>Delete</a>
      </Space>
    ),
  },
];

const PromptsListTable = ({ data }) => <Table columns={columns} dataSource={data} />;

export default PromptsListTable;