import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Kaiser SmartSite 360:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl mx-auto mb-4">
              K
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-2">KAISER SMARTSITE 360</h1>
            <p className="text-sm text-slate-400 mb-6">
              An unexpected display issue occurred. Click the button below to reset and reload the application.
            </p>
            {this.state.error && (
              <div className="bg-slate-950/70 p-3 rounded-lg text-left text-xs font-mono text-rose-400 mb-6 overflow-x-auto border border-slate-800">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              Reset & Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

