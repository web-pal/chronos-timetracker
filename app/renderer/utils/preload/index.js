import path from 'path';

export function getPreload(fileName) {
  return (
    process.env.NODE_ENV === 'development'
    ? `file://${path.join(process.cwd(), `app/dist/${fileName}.js`)}`
      : path.join(__dirname, `/${fileName}-bundle.js`)
  );
}

