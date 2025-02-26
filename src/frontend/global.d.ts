/**
 * From webpack.DefinePlugin, contains the version
 * defined in package.json
 */
declare const BA_VERSION: string;

declare module "*.svg" {
  const content: ReactNode<React.SVGAttributes<SVGElement>>;
  export default content;
}
