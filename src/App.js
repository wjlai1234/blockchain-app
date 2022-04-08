import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Services, Footer,Welcome,Navbar} from "./components";
import Swap from "./components/Swap";

function App() {
    return (
        <div className="min-h-screen">
                <div className="gradient-bg-welcome">
                        <Navbar />
                        <Welcome />
                </div>
            <Services />
            <Swap />
            <Footer/>
        </div>
    )
}

export default App;
