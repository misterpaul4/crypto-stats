import { lightMode, darkMode } from '../displayActions';

describe('actions', () => {
  it('should create an action to turn dark mode off', () => {
    const expectedAction = {
      type: 'DARK_MODE_OFF',
    };
    expect(lightMode()).toEqual(expectedAction);
  });

  it('should create an action to turn dark mode on', () => {
    const expectedAction = {
      type: 'DARK_MODE_ON',
    };
    expect(darkMode()).toEqual(expectedAction);
  });
});
