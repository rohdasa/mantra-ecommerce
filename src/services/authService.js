// Mock Users Database
const mockUsers = [
  {
    id: 1,
    phone: "+918888888888",
    email: "john@example.com",
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    addresses: [
      {
        id: 1,
        type: "home",
        name: "John Doe",
        phone: "+918888888888",
        address: "123 MG Road, Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560034",
        isDefault: true,
      },
    ],
    preferences: {
      notifications: true,
      newsletter: false,
      smsUpdates: true,
    },
  },
  {
    id: 2,
    phone: "+919999999999",
    email: "jane@example.com",
    name: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150",
    addresses: [
      {
        id: 1,
        type: "home",
        name: "Jane Smith",
        phone: "+919999999999",
        address: "456 Brigade Road, Church Street",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true,
      },
    ],
    preferences: {
      notifications: true,
      newsletter: true,
      smsUpdates: false,
    },
  },
];

// Configuration
const CONFIG = {
  MOCK_OTP: "123456",
  OTP_EXPIRY_TIME: 300, // 5 minutes
  OTP_RESEND_DELAY: 30, // 30 seconds
  API_DELAY: 1000, // Simulate API delay
};

// Store OTP data temporarily
const otpStore = new Map();

// Utility Functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const detectIdentifier = (identifier) => {
  const trimmed = identifier.trim();
  if (/^[+]?[0-9\s\-()]+$/.test(trimmed)) {
    return "phone";
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "email";
  }
  return null;
};

const normalizePhone = (phone) => {
  let cleaned = phone.replace(/\s|-|\(|\)/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = "+" + cleaned;
  } else if (cleaned.length === 10) {
    cleaned = "+91" + cleaned;
  }
  return cleaned;
};

const validateIdentifier = (identifier) => {
  const type = detectIdentifier(identifier);
  if (!type) {
    return {
      isValid: false,
      error: "Please enter a valid phone number or email",
    };
  }
  if (type === "phone") {
    const normalized = normalizePhone(identifier);
    if (normalized.length < 10) {
      return { isValid: false, error: "Please enter a valid phone number" };
    }
  }

  return {
    isValid: true,
    type,
    normalized: type === "phone" ? normalizePhone(identifier) : identifier,
  };
};

const maskIdentifier = (identifier, type) => {
  if (type === "phone") {
    return identifier.replace(/(\+91)(\d{5})(\d{5})/, "$1 $2 *****");
  }
  return identifier.replace(/(.{2})(.*)(@.*)/, "$1***$3");
};

const capitalizeName = (name) =>
  name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const authService = {
  // Send OTP
  async sendOTP(identifier) {
    const validation = validateIdentifier(identifier);
    if (!validation.isValid) {
      return { success: false, message: validation.error };
    }

    const { type, normalized } = validation;
    let user = mockUsers.find(
      (u) => u.phone === normalized || u.email === normalized
    );
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = {
        id: mockUsers.length + 1,
        phone: type === "phone" ? normalized : null,
        email: type === "email" ? normalized : null,
        name: null, // Will be collected after OTP verification
        avatar: null,
        addresses: [],
        preferences: {
          notifications: true,
          newsletter: false,
          smsUpdates: true,
        },
        isNewUser: true,
      };
      console.log("New user detected, creating placeholder");
    } else {
      console.log("Existing user found:", user.name);
    }

    await sleep(CONFIG.API_DELAY);

    otpStore.set(normalized, {
      otp: CONFIG.MOCK_OTP,
      user,
      identifier,
      type,
      timestamp: Date.now(),
      attempts: 0,
    });

    setTimeout(
      () => otpStore.delete(normalized),
      CONFIG.OTP_EXPIRY_TIME * 1000
    );

    return {
      success: true,
      message: `OTP sent to your ${type}`,
      data: {
        type,
        maskedIdentifier: maskIdentifier(normalized, type),
        isNewUser,
      },
    };
  },

  // VErify OTP
  async verifyOTP(identifier, otp) {
    const validation = validateIdentifier(identifier);
    if (!validation.isValid) {
      return { success: false, message: validation.error };
    }

    const { normalized } = validation;
    const otpData = otpStore.get(normalized);

    if (!otpData) {
      return {
        success: false,
        message: "OTP expired or not found. Please request a new OTP.",
      };
    }

    if (otpData.attempts >= 3) {
      otpStore.delete(normalized);
      return {
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      };
    }

    const isExpired =
      Date.now() - otpData.timestamp > CONFIG.OTP_EXPIRY_TIME * 1000;
    if (isExpired) {
      otpStore.delete(normalized);
      return {
        success: false,
        message: "OTP expired. Please request a new OTP.",
      };
    }
    if (otp !== otpData.otp) {
      otpData.attempts += 1;
      return {
        success: false,
        message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`,
      };
    }

    await sleep(800);

    // If new user, add to mockUsers array
    if (otpData.user.isNewUser) {
      // Don't add incomplete user yet - will be completed in profile setup
      console.log("New user verified, will complete profile setup");
    }

    otpStore.delete(normalized);

    return {
      success: true,
      message: "Login successful!",
      data: {
        user: otpData.user,
        accessToken: `mock_access_token_${otpData.user.id}`,
        refreshToken: `mock_refresh_token_${otpData.user.id}`,
        isNewUser: otpData.user.isNewUser || false,
      },
    };
  },

  async resendOTP(identifier) {
    return this.sendOTP(identifier);
  },

  // Complete new user profile
  completeProfile: async function (userId, profileData) {
    try {
      console.log("Completing profile for user:", userId, profileData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validate required fields
      if (!profileData.name || !profileData.name.trim()) {
        return { success: false, message: "Name is required" };
      }

      // Create complete user object
      const completeUser = {
        id: userId,
        name: capitalizeName(profileData.name.trim()),
        phone: profileData.phone || null,
        email: profileData.email || null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profileData.name
        )}&size=150&background=random`,
        addresses: [],
        preferences: {
          notifications: true,
          newsletter: Boolean(profileData.newsletter),
          smsUpdates: Boolean(profileData.smsUpdates),
        },
        createdAt: new Date().toISOString(),
      };

      // Add to mockUsers array
      mockUsers.push(completeUser);

      console.log("New user added to database:", completeUser);

      return {
        success: true,
        message: "Profile completed successfully!",
        data: {
          user: completeUser,
        },
      };
    } catch (error) {
      console.error("Complete profile error:", error);
      return {
        success: false,
        message: "Failed to complete profile. Please try again.",
      };
    }
  },

  // // Get user profile
  // async getUserProfile(userId) {
  //   await sleep(500);
  //   const user = mockUsers.find(u => u.id === userId);
  //   if (!user) return { success: false, message: "User not found" };
  //   return { success: true, data: { user } };
  // },

  // // Update user profile
  // async updateUserProfile(userId, updates) {
  //   await sleep(800);
  //   const userIndex = mockUsers.findIndex(u => u.id === userId);
  //   if (userIndex === -1) return { success: false, message: "User not found" };

  //   mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

  //   return {
  //     success: true,
  //     message: "Profile updated successfully",
  //     data: { user: mockUsers[userIndex] }
  //   };
  // },

  // Helpers for testing/dev
  getMockUsers() {
    return mockUsers;
  },

  getMockOTP() {
    return CONFIG.MOCK_OTP;
  },

  clearOTPStore() {
    otpStore.clear();
  },
};
