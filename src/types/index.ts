// src/types/index.ts
export type RootStackParamList = {
    Home: undefined;
    Summary: undefined;
    Question: undefined;
    Answer: undefined;
    Action: undefined;
  };
  
  export type UIHierarchy = {
    // Define the structure of your UI hierarchy here
    // This is just an example, adjust according to your needs
    type: string;
    attributes: Record<string, string>;
    children?: UIHierarchy[];
    text?: string;
  };