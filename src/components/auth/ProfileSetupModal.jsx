import { useEffect, useState } from "react";
import { User, Mail, Phone, Check, X } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const ProfileSetupModal = ({ onClose }) => {
  const { user, isLoading, completeProfile } = useAuthStore();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const [formData, setFormData] = useState(() => ({
    name: "",
    phone: user?.phone || "",
    email: user?.email || "",
    newsletter: false,
    smsUpdates: true,
  }));

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [success, setSuccess] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const closeModal = () => {
    setErrors("");
    setSuccess("");
    onClose();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (hasErrors) return;

    setSuccess("");

    // Complete profile
    const profileData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      newsletter: formData.newsletter,
      smsUpdates: formData.smsUpdates,
    };

    const result = await completeProfile(profileData);

    if (result.success) {
      setSuccess(result.message || "Profile updated!");
      setTimeout(() => {
        closeModal();
      }, 1000);
    } else {
      setErrors(
        result.message || "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="sm"
      showCloseButton={false} // We'll add custom header with back & close
    >
      <Modal.Header className="border-b-0 pb-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={closeModal}
            className="absolute right-0 t-0 p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center">
          <span className="text-2xl font-bold text-gradient-primary">
            MANTRA
          </span>
        </div>
        <p className="text-sm text-gray-600 text-center mt-2">
          Welcome! Let's set up your profile to get started
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className=""
              required
              leftIcon={User}
              error={errors.name}
              helperText="Your name must be at least 10 characters"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className=""
              disabled={!!user?.email}
              required
              leftIcon={Mail}
            />
          </div>

          {/* Phone */}
          <div className="">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone (Without the country code)
            </label>

            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className=""
              disabled={!!user?.phone}
              required
              leftIcon={Phone}
              error={errors.phone}
              helperText="Your phone number must be 10 characters long"
              maxLength={10}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <span>Subscribe to newsletter</span>
            </label>

            <label className="flex items-center space-x-2">
              <Input
                type="checkbox"
                name="smsUpdates"
                checked={formData.smsUpdates}
                onChange={handleInputChange}
              />
              <span>Receive SMS updates</span>
            </label>
          </div>

          {/* Error/Success Messages
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )} */}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <Button type="submit" className="w-full">
            Complete Setup
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By completing setup, you agree to our Terms & Privacy Policy
        </p>
      </Modal.Body>
    </Modal>
  );
};
export default ProfileSetupModal;
