import ReactDOM from "react-dom/client";
import { useState } from "react";
import Button from "./components/ui/Button";
import Header from "./components/layout/Header";
import Input from "./components/ui/Input";
import { Mail, Lock, User, Star, Heart, ShoppingCart } from "lucide-react";
import Card from "./components/ui/Card";
import Modal from "./components/ui/Modal";
import Loading from "./components/ui/Loading";

function App() {
  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };
  // Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // Modal
  const [showBasic, setShowBasic] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate async action
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full">
      <Header />
      <main className="px-20 py-8 bg-gray-100  min-h-screen text-depth">
        Welcome to my Shop!
        <div className="p-8 max-w-xl space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={User}
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={Mail}
            helperText="We'll never share your email"
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={
              password.length > 0 && password.length < 6
                ? "Password must be at least 6 characters"
                : ""
            }
            required
          />
          <div className="p-8 space-x-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button onClick={handleClick} loading={isLoading}>
              Check
            </Button>
          </div>
          <Card hover className="max-w-lg">
            <Card.Image
              src="https://picsum.photos/300/300?random=1"
              alt="Product"
              aspectRatio="aspect-square"
            />
            <Card.Header>
              <Card.Title>Stylish T-Shirt</Card.Title>
              <Card.Description>Premium cotton blend</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.5 (120)</span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold">₹1,299</span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹1,999
                </span>
              </div>
            </Card.Content>
            <Card.Footer>
              <Button className="w-full" variant="primary">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </Card.Footer>
          </Card>

          {/* Stats Card */}
          <Card shadow="md">
            <Card.Content>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">1,234</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </Card.Content>
          </Card>
        </div>
        <div className="p-8 space-x-4">
          {/* Trigger Buttons */}
          <Button onClick={() => setShowBasic(true)}>Basic Modal</Button>

          <Button onClick={() => setShowLogin(true)} variant="secondary">
            Login Modal
          </Button>

          <Button onClick={() => setShowConfirm(true)} variant="danger">
            Confirm Modal
          </Button>

          {/* Basic Modal */}
          <Modal
            isOpen={showBasic}
            onClose={() => setShowBasic(false)}
            title="Basic Modal"
            size="md"
          >
            <Modal.Body>
              <p>This is a basic modal example with some content.</p>
              <p className="mt-4">
                You can close it by clicking the X button, pressing Escape, or
                clicking outside.
              </p>
            </Modal.Body>
          </Modal>

          {/* Login Modal */}
          <Modal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            title="Sign In"
            size="sm"
            closeOnOverlayClick={false}
          >
            <Modal.Body>
              <div className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  leftIcon={Mail}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  leftIcon={Lock}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogin(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">Sign In</Button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            title="Confirm Action"
            size="sm"
            closeOnOverlayClick={false}
          >
            <Modal.Body>
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="p-8 space-y-8">
          {/* Loading Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Variants</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Loading variant="spinner" text="Loading..." />
                <p className="text-sm text-gray-600">Spinner</p>
              </div>

              <div className="text-center space-y-2">
                <Loading variant="dots" color="primary" />
                <p className="text-sm text-gray-600">Dots</p>
              </div>

              <div className="text-center space-y-2">
                <Loading variant="pulse" color="primary" />
                <p className="text-sm text-gray-600">Pulse</p>
              </div>
            </div>
          </div>

          {/* Skeleton Loading */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Skeleton Loading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Loading.Skeleton lines={4} />
              <Loading.CardSkeleton />
            </div>
          </div>

          {/* Loading Overlay Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Overlay</h3>
            <div className="flex gap-4 mb-4">
              <Button onClick={() => setIsLoading(!isLoading)}>
                Toggle Loading Overlay
              </Button>
            </div>

            <Loading.Overlay
              isLoading={isLoading}
              className="h-32 border border-gray-200 rounded-lg"
            >
              <div className="p-6">
                <p>
                  This content will be covered by loading overlay when active.
                </p>
                <p className="mt-2">
                  Click the button above to toggle the loading state.
                </p>
              </div>
            </Loading.Overlay>
          </div>

          {/* Loading Button */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Button</h3>
            <Loading.Button
              loading={buttonLoading}
              onClick={handleButtonClick}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              {buttonLoading ? "Processing..." : "Click Me"}
            </Loading.Button>
          </div>

          {/* Full Screen Loading */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Full Screen Loading</h3>
            <Button
              onClick={() => {
                console.log("clicked");
                // Create a temporary div for React to render into
                const div = document.createElement("div");
                document.body.appendChild(div);

                // Mount the <Loading fullScreen /> component into it
                const root = ReactDOM.createRoot(div);
                root.render(<Loading fullScreen />);

                // Unmount after 2 seconds
                setTimeout(() => {
                  root.unmount(); // Cleanly remove the React component
                  document.body.removeChild(div); // Remove the container div
                }, 2000);
              }}
            >
              Show Full Screen Loading
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
