import { Tooltip } from "antd";
import { cn } from "../lib/utils";

const ControlButton = ({
    onClick,
    icon,
    tooltip,
    active,
  }: {
    onClick: () => void;
    icon: JSX.Element;
    tooltip: string;
    active?: boolean;
  }) => (
    <Tooltip title={tooltip} placement="bottom">
      <button
        onClick={onClick}
        className={cn(
          'p-3 rounded-full transition-all duration-200 ease-in-out hover:',
          active
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
        )}
      >
        {icon}
      </button>
    </Tooltip>
  );

export default ControlButton;