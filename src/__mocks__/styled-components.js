'use strict';

const React = require('react');

// Creates a tagged-template-literal component factory for the given HTML tag
function makeTagFactory(tag) {
  // The factory is itself the tag function: styled.div`...` → component
  const factory = function () {
    const Component = function ({ children, ...props }) {
      const domProps = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) domProps[k] = v;
      }
      return React.createElement(tag, domProps, children);
    };
    Component.displayName = 'Styled(' + tag + ')';
    // Allow further chaining: styled.div.attrs(...)``
    Component.attrs = () => makeTagFactory(tag);
    Component.withConfig = () => makeTagFactory(tag);
    return Component;
  };
  // Also support .attrs(...)`` on the factory itself
  factory.attrs = () => makeTagFactory(tag);
  factory.withConfig = () => makeTagFactory(tag);
  return factory;
}

// Enumerate HTML tags used in the project styles
const HTML_TAGS = [
  'a', 'article', 'aside', 'b', 'blockquote', 'body', 'br', 'button',
  'caption', 'col', 'colgroup', 'dd', 'details', 'dialog', 'div', 'dl',
  'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img',
  'input', 'label', 'legend', 'li', 'main', 'mark', 'menu', 'nav',
  'ol', 'option', 'p', 'pre', 'progress', 'q', 's', 'section', 'select',
  'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody',
  'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'u', 'ul',
  'video',
];

// styled(Component)`` — wrap an arbitrary component
function styled(Component) {
  return makeTagFactory(
    typeof Component === 'string' ? Component : (Component.displayName || 'div')
  );
}

// styled.div``, styled.span``, …
HTML_TAGS.forEach((tag) => {
  styled[tag] = makeTagFactory(tag);
});

styled.__esModule = true;
styled.default = styled;

const css = (...args) => args.join('');
const keyframes = (...args) => 'keyframe-' + args.join('');
const ThemeProvider = ({ children }) => children;
const createGlobalStyle = () => () => null;

module.exports = styled;
module.exports.default = styled;
module.exports.css = css;
module.exports.keyframes = keyframes;
module.exports.ThemeProvider = ThemeProvider;
module.exports.createGlobalStyle = createGlobalStyle;
module.exports.__esModule = true;
