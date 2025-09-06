import { useState, useEffect } from "react";
import { Phone, Mail, CheckCircle, User } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const LoginModal = ({ onClose, onLoginSuccess, isOpen }) => {
  const { isLoading, sendOTP, getMockUsers, getMockOTP } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localIdentifierType, setLocalIdentifierType] = useState("");

  useEffect(() => {
    const trimmed = identifier.trim();
    if (/^[+]?[0-9\s\-()]+$/.test(trimmed)) {
      setLocalIdentifierType("phone");
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setLocalIdentifierType("email");
    } else {
      setLocalIdentifierType("");
    }
  }, [identifier]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier.trim()) {
      setError("Please enter your phone number or email");
      return;
    }

    const result = await sendOTP(identifier);

    if (result.success) {
      onLoginSuccess();
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const getPlaceholder = () => {
    if (localIdentifierType === "phone") return "Enter phone number";
    if (localIdentifierType === "email") return "Enter email address";
    return "Phone number or Email";
  };

  const getInputIcon = () => {
    if (localIdentifierType === "phone")
      return <Phone className="w-5 h-5 text-gray-400" />;
    if (localIdentifierType === "email")
      return <Mail className="w-5 h-5 text-gray-400" />;
    return <User className="w-5 h-5 text-gray-400" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login to your account"
      size="sm"
      showCloseButton={true}
    >
      <Modal.Body>
        {/* Header */}

        <p className="text-sm text-gray-500 mb-4 p-1">
          Enter your phone number (without country code) or email to continue
        </p>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="relative">
            {localIdentifierType && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    localIdentifierType === "phone"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {localIdentifierType === "phone" ? "Phone" : "Email"}
                </span>
              </div>
            )}
            <Input
              type="text"
              placeholder={getPlaceholder()}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              maxLength={localIdentifierType === "phone" ? 10 : ""}
              leftIcon={() => getInputIcon()}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !identifier.trim()}
            loading={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 text-sm mb-2">
            Test Users:
          </h4>
          <div className="space-y-2 text-xs text-yellow-700">
            {getMockUsers().map((user) => (
              <div key={user.id} className="flex justify-between">
                <span>{user.name}:</span>
                <span>
                  {user.phone} | {user.email}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-yellow-200">
              <span className="font-mono font-bold">
                Mock OTP: {getMockOTP()}
              </span>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
