import {
  RiCalendarLine,
  RiFileListLine,
  RiFlowChart,
  RiRobot2Line,
  RiStackLine,
} from '@remixicon/react';

export const tabs = [
  { title: 'Calendar', url: '', icon: RiCalendarLine },
  {
    title: 'Automation Builder',
    url: '/automations-builder',
    icon: RiFlowChart,
  },
  { title: 'Automations', url: '/automations', icon: RiRobot2Line },
  { title: 'Integrations', url: '/integrations', icon: RiStackLine },
  { title: 'Logs', url: '/logs', icon: RiFileListLine },
];
