import { Tree, formatFiles, generateFiles } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import * as path from 'path';

function camelize(text) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return text.substring(0, 1).toUpperCase() + text.substring(1);
}

export default async function (tree: Tree, schema: Schema) {
  const lowerName = schema.name.replace(/-/g, '').toLowerCase();
  const camelName = camelize(schema.name);
  const dbName = camelName.substring(0, 1).toLowerCase() + camelName.substring(1);
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    path.join('apps/api/src/app/features', schema.name),
    {
      name: schema.name,
      isSoftDelete: schema.isSoftDelete,
      ext: 'ts',
      lowerName,
      camelName,
      dbName
    }
  )
  await formatFiles(tree);

}
