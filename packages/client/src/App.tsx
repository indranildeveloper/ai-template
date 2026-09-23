// import ChatBot from "./components/shared/chat/ChatBot";

import ReviewList from "./components/shared/reviews/ReviewList";

function App() {
    return (
        <div className="h-screen w-full p-4">
            {/* <ChatBot /> */}
            <ReviewList productId={2} />
        </div>
    );
}

export default App;
