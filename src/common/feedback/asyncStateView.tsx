import Button from "../button/button";
import { UI_LABELS } from "../constants/uiLabels";

type AsyncStateViewProps = {
  isLoading: boolean;
  isError: boolean;
  loadingLabel: string;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  minHeightClass?: string;
};

function AsyncStateView({
  isLoading,
  isError,
  loadingLabel,
  errorMessage,
  emptyMessage,
  onRetry,
  retryLabel = UI_LABELS.RETRY,
  minHeightClass,
}: AsyncStateViewProps) {
  if (isLoading) {
    return (
      <div className={minHeightClass}>
        <p className="text-body-sm mt-4 text-muted" role="status">
          {loadingLabel}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={minHeightClass}>
        <p className="text-body-sm mt-4 text-destructive">{errorMessage}</p>
        {onRetry ? (
          <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  if (emptyMessage) {
    return (
      <div className={minHeightClass}>
        <p className="text-body-sm mt-4 text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return null;
}

export default AsyncStateView;
