const commonStyles = new CSSStyleSheet();

commonStyles.replaceSync(`
  .hide {
    display: none !important;
  }
`);

export default commonStyles;
