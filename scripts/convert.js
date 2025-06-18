const dataset = require('./dataset');

dataset.forEach((i) => {
  console.log(
    `| name | ${i.name} | [Link](https://www.blendviewer.com/projects/${i.id}) | unknown     |`
  );
});
