import React from "react";
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import LoginForm from "./LoginForm";

test ('Login form is rendered', () => {
    render(<LoginForm />)

    const element = screen.
})