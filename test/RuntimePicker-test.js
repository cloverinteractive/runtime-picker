import React from 'react';
import { assert, expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import RuntimePicker from 'index';
import { OverlayTrigger } from 'react-bootstrap';
import Picker from 'Picker';

const NOOP = f => f;

describe('<RuntimePicker />', () => {
  context('default behavior', () => {
    const wrapper = mount(<RuntimePicker />);

    it('renders', () => {
      expect(wrapper).to.exist
    });

    it('has an overlay', () => {
      const trigger = wrapper.find(OverlayTrigger);
      expect(trigger.length).to.eql(1);
    });

    it('has a Picker', () => {
      const trigger = wrapper.find(OverlayTrigger);
      const overlay = trigger.props().overlay;

      expect(overlay.type).to.eql(Picker);
    });

    it('display placeholder if runtime is 0', () => {
      const overlay = wrapper.find(OverlayTrigger);
      const input = overlay.find('.form-control');

      expect(input.props().placeholder).to.eql('HHHH:MM:SS');
      expect(input.props().value).to.eql('');
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
      expect(input.props().value).to.eql('');
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

      expect(input.props().value).to.eql('0000:23:52');
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

      expect(runtime.props().value).to.eql('0000:23');
      expect(hidden.props().value).to.eql(1432);
    });
  });

  describe('callbacks', () => {
    context('change handler', () => {
      const wrapper = mount(<RuntimePicker />);
      const changeHandler = wrapper.instance().handleChange;
      const displayHandler = wrapper.instance().runtimeDisplay;

      const mockEvent = {
        currentTarget: {
          getAttribute: f => false,
          name: 'minutes',
          value: '1',
        },
      };

      it('changes input via clicks', () => {
        expect(displayHandler()).to.eql('0000:00:00');
        changeHandler(mockEvent);
        expect(displayHandler()).to.eql('0000:01:00');
      });
    });

    context('keyboard handler', () => {
      const wrapper = mount(<RuntimePicker value={1432}/>);
      const keyboardHandler = wrapper.instance().handleKeyboard;
      const displayHandler = wrapper.instance().runtimeDisplay;
      const formattedValue = '0000:23:52';

      const mockEvent = {
        key: '1',
        keyCode: 48,
        persist: NOOP,
        preventDefault: NOOP,
      };

      it('pushes numbers from right to left', () => {
        expect(displayHandler()).to.eql(formattedValue);
        keyboardHandler(mockEvent);
        expect(displayHandler()).to.eql('0002:35:21');
      });

      context('hitting Delete', () => {
        const wrapper = mount(<RuntimePicker value={1432}/>);
        const keyboardHandler = wrapper.instance().handleKeyboard;
        const displayHandler = wrapper.instance().runtimeDisplay;

        const mockEvent = {
          key: 'Delete',
          keyCode: 46,
          persist: NOOP,
        };

        it('Clears when user hits Delete', () => {
          expect(displayHandler()).to.eql(formattedValue);
          keyboardHandler(mockEvent);
          expect(displayHandler()).to.eql('0000:00:00');
        });
      });

      context('maxHours', () => {
        const wrapper = mount(<RuntimePicker value={36002439} />);
        const keyboardHandler = wrapper.instance().handleKeyboard;
        const displayHandler = wrapper.instance().runtimeDisplay;

        it('will not let you go over the maximum number of hours', () => {
          const maxTime = '10000:40:39'; // This is what 9999:99:99 translates to

          expect(displayHandler()).to.eql(maxTime);
          keyboardHandler(mockEvent);
          expect(displayHandler()).to.eql(maxTime)
        });
      });
    });
  });

  context('onChange', () => {
    const onChange = sinon.spy();
    const initialValue = 1432;
    const formattedValue = '0000:23:52';

    context('change events', () => {
      const wrapper = mount(<RuntimePicker onChange={onChange} value={initialValue} />);
      const changeHandler = wrapper.instance().handleChange;
      const displayHandler = wrapper.instance().runtimeDisplay;
      const toSeconds = wrapper.instance().toSeconds;
      const mockEvent = {
        currentTarget: {
          getAttribute: f => false,
          name: 'minutes',
          value: '24',
        },
      };

      const runtimePlusOneMinute = initialValue + 60;

      it('sends runtime in seconds to onChange callback', () => {
        expect(toSeconds()).to.eql(initialValue);
        expect(displayHandler()).to.eql(formattedValue);
        changeHandler(mockEvent);
        expect(toSeconds()).to.eql(runtimePlusOneMinute);
        assert(onChange.calledWith(runtimePlusOneMinute));
      });
    });

    context('keyboard events', () => {
      const wrapper = mount(<RuntimePicker onChange={onChange} value={initialValue} />);
      const keyboardHandler = wrapper.instance().handleKeyboard;
      const displayHandler = wrapper.instance().runtimeDisplay;
      const toSeconds = wrapper.instance().toSeconds;
      const unitsShiftInSeconds = 9321;

      const mockEvent = {
        key: '1',
        keyCode: 48,
        persist: NOOP,
        preventDefault: NOOP,
      };

      it('sends runtime in seconds to onChange callback', () => {
        expect(toSeconds()).to.eql(initialValue);
        expect(displayHandler()).to.eql(formattedValue);
        keyboardHandler(mockEvent);
        expect(toSeconds()).to.eql(unitsShiftInSeconds);
        expect(onChange.calledWith(unitsShiftInSeconds));
      });
    });
  });
});
