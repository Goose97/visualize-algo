import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';

import { TopicCard } from 'components';

const availableTopics = [
  {
    title: 'Linked List',
    description:
      'A linked list is a series of connected "nodes" that contains the "address" of the next node. Basic operation: search, insert, delete node',
    key: 'linked_list',
  },
  {
    title: 'Array',
    description:
      'Data structure to store a collection of the same type data in continuous memory locations. Learn about some basic array sorting algorithm',
    key: 'array',
  },
  {
    title: 'Binary Search Tree',
    description:
      'A tree based data structure that quickly allows us to maintain a sorted list of numbers. Basic operation: search, insert, delete node',
    key: 'binary_search_tree',
  },
  {
    title: 'Graph',
    description:
      'A graph data structure is a collection of nodes that have data and are connected to other nodes. Learn about some basic graph traversing algorithms',
    key: 'graph',
  },
  {
    title: 'Hash Table',
    description:
      'Hash table is a data structure that represents data in the form of key-value pairs. Basic operation: get key value, insert or update key',
    key: 'hash_table',
  },
];

class Home extends Component {
  componentDidMount() {
    availableTopics.forEach(({ key }) => {
      const url = `/${key}`;
      Router.prefetch(url);
    });
  }

  render() {
    return (
      <div className='home-page__wrapper'>
        <div className='home-page-title__wrapper fx-center py-12'>
          <h2 className='home-page-title__title'>Visual Algo</h2>
        </div>

        <div className='home-page-cards__wrapper px-12 py-4'>
          {availableTopics.map(({ title, description, key }) => (
            <TopicCard
              title={title}
              description={description}
              onClick={() => Router.push(`/${key}`)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
