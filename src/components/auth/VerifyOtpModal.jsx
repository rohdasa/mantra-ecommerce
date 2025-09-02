// src/components/auth/VerifyOtpModal.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const VerifyOtpModal = ({ onClose, onVerifySuccess, onBack }) => {
  const {
    isLoading,
    otpTimer,
    resendOTP,
    verifyOTP,
    identifierType,
    maskedIdentifier,
    pendingIdentifier,
    resetOTPState,
    isNewUser,
    otpVerified,
  } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBack = () => {
    onBack();
  };

  const handleResendOTP = async () => {
    setError("");
    const result = await resendOTP();
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    const result = await verifyOTP(otp);

    if (result.success) {
      setSuccess(result.message);

      onVerifySuccess(result.data.isNewUser);

      setTimeout(() => {
        resetOTPState();
      }, 50);
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="sm"
      className="overflow-visible"
      showCloseButton={false} // We'll add custom header with back & close
    >
      {/* Custom Header with Back and Close */}
      <Modal.Header className="flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
            <p className="text-sm text-gray-500 mt-1 p-1">
              Enter the 6-digit code sent to
              {identifierType === "phone" ? " your phone" : " your email"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-gray-900 mt-1">
              {maskedIdentifier ||
                pendingIdentifier?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
            </p>
          </div>

          <div className="flex justify-center">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="text-center p-0"
              maxLength={6}
              disabled={isLoading}
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
            disabled={isLoading || otp.length !== 6}
            loading={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            {otpTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <span className="font-mono font-semibold">{otpTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyOtpModal;
