import R from 'ramda';
import { isAssignableToType } from 'ts-simple-type';
import ts from 'typescript';
import slug from 'slug';

const filePath = './src/from.ts';

const program = ts.createProgram([filePath], {});
const checker = program.getTypeChecker();
const source = program.getSourceFile(filePath) as ts.SourceFile;
const printer = ts.createPrinter();

const transform: ts.TransformerFactory<ts.SourceFile> = context => {
  const dict: { [key: string]: { name: string; params: ts.Type[] }[] } = {};
  const visit: ts.Visitor = root => {
    const node = ts.visitEachChild(root, visit, context);

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isArrowFunction(node.initializer)
    ) {
      const fn = node.initializer;
      const types = fn.parameters.map(param =>
        checker.getTypeAtLocation(param)
      );
      const suffix = types.map(type =>
        slug(
          checker
            .typeToString(type)
            .replace(/\[\]/g, '_array')
            .replace(/\[/g, 'left_bracket')
            .replace(/\]/g, 'right_bracket'),
          '_'
        )
      );

      const newName = [node.name.getText(), ...suffix].join('_');
      if (dict[node.name.getText()]) {
        dict[node.name.getText()].push({ name: newName, params: types });
      } else {
        dict[node.name.getText()] = [{ name: newName, params: types }];
      }
      return ts.createVariableDeclaration(
        ts.createIdentifier(newName),
        node.type,
        fn
      );
    }
    return node;
  };
  const updateIdentifiers: ts.Visitor = root => {
    const node = ts.visitEachChild(root, updateIdentifiers, context);
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      dict[node.expression.getText()]
    ) {
      const value = dict[node.expression.getText()];
      const args = node.arguments.map(x => checker.getTypeAtLocation(x));
      const match = value.find(item =>
        R.zip(item.params, args).every(([param, arg]) =>
          isAssignableToType(param, arg, checker)
        )
      );
      if (match) {
        return ts.createCall(
          ts.createIdentifier(match.name),
          node.typeArguments,
          node.arguments
        );
      }
    }

    return node;
  };
  return node => ts.visitNode(ts.visitNode(node, visit), updateIdentifiers);
};
// console.log(source);
const result = ts.transform(source, [transform]);
const [newSource] = result.transformed;
// console.log(source.locals);

console.log(printer.printFile(result.transformed[0]));
