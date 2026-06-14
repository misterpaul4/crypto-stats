import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={this.state.error.message}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Reload
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
