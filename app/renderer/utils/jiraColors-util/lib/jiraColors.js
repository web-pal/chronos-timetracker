// @flow

type JiraColor = 'medium-gray' | 'green' | 'yellow' | 'brown' | 'warm-red' | 'blue-gray';

type EpicColor = 'ghx-label-1' | 'ghx-label-2' | 'ghx-label-3' | 'ghx-label-4' | 'ghx-label-5' | 'ghx-label-6' | 'ghx-label-7' | 'ghx-label-8' | 'ghx-label-9';

export function getStatusColor(colorName: JiraColor, opacity: string = '1'): string {
  switch (colorName) {
    case 'medium-gray':
      return `rgba(112, 112, 112, ${opacity})`;
    case 'green':
      return `rgba(20, 137, 44, ${opacity})`;
    case 'yellow':
      return `rgba(246, 195, 66, ${opacity})`;
    case 'brown':
      return `rgba(129, 91, 58, ${opacity})`;
    case 'warm-red':
      return `rgba(208, 68, 55, ${opacity})`;
    case 'blue-gray':
      return `rgba(74, 103, 133, ${opacity})`;
    default:
      return `rgba(238, 238, 238, ${opacity})`;
  }
}

export function getEpicColor(colorName: EpicColor): string {
  switch (colorName) {
    case 'ghx-label-1':
      return '#815b3a';
    case 'ghx-label-2':
      return '#f79132';
    case 'ghx-label-3':
      return '#d39d3f';
    case 'ghx-label-4':
      return '#3b80c4';
    case 'ghx-label-5':
      return '#4a6785';
    case 'ghx-label-6':
      return '#8fb021';
    case 'ghx-label-7':
      return '#C0B6F2';
    case 'ghx-label-8':
      return '#644982';
    case 'ghx-label-9':
      return '#f15c75';
    default:
      return '#fff';
  }
}
