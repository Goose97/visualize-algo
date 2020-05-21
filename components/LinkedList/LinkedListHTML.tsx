import React, { Component } from 'react';

import { CustomDropDown } from 'components';

export class LinkedListHTML extends Component {
  render() {
    const options = [
      {
        label: 'Search',
        value: 'search',
      },
      {
        label: 'Insert',
        value: 'insert',
      },
      {
        label: 'Delete',
        value: 'delete',
      },
    ];
    return (
      <CustomDropDown options={options} onSelect={e => console.log('e', e)} />
    );
  }
}

export default LinkedListHTML;
