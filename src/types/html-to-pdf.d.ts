// react-native-html-to-pdf 0.12 has no types of its own
declare module 'react-native-html-to-pdf' {
  type Options = {
    html: string;
    fileName?: string;
    directory?: string;
    base64?: boolean;
    // Page size in points (A4: 595 × 842)
    width?: number;
    height?: number;
    padding?: number;
  };
  const RNHTMLtoPDF: {
    convert: (options: Options) => Promise<{filePath: string; base64?: string}>;
  };
  export default RNHTMLtoPDF;
}
