import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        fetch("/api/hello")
            .then((res) => res.json())
            .then((data) => setMessage(data.message));
    }, []);

    return (
        <div className="p-4">
            <p className="text-3xl font-bold">{message}</p>
            <Button>Click Me</Button>
        </div>
    );
}

export default App;
