import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">EmojiScript</h1>
            <Link 
                to="/lexer" 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Try the Lexer IDE →
            </Link>
        </div>
    );
};

export { Landing };