function importAll(r) 
{
  let images = {};
  r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });

  return images;
}

let images = {}

images.champions = importAll(require.context('../public/resources/champions', false, /\.(png|jpe?g|svg)$/));
images.roles = importAll(require.context('../public/resources/roles', false, /\.(png|jpe?g|svg)$/));
images.lobby = importAll(require.context('../public/resources/lobby', false, /\.(png|jpe?g|svg)$/))

const colors = {
  red: '#E76161',
  yellow: '#FF9130',
  green: '#9CA777',
  white: '#F0F0F0'
}

export {images, colors};