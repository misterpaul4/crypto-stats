import { Button, Tooltip } from 'antd';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { useUiStore, resolveTheme } from '@shared/store/uiStore';

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggle = useUiStore((s) => s.toggleTheme);
  const isDark = resolveTheme(theme) === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
      <Button
        type="text"
        aria-label="Toggle color theme"
        icon={isDark ? <BulbOutlined /> : <BulbFilled />}
        onClick={toggle}
      />
    </Tooltip>
  );
}
