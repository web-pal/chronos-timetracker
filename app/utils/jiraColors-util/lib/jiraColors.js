export default function getStatusColor(colorName, opacity = '1') {
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
