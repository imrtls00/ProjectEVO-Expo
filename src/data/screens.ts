export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};

export const data: Data[] = [
  {
    id: 1,
    image: require('../assets/onboarding-1.png'),
    title: 'Talk to EVO like a friend.',
    text: 'Ask questions, set reminders, or complete tasks with just your voice.',
  },
  {
    id: 2,
    image: require('../assets/onboarding-2.png'),
    title: 'Your Pocket Assistant.',
    text: 'Ready to experience the future of productivity?',
  },
  {
    id: 3,
    image: require('../assets/onboarding-3.png'),
    title: 'Stay organized and focused.',
    text: 'EVO helps you stay on top of your tasks and goals.',
  },
];
