import React, { Component } from 'react';
import { pick, groupBy } from 'lodash';

import withDSCore, { WithDSCore } from 'hocs/withDSCore';
import KeyList from './KeyList';
import HashFunction from './HashFunction';
import MemoryArray from './MemoryArray';
import HashTableHTML from './HashTableHTML';
import HashIndicationArrow from './HashIndicationArrow';
import { IProps, IState } from './index.d';
import transformHashTableModel from 'transformers/HashTable';
import { HashTable } from 'types/ds/HashTable';
import { caculateKeyHash, initLinearProbeHashTableData } from './helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';

type PropsWithHoc = IProps & WithDSCore<HashTable.Model>;

export class HashTableDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      keyAboutToBeAdded: [],
      keyAboutToBeDeleted: [],
    };
    this.wrapperRef = React.createRef();

    // Register custom transformer
    props.registerCustomTransformer({
      delete: this.delete,
    });

    // Register HTML injector
    props.registerHTMLInjector(this.injectHTMLIntoCanvas);
  }

  static initHashTableModel(props: PropsWithHoc): HashTable.Model {
    const { initialData, collisionResolution } = props;

    switch (collisionResolution) {
      case 'chaining': {
        const keys = Object.entries(initialData).map(([key, value]) => ({
          key,
          value,
          address: caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE),
        }));

        return {
          keys,
          memoryAddresses: HashTableDS.produceMemoryAddressesFromKeys(keys),
        };
      }

      case 'linearProbe': {
        return initLinearProbeHashTableData(initialData);
      }
    }
  }

  static produceMemoryAddressesFromKeys(
    keys: HashTable.Model['keys'],
  ): HashTable.Model['memoryAddresses'] {
    let memoryAddresses = keys.map(({ key, value }) => ({
      key: caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE),
      value,
    }));
    return Object.entries(groupBy(memoryAddresses, ({ key }) => key)).map(
      ([address, values]) => ({
        key: +address,
        values: values.map(({ value }) => value),
        // highlight: address === '7',
      }),
    );
  }

  delete = (model: HashTable.Model, [key]: [string]) => {
    const { keyAboutToBeDeleted } = this.state;
    const { updateModel } = this.props;
    this.setState({ keyAboutToBeDeleted: keyAboutToBeDeleted.concat(key) });
    setTimeout(() => {
      // wait for the animation to finish
      updateModel(transformHashTableModel(model, 'delete', [key]));
    }, 1000);

    return model;
  };

  handlePointerLinkAnimationEnd = (key: string, animationName: string) => {
    const { model } = this.props;
    // if (animationName === 'appear') {
    //   this.setState({
    //     hashTableModel: transformHashTableModel(hashTableModel, 'toggleIsNew', [
    //       key,
    //     ]),
    //   });
    // }
  };

  injectHTMLIntoCanvas = () => {
    const { handleExecuteApi, dropdownDisabled, model } = this.props;
    setTimeout(() => {
      HashTableHTML.renderToView({
        model,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
        disabled: dropdownDisabled,
      });
    }, 0);
  };

  render() {
    const { keyAboutToBeDeleted, keyAboutToBeAdded } = this.state;
    const { model } = this.props;
    const { collisionResolution } = this.props;

    return (
      <>
        <use href='#hashTable' {...pick(this.props, ['x', 'y'])} />
        <defs>
          <g id='hashTable' ref={this.wrapperRef}>
            <KeyList hashTableModel={model} />
            <HashFunction />
            <MemoryArray
              hashTableModel={model}
              keyAboutToBeDeleted={keyAboutToBeDeleted}
              collisionResolution={collisionResolution}
            />
            <HashIndicationArrow
              hashTableModel={model}
              onAnimationEnd={this.handlePointerLinkAnimationEnd}
              keyAboutToBeDeleted={keyAboutToBeDeleted}
              keyAboutToBeAdded={keyAboutToBeAdded}
            />
          </g>
        </defs>
      </>
    );
  }
}

export default withDSCore<HashTable.Model, HashTable.Method>({
  initModel: HashTableDS.initHashTableModel,
  dataTransformer: transformHashTableModel,
})(HashTableDS);
