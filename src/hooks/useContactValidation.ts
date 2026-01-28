/**
 * REACT HOOK: useContactValidation
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Custom hook for validating contact field (email or mobile)
 * Provides real-time validation with error messages
 * 
 * Usage:
 *   const { contact, error, setContact, isValid, contactType } = useContactValidation();
 *   
 *   <input
 *     value={contact}
 *     onChange={(e) => setContact(e.target.value)}
 *     className={error ? 'input-error' : ''}
 *   />
 *   {error && <span className="error-message">{error}</span>}
 */

import { useState, useCallback } from 'react';
import { validateContact } from '@/lib/contactValidation';

interface ContactValidationState {
  contact: string;
  error: string | null;
  isValid: boolean;
  contactType: 'email' | 'mobile' | null;
  isTouched: boolean;
}

interface UseContactValidationReturn extends ContactValidationState {
  setContact: (value: string) => void;
  setTouched: (touched: boolean) => void;
  reset: () => void;
  getNormalizedValue: () => string | null;
}

/**
 * Hook for contact field validation
 * @returns {UseContactValidationReturn}
 */
export function useContactValidation(): UseContactValidationReturn {
  const [state, setState] = useState<ContactValidationState>({
    contact: '',
    error: null,
    isValid: false,
    contactType: null,
    isTouched: false
  });

  /**
   * Handle contact input change
   * Validates in real-time
   */
  const setContact = useCallback((value: string) => {
    const result = validateContact(value);

    setState({
      contact: value,
      error: result.error,
      isValid: result.isValid,
      contactType: result.isValid ? (result.type as 'email' | 'mobile') : null,
      isTouched: true
    });
  }, []);

  /**
   * Mark field as touched (for showing errors)
   */
  const setTouched = useCallback((touched: boolean) => {
    setState(prev => ({
      ...prev,
      isTouched: touched
    }));
  }, []);

  /**
   * Reset field to initial state
   */
  const reset = useCallback(() => {
    setState({
      contact: '',
      error: null,
      isValid: false,
      contactType: null,
      isTouched: false
    });
  }, []);

  /**
   * Get normalized value for API submission
   * Email: lowercase
   * Mobile: digits only
   */
  const getNormalizedValue = useCallback((): string | null => {
    if (!state.isValid) return null;

    const result = validateContact(state.contact);
    return result.value || null;
  }, [state.contact, state.isValid]);

  return {
    contact: state.contact,
    error: state.isTouched ? state.error : null,
    isValid: state.isValid,
    contactType: state.contactType,
    isTouched: state.isTouched,
    setContact,
    setTouched,
    reset,
    getNormalizedValue
  };
}
