function importAll(r) 
{
  let images = {};
  r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });

  return images;
}

let images = {}

images.champions = importAll(require.context('../public/resources/champions', false, /\.(png|jpe?g|svg)$/));
images.roles = importAll(require.context('../public/resources/roles', false, /\.(png|jpe?g|svg)$/));

export default images