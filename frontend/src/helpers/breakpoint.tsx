import React, {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const defaultValue: any = {};

const BreakpointContext = createContext(defaultValue);

type BreakpointProviderProps = {
  childrend?: ReactNode[],
  queries: any
};

const BreakpointProvider: FunctionComponent<BreakpointProviderProps> = ({ children, queries }) => {
  const [queryMatch, setQueryMatch] = useState({});

  useEffect(() => {
    const mediaQueryLists: any = {};
    const keys = Object.keys(queries);
    let isAttached = false;

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc: any, media) => {
        acc[media] = !!(mediaQueryLists[media]?.matches);
        return acc;
      }, {});
      setQueryMatch(updatedMatches);
    }

    if (!!window?.matchMedia) {
      const matches: any = {};
      keys.forEach((media: string) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media] = window.matchMedia(queries[media]);
          matches[media] = mediaQueryLists[media].matches;
        } else {
          matches[media] = false;
        }
      });
      setQueryMatch(matches);
      isAttached = true;
      keys.forEach(media => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media].addListener(handleQueryListener);
        }
      });
    }

    return () => {
      if (isAttached) {
        keys.forEach(media => {
          if (typeof queries[media] === 'string') {
            mediaQueryLists[media].removeListener(handleQueryListener);
          }
        });
      }
    };
  }, [queries]);

  return (
    <BreakpointContext.Provider value={queryMatch}>
      {children}
    </BreakpointContext.Provider>
  );
}

function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (context === defaultValue) {
    throw new Error('useBreakpoint must be used within BreakpointProvider');
  }
  return context;
}

export { useBreakpoint, BreakpointProvider };
