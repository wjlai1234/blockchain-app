import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Services, Footer,Welcome,Navbar} from "./components";
import Swap from "./components/Swap";
import ErrorBoundary from "./context/ErrorBoundary";

function App() {
    return (
        <div className="min-h-screen">
                <div className="gradient-bg-welcome">
                        <Navbar />
                    <ErrorBoundary><Welcome /></ErrorBoundary>
                </div>
            <Services />
            <Swap />
            <Footer/>
        </div>
    )
}

export default App;
