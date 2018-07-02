import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import RuntimePicker from 'index';
import { OverlayTrigger } from 'react-bootstrap';

describe('<RuntimePicker />', () => {
  context('default behavior', () => {
    const wrapper = mount(<RuntimePicker />);

    it('renders', () => {
      expect(wrapper).to.exist
    });

    it('has an overlay', () => {
      const overlay = wrapper.find(OverlayTrigger);
      expect(overlay.length).to.eql(1);
    });

    it('display runtime in default input', () => {
      const overlay = wrapper.find(OverlayTrigger);
      const input = overlay.find('.form-control');

      expect(input.props().value).to.eql('000:00:00');
    });

    it('saves runtime in seconds in hidden input', () => {
      const input = wrapper.find('input#runtime');

      expect(input.props().type).to.eql('hidden');
      expect(input.props().value).to.eql(0);
    });
  });

  context('disabled', () => {
    const wrapper = mount(<RuntimePicker disabled />);

    it('renders disabled input', () => {
      const input = wrapper.find('.form-control');

      expect(input.length).to.eql(1);
      expect(input.props().disabled).to.eql(true);
      expect(input.props().value).to.eql('000:00:00');
    });

    it('does not render and overlay', () => {
      const overlay = wrapper.find(OverlayTrigger);

      expect(overlay.length).to.eql(0);
    });

    it('renders hidden input', () => {
      const input = wrapper.find('#runtime');

      expect(input.props().value).to.eql(0);
      expect(input.props().type).to.eql('hidden');
    });
  });

  context('with value', () => {
    const wrapper = mount(<RuntimePicker value={1432} />);

    it('translates value in seconds to runtime', () => {
      const overlay = wrapper.find(OverlayTrigger);
      const input = overlay.find('.form-control');

      expect(input.props().value).to.eql('000:23:52');
    });

    it('saves the runtime in seconds in hidden input', () => {
      const input = wrapper.find('#runtime');

      expect(input.props().value).to.eql(1432);
    });
  });

  context('skipSeconds', () => {
    const wrapper = mount(<RuntimePicker skipSeconds value={1432} />);

    it('remove the second input and display but calculations still happen', () => {
      const hidden = wrapper.find('#runtime');
      const overlay = wrapper.find(OverlayTrigger);
      const runtime = overlay.find('.form-control');

      expect(runtime.props().value).to.eql('000:23');
      expect(hidden.props().value).to.eql(1432);
    });
  });
});
