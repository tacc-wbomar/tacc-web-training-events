// WARNING: This file is ineffectual, because `__MARKDOWN_PROP_NAME__` does not match a property, because no property uses markown. It would be used for `title` property, but all markdown parsers wrap inline markdown with a `<p>` tag, so markdown parsing of `title` was abandoned.

// Include dependencies
const fs = require('fs');
const remark = require('remark');
const remarkHtml = require('remark-html');

// Arguments
// TODO: Define these values externally
const __DATA_PROP_NAME__ = 'entries';
const __MARKDOWN_PROP_NAME__ = '___';
const __LIST_TYPE__ = 'array';

// Get and parse jobs data
const json = fs.readFileSync('./assets/_data.json');
const data = JSON.parse(json);

/** Convert content from Markdown to HTML */
function convert(markdown) {
  const markup = remark().use(remarkHtml).processSync(markdown).toString();

  return markup;
}

/** Convert all relevant content, within given entries, from Markdown to HTML */
function convertAll(data) {
  let entryName, entry, markdown, markup;
  const property = __MARKDOWN_PROP_NAME__;
  const entries = data[__DATA_PROP_NAME__];
  const isIterable = (typeof entries === 'object' && entries !== null);

  // Fail early
  if ( ! isIterable) {
    throw new Error(`The provided data (of type ${(typeof entries)}) is not iterable`);
  }

  switch (__LIST_TYPE__) {
    case 'array':
      entries.forEach( entry => {
        markdown = entry[property];
        markup = convert(markdown);

        entry[property] = markup;
        // console.debug({markdown, markup});
      });
      break;

    case 'object':
      for (entryName in entries) {
        entry = entries[entryName];
        markdown = entry[property];
        markup = convert(markdown);

        entry[property] = markup;
        // console.debug({markdown, markup});
      }
      break;

    default:
      throw new Error('Unrecognized `__LIST_TYPE__`:' + __LIST_TYPE__);
  }
}

// Manipulate data
convertAll(data);
// console.debug(JSON.stringify(data));

module.exports = data;
