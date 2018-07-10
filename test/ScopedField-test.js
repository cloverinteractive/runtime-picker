import React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import ScopedField from 'ScopedField';
import sinon from 'sinon';

const callback = sinon.spy();

describe('<ScopedField />', () => {
  context('not skipped', () => {
    const wrapper = mount(<ScopedField />);

    it('mounts', () => {
      expect(wrapper).to.exist;
    });
  });

  context('excluded', () => {
    const wrapper = mount(<ScopedField exclude />);

    it('does not render', () => {
      expect(wrapper.html()).to.eql(null);
    });
  });

  describe('props', () => {
    describe('name', () => {
      const name = 'minutes';
      const wrapper = mount(<ScopedField name={name} />);

      it("render's input with name prop", () => {
        const input = wrapper.find('input');

        expect(input.length).to.eql(1);
        expect(input.props().name).to.eql(name);
      });
    });

    describe('value', () => {
      const value = 59;
      const wrapper = mount(<ScopedField handleChange={callback} value={value} />);

      it("renders's input with value prop", () => {
        const input = wrapper.find('input');

        expect(input.length).to.eql(1);
        expect(input.props().value).to.eql(value);
      });
    });

    describe('handleChange', () => {
      const wrapper = mount(<ScopedField handleChange={callback} value={0} />);

      it('sends value to callback', () => {
        const input = wrapper.find('input');

        input.simulate('change', 6);
        assert(callback.called);
      });
    });

    describe('handleKeyboard', () => {
      const wrapper = mount(<ScopedField handleKeyboard={callback} />);

      it('sends value to callback', () => {
        const input = wrapper.find('input');

        input.simulate('keyDown', 6);
        assert(callback.called);
      });
    });
  });
});
