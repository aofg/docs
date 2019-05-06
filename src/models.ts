export interface ITreeLeaf {
  path: string[];
  title: string;
  description: string;
  breadcrumbs: string;
  content: string;
}

export interface ITreeBranch {
  path: string[];
  children?: { [directory: string]: ITreeBranch };
  content?: {
    [name: string]: ITreeLeaf;
  };
}

export interface ITreeContentBranch extends ITreeBranch {
  title?: string;
  description?: string;
  breadcrumbs?: string;
}

export interface ITreeRoot extends ITreeBranch {
  locale: string;
}
