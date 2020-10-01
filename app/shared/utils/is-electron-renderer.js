function isRenderer() {
  // Running in a web browser or node-integration is disabled then True else
  // We're in node.js somehow 
  return (typeof process === 'undefined' || !process) ? true : (!process.type ? false : process.type === 'renderer');
}

export default isRenderer();
