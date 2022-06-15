const supportedTopics = [
  'devops',
  'ux',
  'design',
  'frontend',
  'javascript',
  'react',
  'dotnet',
  'rust',
  'php',
  'python',
  'graphql',
] as const;

export const displayedTopics: typeof supportedTopics[number][] = [
  'devops',
  'design',
  'frontend',
  'dotnet',
  'rust',
  'php',
  'python',
  'graphql',
];

export default supportedTopics;
