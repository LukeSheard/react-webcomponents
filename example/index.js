require('webcomponents.js');
require('react-select/dist/react-select.css');

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Select = require('react-select');
const createWebComponent = require('../dist').default;

const attributeConverters = {
  options: JSON.parse
};

const eventHandlers = {
  onChange: function({ value }) {
    this.setAttribute('value', value);
  }
}

const webComponent = createWebComponent(attributeConverters, eventHandlers)(Select);

document.registerElement('react-select', webComponent);

const map = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
};

const button = document.getElementById('clicker');
const options = [];
button.onclick = () => {
  options.push({
    value: map[options.length + 1],
    label: map[options.length + 1]
  });
  const element = document.getElementsByTagName('react-select')[0];
  element.setAttribute('options', JSON.stringify(options));
};