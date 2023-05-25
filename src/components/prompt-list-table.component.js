import React from "react";
import { Link } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import PromptService from "../services/prompts.service";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


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
    title: 'Watchers',
    key: 'watchers',
    dataIndex: 'watchers',
    render: (_, { watchers }) => (
      <>
        {watchers && watchers.map((watcher) => {
          let color = watcher.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={color} key={watcher}>
              {watcher.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Platform',
    dataIndex: 'platform',
    key: 'platform',  
    render: (_, { platform }) => {
      if (platform) {
        const color = platform.length > 5 ? 'blue' : 'green'
        return (
          <div style={{ color: color }}>
            {platform.toUpperCase()}
          </div>
        )
      }
    }
  },
  {
    title: 'Status',
    dataIndex: 'active',
    key: 'active',
    align: 'center',
    render: (_, { active }) => {
      if (active) return <CheckCircleOutlined style={{ color: 'green' }} />
      else return <CloseCircleOutlined style={{ color: 'red' }}/>
    }
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

const PromptsListTable = ({ data }) => {
  return <Table columns={columns} dataSource={data} />;
}

export default PromptsListTable;