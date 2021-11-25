function escapeSql(text) {
  return text.replace(/([^'\\]*(?:\\.[^'\\]*)*)'/g, "$1\\'");
}

module.exports = {
  escapeSql
};
