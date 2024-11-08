export type ActionResponse = {
  action: string;
  messageToShow: string;
  body?: string;
  subject?: string;
};

export type PromptCardProps = {
  text: string;
  onPress: () => void;
};

export type InputSectionProps = {
  inputValue: string;
  onChange: (text: string) => void;
  onMicPress: () => void;
  onSend: () => void;
  recognizing: boolean;
}; 