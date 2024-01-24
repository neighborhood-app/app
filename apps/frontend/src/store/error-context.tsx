import { createContext } from 'react';

type ErrorSetter = (errorMsg: string) => void;

const ErrorContext = createContext<ErrorSetter | undefined>(undefined);

export default ErrorContext;
