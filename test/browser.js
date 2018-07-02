import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body>body></html>html>');
const { window } = jsdom;

global.document = window.document;
global.window = window;
global.HTMLElement = window.HTMLElement;

global.navigator = {
  userAgent: 'mocha.js',
};
