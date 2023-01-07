import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import Header from '../Header';

it('should render Header correctly without errors', () => {
  const render = new ShallowRenderer();

  render.render(<Header />);
  expect(render.getRenderOutput()).toMatchSnapshot();
});
