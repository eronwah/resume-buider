import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Something went wrong</h1>
                <p className="text-xs text-slate-400">Application encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-36">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If you deployed this to GitHub Pages or static hosting, make sure you ran <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">npm run build</code> and that your environment variables are configured.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                <Home className="w-3.5 h-3.5" /> Reset App State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
