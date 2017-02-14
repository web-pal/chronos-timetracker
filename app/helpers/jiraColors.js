export default function getStatusColor(colorName) {
  switch(colorName) {
    case 'medium-gray':
      return 'rgba(112, 112, 112, .25)';
    case 'green':
      return 'rgba(20, 137, 44, .25)';
    case 'yellow':
      return 'rgba(246, 195, 66, .25)';
    case 'brown':
      return 'rgba(129, 91, 58, .25)';
    case 'warm-red':
      return 'rgba(208, 68, 55, .25)';
    case 'blue-gray':
      return 'rgba(74, 103, 133, .25)';
    default:
      return 'rgba(238, 238, 238, .25)';
  }
}
