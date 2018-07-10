import React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Picker from 'Picker';
import ScopedField from 'ScopedField';

const callback = sinon.spy();

const defaultProps = {
  handleChange: callback,
  handleKeyboard: callback,
  hours: '0000',
  maxHours: 9999,
  minutes: '00',
  seconds: '00',
  skipSeconds: false,
  title: 'Test Picker',
};

describe('<Picker />', () => {
  describe('without exclusions', () => {
    const wrapper = mount(<Picker {...defaultProps} />);

    it('renders 2 <ScopedField />', () => {
      const scopedFields = wrapper.find(ScopedField);

      expect(scopedFields.length).to.eql(2);
    });
  });

  describe('with exclusions', () => {
    const wrapper = mount(<Picker {...defaultProps} skipSeconds />);

    it('skips seconds <ScopedField />', () => {
      const scopedFields = wrapper.find(ScopedField).findWhere(sf => sf.props().name === 'seconds');

      expect(scopedFields.html()).to.eql(null);
    });
  });

  describe('hours field', () => {
    const wrapper = mount(<Picker {...defaultProps} />);
    const hoursField = wrapper.findWhere(c => c.type() === 'input' && c.props().name === 'hours');

    it('renders an hours input field', () => {
      expect(hoursField.length).to.eql(1);
    });

    it('is of type number', () => {
      expect(hoursField.props().type).to.eql('number');
    });

    it('has data-unscoped attribute', () => {
      assert(hoursField.props()['data-unscoped']);
    });

    it('has direction right to left', () => {
      expect(hoursField.props().dir).to.eql('rtl');
    });

    it('calls handleChange handler on hours change', () => {
      hoursField.simulate('change', 6);
      assert(callback.called);
    });

    it('calls handleKeyboard handler on hours change', () => {
      hoursField.simulate('keydown', 6);
      assert(callback.called);
    });
  });
});
