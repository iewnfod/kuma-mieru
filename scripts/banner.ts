import chalk from 'chalk';
import packageJson from '../package.json';

const banner = `
██╗  ██╗██╗   ██╗███╗   ███╗ █████╗     ███╗   ███╗██╗███████╗██████╗ ██╗   ██╗
██║ ██╔╝██║   ██║████╗ ████║██╔══██╗    ████╗ ████║██║██╔════╝██╔══██╗██║   ██║
█████╔╝ ██║   ██║██╔████╔██║███████║    ██╔████╔██║██║█████╗  ██████╔╝██║   ██║
██╔═██╗ ██║   ██║██╔████╔██║██╔══██║    ██║╚██╔╝██║██║██╔══╝  ██╔══██╗██║   ██║
██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ██║ ╚═╝ ██║██║███████╗██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 
`;

type ChalkColor = 'green' | 'blue' | 'yellow' | 'red' | 'magenta' | 'cyan' | 'white' | 'gray';

interface ConfigItem {
  name: string;
  value: string | undefined;
  defaultValue?: string;
}

interface ConfigGroup {
  title: string;
  icon: string;
  color: ChalkColor;
  items: ConfigItem[];
}

const getEnvStatus = (value: string | undefined, defaultValue = 'Not configured') => {
  return value ? chalk.green(value) : chalk.yellow(defaultValue);
};

const printConfigGroup = ({ title, icon, color, items }: ConfigGroup) => {
  console.log(chalk[color](`${icon} ${title}:`));
  for (const { name, value, defaultValue } of items) {
    console.log(chalk.blue(`  - ${name}:`), getEnvStatus(value, defaultValue));
  }
  console.log('');
};

const configGroups: ConfigGroup[] = [
  {
    title: 'Environment',
    icon: '📡',
    color: 'blue',
    items: [
      {
        name: 'NODE_ENV',
        value: process.env.NODE_ENV,
        defaultValue: 'development',
      },
      {
        name: 'CI_MODE',
        value: process.env.CI_MODE,
        defaultValue: 'false',
      },
    ],
  },
  {
    title: 'Basic Configuration',
    icon: '🌐',
    color: 'blue',
    items: [
      {
        name: 'UPTIME_KUMA_BASE_URL',
        value: process.env.CI_MODE === 'true' ? 'CI Mode' : process.env.UPTIME_KUMA_BASE_URL,
      },
      {
        name: 'PAGE_ID',
        value: process.env.PAGE_ID,
      },
    ],
  },
  {
    title: 'Features',
    icon: '✨',
    color: 'magenta',
    items: [
      {
        name: 'FEATURE_EDIT_THIS_PAGE',
        value: process.env.FEATURE_EDIT_THIS_PAGE,
        defaultValue: 'false (Default)',
      },
      {
        name: 'FEATURE_SHOW_STAR_BUTTON',
        value: process.env.FEATURE_SHOW_STAR_BUTTON,
        defaultValue: 'true (Default)',
      },
      {
        name: 'FEATURE_SHOW_HOME_BUTTON',
        value: process.env.FEATURE_SHOW_HOME_BUTTON,
        defaultValue: 'true (Default)',
      },
    ],
  },
  {
    title: 'Custom Metadata',
    icon: '📋',
    color: 'magenta',
    items: [
      {
        name: 'FEATURE_TITLE',
        value: process.env.FEATURE_TITLE,
        defaultValue: 'Using Default',
      },
      {
        name: 'FEATURE_DESCRIPTION',
        value: process.env.FEATURE_DESCRIPTION,
        defaultValue: 'Using Default',
      },
      {
        name: 'FEATURE_ICON',
        value: process.env.FEATURE_ICON,
        defaultValue: 'Using Default',
      },
      {
        name: 'FEATURE_HOME_LINK',
        value: process.env.FEATURE_HOME_LINK,
        defaultValue: 'Using Default',
      },
    ],
  },
];

const printStartupInfo = () => {
  console.log(chalk.cyan(banner));
  console.log(chalk.green(`🚀 Kuma Mieru [v${packageJson.version}] is starting...\n`));

  for (const group of configGroups) {
    printConfigGroup(group);
  }
};

printStartupInfo();
