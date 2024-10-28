// src/types/index.ts
export type RootStackParamList = {
    // Define the screens that you have in your app
    Splash: undefined;
    Onboarding: undefined;
    Home: undefined;
    Results: { result: string };
  };
  
  export type UIHierarchy = {
    // Define the structure of your UI hierarchy here
    // This is just an example, adjust according to your needs
    type: string;
    attributes: Record<string, string>;
    children?: UIHierarchy[];
    text?: string;
  };