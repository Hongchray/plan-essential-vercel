import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface MessageAlertProps {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  title?: string;
  description?: string | ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  children?: ReactNode;
  className?: string;
}

export function MessageAlert({
  variant = "default",
  title,
  description,
  icon,
  showIcon = true,
  children,
  className,
}: MessageAlertProps) {
  const { t } = useTranslation("common"); // Use your translation namespace

  const variantConfig = {
    default: {
      icon: <Info className="h-4 w-4" />,
      title: t("alert.info") || "Info",
    },
    destructive: {
      icon: <AlertCircle className="h-4 w-4" />,
      title: t("alert.error") || "Error",
    },
    success: {
      icon: <CheckCircle className="h-4 w-4" />,
      title: t("alert.success") || "Success",
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4" />,
      title: t("alert.warning") || "Warning",
    },
    info: {
      icon: <Info className="h-4 w-4" />,
      title: t("alert.info") || "Info",
    },
  };

  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;

  return (
    <Alert
      variant={
        variant === "success" || variant === "warning" || variant === "info"
          ? "default"
          : variant
      }
      className={className}
    >
      {showIcon && displayIcon}
      {displayTitle && <AlertTitle>{displayTitle}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </Alert>
  );
}
