import { createContext, useContext } from 'react';

type ErrorSetter = (errorMsg: string) => void;

const ErrorContext = createContext<ErrorSetter | undefined>(undefined);

const useErrorContext = () => {
  const context = useContext(ErrorContext);
  return context;
};

export { ErrorContext, useErrorContext };
