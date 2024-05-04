import { themes } from '@/constants/theme-data';

function useDynamicTheme() {
  const hour = new Date().getHours();
  let foundTheme = themes.find((t) => {
    if (hour < 5) return t.name === 'late night';
    else if (hour < 8) return t.name === 'morning';
    else if (hour < 11) return t.name === 'late morning';
    else if (hour < 14) return t.name === 'noon';
    else if (hour < 17) return t.name === 'afternoon';
    else if (hour < 20) return t.name === 'late afternoon';
    else if (hour < 23) return t.name === 'evening';
    else return t.name === 'night';
  });

  return foundTheme || themes[1];
}

export default useDynamicTheme;
