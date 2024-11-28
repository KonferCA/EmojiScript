import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from '@pages';
import { LexerIDE } from '../pages/LexerIDE';

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/lexer" element={<LexerIDE />} />
        </Routes>
    </BrowserRouter>
);

export { Router };