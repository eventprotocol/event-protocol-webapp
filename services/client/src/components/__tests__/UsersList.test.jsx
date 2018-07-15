import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import UsersList from '../UsersList';

const users = [
  {
    'active': true,
    'email': '',
    'username': '',
    'eth_address': '0x0E35462535daE6fd521f0Eea67dc4e9485C714dC',
    'id': 1
  },
  {
    'active': true,
    'email': '',
    'username': '',
    'eth_address': '0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8',
    'id': 2
  },
];


// Check if the eth address shows
test('UsersList renders properly', () => {
  const wrapper = shallow(<UsersList users={users}/>);
  const element = wrapper.find('h4');
  expect(element.length).toBe(2);
  expect(element.get(0).props.children).toBe('0x0E35462535daE6fd521f0Eea67dc4e9485C714dC');
  expect(element.get(1).props.children).toBe('0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8');
});

test('UsersList renders a snapshot properly', () => {
  const tree = renderer.create(<UsersList users={users}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
