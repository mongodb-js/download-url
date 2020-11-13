type Options = {
  version: string;
  arch?: string;
  platform?: string;
  branch?: string;
  bits?: string;
  debug?: boolean;
  distro?: string;
  ext?: string;
};

type VersionInfo = Required<Options> & {
  url: string;
  artifact: string;
  name: string;
};

declare function getDownloadURL(options: Options, callback: (err: Error | null, info: VersionInfo) => void);
export = getDownloadURL;
