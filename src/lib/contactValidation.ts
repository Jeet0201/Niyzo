/**
 * CONTACT FIELD VALIDATION
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Validates contact field (email OR mobile)
 * Can be used in both frontend and backend
 * 
 * Usage:
 *   const result = validateContact("john@example.com");
 *   const result = validateContact("9876543210");
 */

/**
 * Validate if input is a valid email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 simplified
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate if input is a valid Indian mobile number
 * @param {string} mobile - Can contain formatting (spaces, dashes, parentheses)
 * @returns {boolean}
 */
function isValidMobileNumber(mobile) {
  if (!mobile || typeof mobile !== 'string') return false;
  
  // Extract digits only
  const digitsOnly = mobile.replace(/\D/g, '');
  
  // Must be exactly 10 digits
  if (digitsOnly.length !== 10) return false;
  
  // Check if it's a fake/invalid number
  if (isFakeMobileNumber(digitsOnly)) {
    return false;
  }
  
  return true;
}

/**
 * Detect fake/invalid mobile numbers
 * Rejects:
 *   - All same digits (0000000000, 1111111111, etc)
 *   - Sequential patterns (1234567890, 0987654321, etc)
 * 
 * @param {string} digitsOnly - 10-digit mobile string
 * @returns {boolean} - true if it's a FAKE number
 */
function isFakeMobileNumber(digitsOnly) {
  if (!digitsOnly || digitsOnly.length !== 10) return true;
  
  // Pattern 1: All same digit (0000000000, 1111111111, etc)
  if (/^(.)\1{9}$/.test(digitsOnly)) {
    return true;
  }
  
  // Pattern 2: Sequential ascending (0123456789, 1234567890, 2345678901, etc)
  if (isSequentialAscending(digitsOnly)) {
    return true;
  }
  
  // Pattern 3: Sequential descending (9876543210, 8765432109, etc)
  if (isSequentialDescending(digitsOnly)) {
    return true;
  }
  
  // Pattern 4: Repeating pairs (1212121212, 0909090909, etc)
  if (/^(..)(\1){4}$/.test(digitsOnly)) {
    return true;
  }
  
  // Pattern 5: Repeating triples (1231231231, 0000000000, etc)
  if (/^(...)(\1){3}$/.test(digitsOnly)) {
    return true;
  }
  
  return false;
}

/**
 * Check if digits are in ascending sequence
 * @param {string} digitsOnly
 * @returns {boolean}
 */
function isSequentialAscending(digitsOnly) {
  for (let i = 0; i < digitsOnly.length - 1; i++) {
    const current = parseInt(digitsOnly[i]);
    const next = parseInt(digitsOnly[i + 1]);
    // Check if next is current+1 (with wrap around for 9→0)
    const expectedNext = (current + 1) % 10;
    if (next !== expectedNext) {
      return false;
    }
  }
  return true;
}

/**
 * Check if digits are in descending sequence
 * @param {string} digitsOnly
 * @returns {boolean}
 */
function isSequentialDescending(digitsOnly) {
  for (let i = 0; i < digitsOnly.length - 1; i++) {
    const current = parseInt(digitsOnly[i]);
    const next = parseInt(digitsOnly[i + 1]);
    // Check if next is current-1 (with wrap around for 0→9)
    const expectedNext = current === 0 ? 9 : current - 1;
    if (next !== expectedNext) {
      return false;
    }
  }
  return true;
}

/**
 * MAIN VALIDATION FUNCTION
 * Determines if input is valid email OR valid mobile
 * 
 * @param {string} contact - Email or mobile number
 * @returns {Object} {
 *   isValid: boolean,
 *   type: 'email' | 'mobile' | 'invalid',
 *   error: string | null
 * }
 */
function validateContact(contact) {
  if (!contact || typeof contact !== 'string') {
    return {
      isValid: false,
      type: 'invalid',
      error: 'Contact information is required'
    };
  }

  const trimmed = contact.trim();

  // Check if it looks like an email (contains @)
  if (trimmed.includes('@')) {
    if (isValidEmail(trimmed)) {
      return {
        isValid: true,
        type: 'email',
        value: trimmed.toLowerCase(),
        error: null
      };
    } else {
      return {
        isValid: false,
        type: 'email',
        error: 'Invalid email format. Use: example@domain.com'
      };
    }
  }

  // Assume it's a mobile number
  if (isValidMobileNumber(trimmed)) {
    const digitsOnly = trimmed.replace(/\D/g, '');
    return {
      isValid: true,
      type: 'mobile',
      value: digitsOnly,
      error: null
    };
  } else {
    // Provide specific error based on what's wrong
    const digitsOnly = trimmed.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) {
      return {
        isValid: false,
        type: 'mobile',
        error: 'Please enter a valid email or 10-digit mobile number'
      };
    }

    if (digitsOnly.length !== 10) {
      return {
        isValid: false,
        type: 'mobile',
        error: `Mobile number must be exactly 10 digits (you entered ${digitsOnly.length})`
      };
    }

    if (/^(.)\1{9}$/.test(digitsOnly)) {
      return {
        isValid: false,
        type: 'mobile',
        error: 'Mobile number cannot have all same digits (e.g., 0000000000)'
      };
    }

    if (isSequentialAscending(digitsOnly) || isSequentialDescending(digitsOnly)) {
      return {
        isValid: false,
        type: 'mobile',
        error: 'Mobile number cannot be sequential (e.g., 1234567890)'
      };
    }

    return {
      isValid: false,
      type: 'mobile',
      error: 'Please enter a valid email or 10-digit mobile number'
    };
  }
}

// Export for ES modules
export {
  validateContact,
  isValidEmail,
  isValidMobileNumber,
  isFakeMobileNumber
};

// Also support CommonJS for Node.js backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateContact,
    isValidEmail,
    isValidMobileNumber,
    isFakeMobileNumber
  };
}
