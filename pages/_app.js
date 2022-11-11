import 'styles/globals.css';

const App = ({ Component, pageProps }) => (
    <div className={'bg-gray-800 text-gray-100 min-h-screen w-full'}>
        <Component {...pageProps} />
    </div>
);

export default App;
