
import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';

export type StatusType = 'active' | 'inactive' | 'warning' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  size = 'small' 
}) => {
  const getIcon = () => {
    const iconProps = { fontSize: size };
    
    switch (status) {
      case 'active':
        return <CheckCircle {...iconProps} />;
      case 'inactive':
        return <Warning {...iconProps} />;
      case 'warning':
        return <Warning {...iconProps} />;
      case 'error':
        return <Error {...iconProps} />;
      default:
        return undefined;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const icon = getIcon();
  const color = getColor();
  const variant = status === 'inactive' ? 'outlined' : 'filled';

  return (
    <Chip
      label={label}
      color={color}
      icon={icon}
      size={size}
      variant={variant}
    />
  );
};

export default StatusBadge;